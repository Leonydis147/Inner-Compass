import { getSupabaseAdmin } from './supabaseAdmin';

export async function logExperiment(
  userId: string,
  modelUsed: string,
  latencyMs: number,
  inputLength: number,
  response: any
) {
  await getSupabaseAdmin().from('ab_test_events').insert({
    user_id: userId,
    model_used: modelUsed,
    latency_ms: latencyMs,
    input_length: inputLength,
    response_length: JSON.stringify(response).length,
    timestamp: new Date().toISOString(),
  }).select(); // ignore result
}
