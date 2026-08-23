import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type Vitals = {
  bp?: string;
  pulse?: string;
  temp?: string;
};

export type TriageResult = {
  urgency_level: 'low' | 'medium' | 'high' | 'emergency';
  likely_conditions: string[];
  recommendation: string;
};

export async function classifyTriage(
  symptoms: string,
  vitals: Vitals
): Promise<TriageResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a clinical triage assistant. Given the patient's symptoms and vitals, classify urgency and suggest next steps.

Symptoms: ${symptoms}
Vitals: ${JSON.stringify(vitals)}

Respond with STRICT JSON only, no markdown, no explanation, in exactly this shape:
{"urgency_level": "low" | "medium" | "high" | "emergency", "likely_conditions": ["condition1", "condition2"], "recommendation": "plain language next step for the patient"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      urgency_level: parsed.urgency_level ?? 'medium',
      likely_conditions: parsed.likely_conditions ?? [],
      recommendation: parsed.recommendation ?? 'Please consult a clinician for further evaluation.',
    };
  } catch (err) {
    console.error('Failed to parse Gemini response:', text);
    return {
      urgency_level: 'medium',
      likely_conditions: [],
      recommendation: 'Unable to auto-classify. Please have a clinician review these symptoms.',
    };
  }
}
