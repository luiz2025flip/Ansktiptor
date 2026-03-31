import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveContent(userId: string, title: string, body: string, type: string, metadata: any = {}) {
  const { data, error } = await supabase
    .from('contents')
    .insert([{ user_id: userId, title, body, type, metadata }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deductCredit(userId: string, amount: number = 1) {
  // First get current credits
  const { data: profile, error: getError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (getError) throw getError;
  if (!profile || profile.credits < amount) throw new Error('Créditos insuficientes.');

  const { data, error } = await supabase
    .from('profiles')
    .update({ credits: profile.credits - amount })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
