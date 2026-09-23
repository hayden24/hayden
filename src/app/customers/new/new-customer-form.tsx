"use client";

import { useActionState } from "react";
import { createCustomer } from "../actions";
import { Field } from "../field";

export default function NewCustomerForm() {
  const [state, formAction, pending] = useActionState(createCustomer, undefined);

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <Field id="name" name="name" label="Customer name *" required placeholder="Karen Willis" />
      <Field
        id="address"
        name="address"
        label="Address *"
        required
        placeholder="412 Oak St, Springfield"
      />
      <Field id="phone" name="phone" type="tel" label="Phone" placeholder="(555) 201-8834" />
      <Field id="email" name="email" type="email" label="Email" />
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
