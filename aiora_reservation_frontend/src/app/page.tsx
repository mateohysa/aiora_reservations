'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page immediately
    router.push('/login');
  }, [router]);
  
  // Return empty div as this page won't be visible
  return <div></div>;
}
