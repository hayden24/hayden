"use client";

import { useActionState } from "react";
import { createJob } from "../actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function NewJobForm() {
  const [state, formAction, pending] = useActionState(createJob, undefined);

  return (
    <form action={formAction} className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Job title *
        </label>
        <input id="title" name="title" required className={inputClass} placeholder="Panel upgrade" />
      </div>
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-slate-700">
          Customer name *
        </label>
        <input id="customerName" name="customerName" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="jobNumber" className="block text-sm font-medium text-slate-700">
          Job number
        </label>
        <input id="jobNumber" name="jobNumber" className={inputClass} />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700">
          Job site address
        </label>
        <input id="address" name="address" className={inputClass} />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea id="notes" name="notes" rows={3} className={inputClass} />
      </div>
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
        {pending ? "Creating..." : "Create work order"}
      </button>
    </form>
  );
}
