import { openai } from './openai';

const crisisKeywords = [
  'kill myself', 'suicide', 'self harm', 'want to die',
  'end my life', 'i give up', 'no reason to live'
];

export async function checkSafety(text: string) {
  try {
    const moderation = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: text,
    });
    const result = moderation.results[0];
    if (result.flagged) {
      const categories = Object.entries(result.categories)
        .filter(([, v]) => v === true)
        .map(([k]) => k);
      return { flagged: true, categories };
    }
    return { flagged: false, categories: [] };
  } catch (error) {
    console.error('Moderation error:', error);
    // fallback keyword check
    const flagged = crisisKeywords.some(kw => text.toLowerCase().includes(kw));
    return { flagged, categories: flagged ? ['keyword_fallback'] : [] };
  }
}

export function containsCrisisKeywords(text: string): boolean {
  return crisisKeywords.some(kw => text.toLowerCase().includes(kw));
}
