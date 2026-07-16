import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const email = 'definitelynotregistered123123@example.com';
  
  const res1 = await supabase.auth.resetPasswordForEmail(email);
  console.log('RESET:', res1.error);
  
  const res2 = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false
    }
  });
  console.log('OTP:', res2.error);
}

run();
