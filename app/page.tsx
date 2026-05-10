'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to journal page
    router.push('/journal');
  }, [router]);

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">Inner Compass</h1>
        <p className="text-gray-600 mb-8">
          Your AI-powered journaling coach combining biblical psychology and behavioral science.
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </main>
  );
}
