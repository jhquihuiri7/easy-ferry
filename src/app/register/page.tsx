'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RegisterForm } from '@/components/register-form';
import { Toaster } from 'sonner';
import { Suspense } from 'react';

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push("/not-found"); // redirecciona si no hay token
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm token={token} />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
