import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { openai } from '@/lib/openai';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId, circleId } = await req.json();

    if (!userId || !circleId) {
      return NextResponse.json({ error: 'Missing required fields: userId and circleId' }, { status: 400 });
    }

    // Fetch recent entries for this circle
    const { data: entries, error } = await getSupabaseAdmin()
      .from('journal_entries')
      .select('content, detected_emotion, life_domain')
      .eq('user_id', userId)
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
    }

    if (!entries || entries.length === 0) {
      return NextResponse.json({ 
        insights: 'No entries yet for this circle.',
        dominant_emotion: null,
        suggested_focus: null 
      });
    }

    // Generate insights
    const prompt = `Analyze these journal entries and provide 2-3 brief insights about patterns:
${entries.map(e => `- ${e.content.substring(0, 200)} (emotion: ${e.detected_emotion || 'unknown'}, domain: ${e.life_domain || 'unknown'})`).join('\n')}

Return JSON: { "insights": ["insight 1", "insight 2"], "dominant_emotion": "...", "suggested_focus": "..." }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const response = JSON.parse(completion.choices[0].message.content!);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Circle insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
