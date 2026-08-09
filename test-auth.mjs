import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase connection...");
  const email = `test+${Date.now()}@example.com`;
  const password = "password123!";

  console.log(`Attempting to sign up with ${email}...`);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error);
    return;
  }

  console.log("Signup successful!");
  console.log("Session:", data.session ? "Active" : "Null (Email confirmation required)");
  
  if (!data.session) {
    console.log("Since session is null, AuthModal would just close and leave the user confused.");
  }
}

test();
