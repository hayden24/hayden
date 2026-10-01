import { prisma } from "@/lib/prisma";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
  const isFirstUser = (await prisma.user.count()) === 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Set up access to your company&apos;s job tracker.
        </p>
        <RegisterForm isFirstUser={isFirstUser} />
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
