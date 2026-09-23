import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Create an account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Keep your home&apos;s details in one place and swap ideas with other homeowners.
        </p>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-emerald-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
