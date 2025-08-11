import { createClient } from '@supabase/supabase-js';
// supabaseClient.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;  // si usas Vite
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
