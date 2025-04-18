'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [message, setMessage] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Test Page</h1>
      {error ? (
        <div className="text-red-500 mb-4">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="text-green-500 mb-4">
          <p>Message: {message}</p>
        </div>
      )}
      <div className="mt-8">
        <p className="text-gray-500">
          This page tests if the API is working properly.
        </p>
      </div>
    </div>
  );
} 