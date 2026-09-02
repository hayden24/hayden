"use client";

import { useActionState, useEffect, useRef } from "react";
import { addMaterialEntry } from "../actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function AddMaterialForm({ jobId }: { jobId: string }) {
  const boundAction = addMaterialEntry.bind(null, jobId);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-5"
    >
      <div className="col-span-2 sm:col-span-2">
        <label htmlFor="m-description" className="block text-xs font-medium text-slate-700">
          Description
        </label>
        <input
          id="m-description"
          name="description"
          required
          placeholder="200A panel"
          className={inputClass}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor="m-quantity" className="block text-xs font-medium text-slate-700">
          Qty
        </label>
        <input
          id="m-quantity"
          name="quantity"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue="1"
          required
          className={inputClass}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor="m-unitCost" className="block text-xs font-medium text-slate-700">
          Unit cost ($)
        </label>
        <input
          id="m-unitCost"
          name="unitCost"
          type="number"
          step="0.01"
          min="0"
          placeholder="optional"
          className={inputClass}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor="m-date" className="block text-xs font-medium text-slate-700">
          Date
        </label>
        <input
          id="m-date"
          name="date"
          type="date"
          defaultValue={today}
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="col-span-full text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="col-span-full">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Adding..." : "Add material"}
        </button>
      </div>
    </form>
  );
}
