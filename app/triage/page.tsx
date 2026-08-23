'use client';

import { useState } from 'react';

type TriageResponse = {
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  ai_recommendation: string;
  likely_conditions: string[];
};

const urgencyColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  emergency: 'bg-red-100 text-red-800 border-red-300',
};

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState('');
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [temp, setTemp] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!symptoms.trim()) {
      setError('Please describe the symptoms.');
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          vitals: { bp, pulse, temp },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Nkwa Triage</h1>
        <p className="text-sm text-gray-500 mb-6">Symptom &amp; vitals intake</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-xl border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm"
              placeholder="Describe what the patient is experiencing..."
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">BP</label>
              <input value={bp} onChange={(e) => setBp(e.target.value)} placeholder="120/80"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pulse</label>
              <input value={pulse} onChange={(e) => setPulse(e.target.value)} placeholder="78 bpm"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Temp</label>
              <input value={temp} onChange={(e) => setTemp(e.target.value)} placeholder="37°C"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm" />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-700 text-white rounded-lg py-3 text-sm font-semibold disabled:opacity-50">
            {loading ? 'Classifying...' : 'Submit for triage'}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-white p-5 rounded-xl border border-gray-200 space-y-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${urgencyColors[result.urgency_level]}`}>
              {result.urgency_level.toUpperCase()} URGENCY
            </span>

            {result.likely_conditions?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Likely conditions</p>
                <ul className="text-sm text-gray-800 list-disc list-inside">
                  {result.likely_conditions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Recommendation</p>
              <p className="text-sm text-gray-800">{result.ai_recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
