'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import JournalInput from '@/components/JournalInput';
import CoachResponse from '@/components/CoachResponse';
import { useRouter } from 'next/navigation';

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (text: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          journalText: text, 
          userId: user.id 
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
        }
        const result = JSON.parse(accumulated);
        setResponse(result);
        
        // Save entry to Supabase
        await supabase.from('journal_entries').insert({
          user_id: user.id,
          content: text,
          detected_emotion: result.emotion,
          life_domain: result.life_domain,
          archetype_scores: result.archetype_scores,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inner Compass</h1>
        {user && (
          <div className="text-sm text-gray-600">
            {user.email?.split('@')[0]}
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-8">
        Your AI-powered journaling coach combining biblical psychology and behavioral science.
      </p>
      
      <JournalInput onSubmit={handleSubmit} loading={loading} />

      {response && (
        <CoachResponse {...response} />
      )}
    </main>
  );
}
