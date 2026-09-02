"use client";

import { useActionState } from "react";
import { updateJobNotes } from "../actions";

export default function NotesForm({ jobId, notes }: { jobId: string; notes: string | null }) {
  const boundAction = updateJobNotes.bind(null, jobId);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-slate-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={notes ?? ""}
          rows={8}
          placeholder="Access instructions, gate codes, follow-up items, anything worth remembering about this job..."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      {state?.success && (
        <p className="text-sm text-green-600" role="status">
          Saved.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save notes"}
      </button>
    </form>
  );
}
