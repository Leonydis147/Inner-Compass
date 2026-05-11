import { getSupabaseAdmin } from './supabaseAdmin';

export interface MemoryContext {
  pastEntries: string[];
  patterns: string[];
}

export async function getMemoryContext(userId: string, limit: number = 5): Promise<MemoryContext> {
  const { data: entries } = await getSupabaseAdmin()
    .from('journal_entries')
    .select('content')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return {
    pastEntries: entries?.map(e => e.content) || [],
    patterns: [],
  };
}
