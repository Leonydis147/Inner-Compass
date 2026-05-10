import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openai';
import { checkSafety, containsCrisisKeywords } from '@/lib/safety';
import { crisisResponse } from '@/lib/crisisResources';
import { findSimilarEntries } from '@/lib/vector';
import { getUserArchetypeProfile, getArchetypeScores, archetypeToNaturalLanguage } from '@/lib/archetype';
import { classifyDomain } from '@/lib/domainClassifier';
import { selectModel } from '@/lib/modelRouter';
import { logExperiment } from '@/lib/analytics';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const start = Date.now();
  const { journalText, userId } = await req.json();

  if (!journalText || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // 1. Safety check
  const safety = await checkSafety(journalText);
  if (safety.flagged || containsCrisisKeywords(journalText)) {
    return NextResponse.json(crisisResponse);
  }

  // 2. Rate limiting
  const { data: allowed } = await supabaseAdmin.rpc('check_rate_limit', { p_user_id: userId });
  if (!allowed) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
  }

  // 3. Vector search & archetype profile
  const similarEntries = await findSimilarEntries(userId, journalText, 2);
  const profile = await getUserArchetypeProfile(userId);
  const memoryContext = similarEntries
    .map(e => `On ${new Date(e.created_at).toLocaleDateString()}: "${e.content.substring(0, 150)}"`)
    .join('\n');

  // 4. Archetype scores for this entry
  const { data: trends } = await supabaseAdmin
    .from('user_weekly_trends')
    .select('archetype_frequency')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(4);
  const archetypeScores = await getArchetypeScores(journalText, trends || []);
  const primaryArchetype = Object.entries(archetypeScores).sort((a,b) => b[1]-a[1])[0][0];
  const archetypeDesc = archetypeToNaturalLanguage(primaryArchetype);

  // 5. Life domain
  const lifeDomain = await classifyDomain(journalText);

  // 6. Model selection (assume intent = 'reflection')
  const isCrisis = safety.categories?.some(c => ['self_harm','violence','harassment'].includes(c)) ?? false;
  const modelToUse = selectModel({ intent: 'reflection', isCrisis, textLength: journalText.length });

  // 7. System prompt
  const systemPrompt = `You are Inner Compass, an AI mentor in biblical psychology and behavioral science.
Respond with JSON: { "emotion": "...", "validation": "...", "insight": "...", "reflection_question": "...", "action_step": "...", "urgency_score": 0.0 }.
User archetype pattern: ${archetypeDesc}. Life domain: ${lifeDomain}.
Past context: ${memoryContext}
Be compassionate, never religious prescription.`;

  // 8. Streaming response
  let accumulated = '';
  const textStream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: modelToUse,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: journalText },
          ],
          response_format: { type: 'json_object' },
          stream: true,
          temperature: 0.7,
        });
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            accumulated += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
        
        // After stream ends, log and save journal entry
        try {
          const finalJson = JSON.parse(accumulated);
          const latency = Date.now() - start;
          await logExperiment(userId, modelToUse, latency, journalText.length, finalJson);
          await supabaseAdmin.from('journal_entries').insert({
            user_id: userId,
            content: journalText,
            detected_emotion: finalJson.emotion,
            life_domain: lifeDomain,
            archetype_scores: archetypeScores,
          });
        } catch (err) {
          console.error('Logging error', err);
        }
      } catch (err) {
        console.error('Stream error', err);
        controller.error(err);
      }
    },
  });

  return new Response(textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
