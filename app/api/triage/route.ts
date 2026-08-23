import { NextRequest, NextResponse } from 'next/server';
import { classifyTriage, Vitals } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const symptoms: string = body.symptoms?.trim();
    const vitals: Vitals = body.vitals ?? {};

    if (!symptoms) {
      return NextResponse.json({ error: 'Symptoms are required' }, { status: 400 });
    }

    const result = await classifyTriage(symptoms, vitals);

    const { data, error } = await supabase
      .from('triage_records')
      .insert({
        symptoms,
        vitals,
        urgency_level: result.urgency_level,
        ai_recommendation: result.recommendation,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save triage record' }, { status: 500 });
    }

    return NextResponse.json({
      ...data,
      likely_conditions: result.likely_conditions,
    });
  } catch (err) {
    console.error('Triage API error:', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
