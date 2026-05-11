import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { entryId, feedback, rating } = await req.json();

    if (!entryId || !feedback) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await getSupabaseAdmin().from('coach_feedback').insert({
      entry_id: entryId,
      feedback_text: feedback,
      rating: rating || null,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Coach feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
