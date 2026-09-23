"use client";

import { useActionState, useState } from "react";
import { updateCustomerContact, type FormState } from "../actions";
import { Field } from "../field";

type CustomerContact = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
};

export default function CustomerDetails({ customer }: { customer: CustomerContact }) {
  const [editing, setEditing] = useState(false);
  const boundAction = updateCustomerContact.bind(null, customer.id);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const [handledState, setHandledState] = useState<FormState>(undefined);

  if (state !== handledState) {
    setHandledState(state);
    if (state?.success) setEditing(false);
  }

  if (!editing) {
    return (
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-semibold text-slate-900">{customer.name}</h1>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
        </div>
        <dl className="mt-2 space-y-0.5 text-sm text-slate-500">
          <div>
            <dt className="inline font-medium text-slate-600">Address: </dt>
            <dd className="inline">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {customer.address}
              </a>
            </dd>
          </div>
          {customer.phone && (
            <div>
              <dt className="inline font-medium text-slate-600">Phone: </dt>
              <dd className="inline">
                <a href={`tel:${customer.phone}`} className="text-blue-600 hover:underline">
                  {customer.phone}
                </a>
              </dd>
            </div>
          )}
          {customer.email && (
            <div>
              <dt className="inline font-medium text-slate-600">Email: </dt>
              <dd className="inline">
                <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                  {customer.email}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <Field id="c-name" name="name" label="Customer name" defaultValue={customer.name} required />
      <Field id="c-address" name="address" label="Address" defaultValue={customer.address} required />
      <Field id="c-phone" name="phone" type="tel" label="Phone" defaultValue={customer.phone} />
      <Field id="c-email" name="email" type="email" label="Email" defaultValue={customer.email} />
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
