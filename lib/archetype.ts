import { openai } from './openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserArchetypeProfile(userId: string) {
  const { data } = await supabase
    .from('user_archetype_profiles')
    .select('primary_archetype, secondary_archetype')
    .eq('user_id', userId)
    .single();
  return data;
}

export async function getArchetypeScores(
  text: string,
  recentTrends: any[]
): Promise<Record<string, number>> {
  const prompt = `Based on this journal entry and recent archetype frequencies (${JSON.stringify(
    recentTrends
  )}), return a JSON object with scores (0-1) for: Cain, Jonah, Solomon, Moses, Job, David. Sum to 1.\n\nEntry: ${text}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  return JSON.parse(res.choices[0].message.content!);
}

export function archetypeToNaturalLanguage(archetype: string): string {
  const map: Record<string, string> = {
    Cain: 'comparison and hidden resentment',
    Jonah: 'avoidance mixed with fear of responsibility',
    Solomon: 'excess and spiritual burnout',
    Moses: 'leadership doubt and liberating potential',
    Job: 'deep suffering searching for meaning',
    David: 'passionate highs and remorseful lows',
  };
  return map[archetype] || 'a pattern that needs reflection';
}
