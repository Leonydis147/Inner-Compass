import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { entryId, feedback, rating } = await req.json();

  if (!entryId || !feedback) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await supabase.from('coach_feedback').insert({
    entry_id: entryId,
    feedback_text: feedback,
    rating: rating || null,
    created_at: new Date(),
  });

  return NextResponse.json({ success: true });
}
