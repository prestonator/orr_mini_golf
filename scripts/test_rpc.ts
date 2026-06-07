import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log("Testing RPC 'create_visit_for_user'...");
  
  // Create a user first
  const username = `test_user_${Date.now()}`;
  const pin = '1234';
  
  const { data: profiles, error: insertError } = await supabase
    .from('profiles')
    .insert({ username, pin })
    .select('id');
    
  if (insertError) {
    console.error("Failed to insert user:", insertError);
    return;
  }
  
  const profileId = profiles[0].id;
  console.log("Created user with ID:", profileId);
  
  // Call the RPC
  const { data, error: rpcError } = await supabase.rpc('create_visit_for_user', { target_user_id: profileId });
  
  if (rpcError) {
    console.error("RPC Error:", rpcError);
    return;
  }
  
  console.log("RPC Success:", data);
  
  // Check if visit was created
  const { data: visits, error: visitError } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', profileId);
    
  if (visitError) {
    console.error("Visit query error:", visitError);
  } else {
    console.log("Found visits:", visits);
  }
}

runTest();
