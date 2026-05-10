import { openai } from './openai';

export interface AnalysisResult {
  emotion: string;
  themes: string[];
  urgency_score: number;
  cognitive_distortions: string[];
}

export async function analyzeEntry(text: string): Promise<AnalysisResult> {
  const prompt = `Analyze this journal entry and return JSON with:
- emotion: primary emotion (one word)
- themes: array of 2-3 key themes
- urgency_score: 0-1 based on emotional intensity
- cognitive_distortions: array of any cognitive distortions present (e.g., "all-or-nothing", "catastrophizing", "personalization")

Entry: ${text}

Return only valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  return JSON.parse(completion.choices[0].message.content!);
}

export function calculateEmotionTrend(entries: AnalysisResult[]): Record<string, number> {
  const emotionCounts: Record<string, number> = {};
  entries.forEach(entry => {
    emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
  });
  
  const total = entries.length;
  return Object.fromEntries(
    Object.entries(emotionCounts).map(([k, v]) => [k, v / total])
  );
}
