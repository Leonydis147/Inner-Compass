import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface MemoryContext {
  pastEntries: string[];
  patterns: string[];
  recentEmotions: string[];
}

export async function getMemoryContext(
  userId: string,
  limit: number = 5
): Promise<MemoryContext> {
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('content, detected_emotion')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!entries || entries.length === 0) {
    return { pastEntries: [], patterns: [], recentEmotions: [] };
  }

  return {
    pastEntries: entries.map(e => e.content.substring(0, 200)),
    patterns: [], // Could be computed from archetype analysis
    recentEmotions: entries.map(e => e.detected_emotion).filter(Boolean) as string[],
  };
}

export async function buildMemoryPrompt(
  userId: string,
  currentEntry: string
): Promise<string> {
  const context = await getMemoryContext(userId);
  
  if (context.pastEntries.length === 0) {
    return 'This is a new user with no journaling history.';
  }

  return `Past journal context:
${context.pastEntries.map((e, i) => `${i + 1}. "${e}"`).join('\n')}

Recent emotional patterns: ${context.recentEmotions.join(', ') || 'none identified'}`;
}
