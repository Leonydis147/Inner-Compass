import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { openai } from '@/lib/openai';
import { checkSafety, containsCrisisKeywords } from '@/lib/safety';
import { crisisResponse } from '@/lib/crisisResources';
import { findSimilarEntries } from '@/lib/vector';
import { getUserArchetypeProfile, getArchetypeScores, archetypeToNaturalLanguage } from '@/lib/archetype';
import { classifyDomain } from '@/lib/domainClassifier';
import { selectModel } from '@/lib/modelRouter';
import { logExperiment } from '@/lib/analytics';

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
  const { data: allowed } = await getSupabaseAdmin().rpc('check_rate_limit', { p_user_id: userId });
  if (!allowed) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
  }

  // 3. Vector search & archetype profile
  const similarEntries = await findSimilarEntries(userId, journalText, 2);
  const profile = await getUserArchetypeProfile(userId);
  const memoryContext = similarEntries
    .map((e: { created_at: string; content: string }) => `On ${new Date(e.created_at).toLocaleDateString()}: "${e.content.substring(0, 150)}"`)
    .join('\n');

  // 4. Archetype scores for this entry
  const { data: trends } = await getSupabaseAdmin()
    .from('user_weekly_trends')
    .select('archetype_frequency')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(4);

  const recentArchetypes = trends && trends.length > 0
    ? await getArchetypeScores(journalText, trends.map((t: any) => t.archetype_frequency))
    : {};
  const primaryArchetype = Object.keys(recentArchetypes).length > 0
    ? Object.entries(recentArchetypes).sort((a, b) => b[1] - a[1])[0][0]
    : 'unknown';

  // 5. Domain classification
  const domain = await classifyDomain(journalText);

  // 6. Select model based on entry complexity
  const model = selectModel({
    intent: 'reflection',
    isCrisis: containsCrisisKeywords(journalText),
    textLength: journalText.length,
  });

  // 7. Generate coaching response
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: `You are a compassionate journaling coach combining biblical wisdom and behavioral science.
Provide personalized insights based on the user's entry, their archetype patterns, and emotional state.
Be warm, non-judgmental, and practical.`,
      },
      {
        role: 'user',
        content: `Journal entry: "${journalText}"

Context:
- Domain: ${domain}
- Recent patterns: ${memoryContext || 'No recent entries'}
- Archetype tendencies: ${archetypeToNaturalLanguage(primaryArchetype)}

Provide a thoughtful, personalized response.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const coaching = response.choices[0].message.content || '';

  // 8. Log experiment for model comparison  
  await logExperiment(userId, model, Date.now() - start, journalText.length, coaching);

  // 9. Save journal entry with embedding
  const { data: entry } = await getSupabaseAdmin().rpc('insert_journal_entry', {
    p_user_id: userId,
    p_content: journalText,
    p_domain: domain,
    p_archetype_scores: recentArchetypes,
  });

  return NextResponse.json({
    success: true,
    coaching,
    entryId: entry?.id,
    domain,
  });
}
