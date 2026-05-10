import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, circleId } = await req.json();

  if (!userId || !circleId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Fetch recent entries for this circle
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('content, detected_emotion, life_domain')
    .eq('user_id', userId)
    .eq('circle_id', circleId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (!entries || entries.length === 0) {
    return NextResponse.json({ insights: 'No entries yet for this circle.' });
  }

  // Generate insights
  const prompt = `Analyze these journal entries and provide 2-3 brief insights about patterns:
${entries.map(e => `- ${e.content.substring(0, 200)} (emotion: ${e.detected_emotion}, domain: ${e.life_domain})`).join('\n')}

Return JSON: { "insights": ["insight 1", "insight 2"], "dominant_emotion": "...", "suggested_focus": "..." }`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.5,
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content!));
}
