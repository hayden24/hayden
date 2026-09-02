import NewJobForm from "./new-job-form";

export default function NewJobPage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">New job</h1>
      <NewJobForm />
    </main>
  );
}
