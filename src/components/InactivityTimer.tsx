'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/app/auth/actions';

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
        await signOut('Logged out due to inactivity');
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
