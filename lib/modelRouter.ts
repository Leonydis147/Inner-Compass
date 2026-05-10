interface RouterParams {
  intent: 'reflection' | 'emotion_classify' | 'weekly_summary';
  isCrisis: boolean;
  textLength: number;
}

export function selectModel({ intent, isCrisis, textLength }: RouterParams): string {
  if (isCrisis) return 'gpt-4-turbo';
  if (intent === 'emotion_classify') return 'gpt-3.5-turbo';
  if (intent === 'weekly_summary') return 'gpt-3.5-turbo-16k';
  return process.env.FINE_TUNE_MODEL_ID || 'gpt-4-turbo';
}
