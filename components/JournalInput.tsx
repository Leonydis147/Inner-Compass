'use client';

import { useState } from 'react';

interface JournalInputProps {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
}

export default function JournalInput({ onSubmit, loading }: JournalInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    
    await onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind today?"
        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        disabled={loading}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {text.length} characters
        </span>
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {loading ? 'Reflecting...' : 'Get Insight'}
        </button>
      </div>
    </form>
  );
}
