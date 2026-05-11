import { openai } from './openai';
import { getSupabaseAdmin } from './supabaseAdmin';

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function findSimilarEntries(
  userId: string,
  text: string,
  limit: number = 2
) {
  const embedding = await getEmbedding(text);
  const { data } = await getSupabaseAdmin().rpc('match_journal_entries', {
    query_embedding: embedding,
    match_threshold: 0.7,
    match_count: limit,
    user_id_input: userId,
  });
  return data || [];
}
