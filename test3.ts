import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz');

async function test() {
    try {
        console.log("Testing verifyOtp with a Blob...");
        const blob = new Blob(["test"], { type: "text/plain" });
        const res = await supabase.auth.verifyOtp({ email: blob as any, token: '123456', type: 'email' });
        console.log("Result:", res);
    } catch (e) {
        console.error("verifyOtp Blob crash:", e);
    }
}

test();
