import { RegisterForm } from "@/components/register-form";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return notFound();
  }

  const isValidToken = await validateToken(token);

  if (!isValidToken) {
    return notFound();
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm token={token} />
        <Toaster position="top-right" />
      </div>
    </div>
  );
}

async function validateToken(token: string) {
  try {
    const response = await fetch(
      `https://easy-ferry.uc.r.appspot.com/validar-token?token=${token}`
    );
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}
