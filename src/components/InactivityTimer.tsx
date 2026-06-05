'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function InactivityTimer() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Do not run the timer on the login page
    if (pathname === '/') return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/?error=' + encodeURIComponent('Logged out due to inactivity'));
        router.refresh();
      }, 90000); // 90 seconds
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => document.addEventListener(event, resetTimer));
    
    // Initial setup
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [pathname, router]);

  return null;
}
