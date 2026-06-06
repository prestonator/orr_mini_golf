import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');

async function test() {
    try {
        console.log("Testing updateUser with an object...");
        const res = await supabase.auth.updateUser({ data: { full_name: {} as any } });
        console.log("Result:", res);
    } catch (e) {
        console.error("updateUser object crash:", e);
    }
}

test();
