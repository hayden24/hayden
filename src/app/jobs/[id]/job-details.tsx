"use client";

import { useActionState, useState } from "react";
import { updateJobDetails, type FormState } from "../actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

type JobDetailsData = {
  id: string;
  jobNumber: string;
  scopeOfWork: string;
  location: string;
  customerName: string;
  customerContact: string;
};

export default function JobDetails({ job }: { job: JobDetailsData }) {
  const [editing, setEditing] = useState(false);
  const boundAction = updateJobDetails.bind(null, job.id);
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
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Job #{job.jobNumber}
            </p>
            <h1 className="text-xl font-semibold text-slate-900">{job.scopeOfWork}</h1>
          </div>
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
            <dt className="inline font-medium text-slate-600">Location: </dt>
            <dd className="inline">{job.location}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-600">Customer: </dt>
            <dd className="inline">{job.customerName}</dd>
          </div>
          <div>
            <dt className="inline font-medium text-slate-600">Customer contact: </dt>
            <dd className="inline">{job.customerContact}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="jobNumber" className="block text-xs font-medium text-slate-700">
          Job number
        </label>
        <input
          id="jobNumber"
          name="jobNumber"
          defaultValue={job.jobNumber}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="scopeOfWork" className="block text-xs font-medium text-slate-700">
          Scope of work
        </label>
        <textarea
          id="scopeOfWork"
          name="scopeOfWork"
          defaultValue={job.scopeOfWork}
          required
          rows={2}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-xs font-medium text-slate-700">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={job.location}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="customerName" className="block text-xs font-medium text-slate-700">
          Customer name
        </label>
        <input
          id="customerName"
          name="customerName"
          defaultValue={job.customerName}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="customerContact" className="block text-xs font-medium text-slate-700">
          Customer contact
        </label>
        <input
          id="customerContact"
          name="customerContact"
          defaultValue={job.customerContact}
          required
          className={inputClass}
        />
      </div>
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
