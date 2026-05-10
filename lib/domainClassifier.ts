import { openai } from './openai';

export async function classifyDomain(text: string): Promise<string> {
  const prompt = `Classify the following journal entry into exactly one domain: relationships, career, purpose, discipline, loneliness, addiction, finances, health, faith, other. Return only the domain word.\n\nEntry: ${text}`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 10,
    temperature: 0,
  });
  return completion.choices[0].message.content?.trim().toLowerCase() || 'other';
}
