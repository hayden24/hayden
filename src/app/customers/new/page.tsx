import NewCustomerForm from "./new-customer-form";

export default function NewCustomerPage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">
      <h1 className="text-lg font-semibold text-slate-900">New customer</h1>
      <p className="mt-1 text-sm text-slate-500">
        You can add panels, lighting, and device colors on the next screen.
      </p>
      <NewCustomerForm />
    </main>
  );
}
