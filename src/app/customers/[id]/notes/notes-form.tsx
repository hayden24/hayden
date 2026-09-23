"use client";

import { useActionState } from "react";
import { updateCustomerNotes } from "../../actions";
import { inputClass } from "../../field";

export default function NotesForm({
  customerId,
  accessNotes,
  notes,
}: {
  customerId: string;
  accessNotes: string | null;
  notes: string | null;
}) {
  const boundAction = updateCustomerNotes.bind(null, customerId);
  const [state, formAction, pending] = useActionState(boundAction, undefined);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <label htmlFor="accessNotes" className="block text-xs font-medium text-slate-700">
          Access
        </label>
        <textarea
          id="accessNotes"
          name="accessNotes"
          defaultValue={accessNotes ?? ""}
          rows={2}
          placeholder="Gate code, lockbox, dog in the yard, where the attic hatch is..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-400">Shown at the top of every tab for this customer.</p>
      </div>
      <div>
        <label htmlFor="notes" className="block text-xs font-medium text-slate-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={notes ?? ""}
          rows={8}
          placeholder="Aluminum branch wiring, generator/transfer switch, smoke detector type, past issues, anything worth remembering..."
          className={inputClass}
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
