'use client';

import { useState } from 'react';

export default function Home() {
  const [journalText, setJournalText] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          journalText, 
          userId: 'demo-user' // Replace with real auth
        }),
      });
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value);
          // You can update UI incrementally here if desired
        }
        setResponse(JSON.parse(accumulated));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inner Compass</h1>
      <p className="text-gray-600 mb-8">
        Your AI-powered journaling coach combining biblical psychology and behavioral science.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-primary"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Reflecting...' : 'Get Insight'}
        </button>
      </form>

      {response && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Emotion Detected</h3>
            <p className="text-gray-700">{response.emotion}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Validation</h3>
            <p className="text-gray-700">{response.validation}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Insight</h3>
            <p className="text-gray-700">{response.insight}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Reflection Question</h3>
            <p className="text-gray-700 italic">{response.reflection_question}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Action Step</h3>
            <p className="text-gray-700">{response.action_step}</p>
          </div>
        </div>
      )}
    </main>
  );
}
