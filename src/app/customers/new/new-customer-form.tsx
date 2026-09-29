"use client";

import { useActionState } from "react";
import { createCustomer } from "../actions";
import CustomerFields from "../customer-fields";

export default function NewCustomerForm() {
  const [state, formAction, pending] = useActionState(createCustomer, undefined);

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <CustomerFields />
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create customer"}
      </button>
    </form>
  );
}
