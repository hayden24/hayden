"use client";

import { useActionState, useState } from "react";
import { updateCustomer, type FormState } from "../actions";
import CustomerFields from "../customer-fields";

type CustomerDetailsData = {
  id: string;
  name: string;
  contact: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
};

export default function CustomerDetails({ customer }: { customer: CustomerDetailsData }) {
  const [editing, setEditing] = useState(false);
  const boundAction = updateCustomer.bind(null, customer.id);
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
          {customer.address && (
            <div>
              <dt className="inline font-medium text-slate-600">Address: </dt>
              <dd className="inline">{customer.address}</dd>
            </div>
          )}
          {customer.contact && (
            <div>
              <dt className="inline font-medium text-slate-600">Contact: </dt>
              <dd className="inline">
                {/^[\d\s()+.-]{7,}$/.test(customer.contact) ? (
                  <a href={`tel:${customer.contact.replace(/[^\d+]/g, "")}`} className="text-blue-600 hover:underline">
                    {customer.contact}
                  </a>
                ) : (
                  customer.contact
                )}
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
          {customer.notes && (
            <div>
              <dt className="inline font-medium text-slate-600">Notes: </dt>
              <dd className="inline whitespace-pre-wrap">{customer.notes}</dd>
            </div>
          )}
        </dl>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <CustomerFields customer={customer} />
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
