import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function logExperiment(
  userId: string,
  modelUsed: string,
  latencyMs: number,
  inputLength: number,
  response: any
) {
  await supabase.from('ab_test_events').insert({
    user_id: userId,
    model_used: modelUsed,
    latency_ms: latencyMs,
    input_length: inputLength,
    response_length: JSON.stringify(response).length,
    timestamp: new Date(),
  }).select(); // ignore result
}
