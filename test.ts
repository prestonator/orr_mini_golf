import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');

async function test() {
    try {
        console.log("Testing signInWithOtp with a string...");
        const res = await supabase.auth.signInWithOtp({ email: 'test@example.com' });
        console.log("Result:", res);
    } catch (e) {
        console.error("signInWithOtp string crash:", e);
    }

    try {
        console.log("\nTesting signInWithOtp with an object (like a File)...");
        const res2 = await supabase.auth.signInWithOtp({ email: {} as any });
        console.log("Result:", res2);
    } catch (e) {
        console.error("signInWithOtp object crash:", e);
    }

    try {
        console.log("\nTesting verifyOtp with object...");
        const res3 = await supabase.auth.verifyOtp({ email: 'test@example.com', token: {} as any, type: 'email' });
        console.log("Result:", res3);
    } catch (e) {
        console.error("verifyOtp object crash:", e);
    }
}

test();
