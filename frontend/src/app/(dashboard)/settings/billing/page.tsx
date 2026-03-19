'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings');
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <p className="text-sm text-gray-500">Redirecting to settings…</p>
    </div>
  );
}
