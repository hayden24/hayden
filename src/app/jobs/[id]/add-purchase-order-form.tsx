"use client";

import { useActionState, useEffect, useRef } from "react";
import { addPurchaseOrder } from "../actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function AddPurchaseOrderForm({ jobId }: { jobId: string }) {
  const boundAction = addPurchaseOrder.bind(null, jobId);
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
      <div className="col-span-1">
        <label htmlFor="po-poNumber" className="block text-xs font-medium text-slate-700">
          PO number
        </label>
        <input
          id="po-poNumber"
          name="poNumber"
          required
          placeholder="PO-4021"
          className={inputClass}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor="po-vendor" className="block text-xs font-medium text-slate-700">
          Vendor
        </label>
        <input
          id="po-vendor"
          name="vendor"
          required
          placeholder="City Electric Supply"
          className={inputClass}
        />
      </div>
      <div className="col-span-2 sm:col-span-2">
        <label htmlFor="po-description" className="block text-xs font-medium text-slate-700">
          Description
        </label>
        <input id="po-description" name="description" className={inputClass} />
      </div>
      <div className="col-span-1">
        <label htmlFor="po-amount" className="block text-xs font-medium text-slate-700">
          Amount ($)
        </label>
        <input
          id="po-amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="optional"
          className={inputClass}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor="po-date" className="block text-xs font-medium text-slate-700">
          Date
        </label>
        <input
          id="po-date"
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
          {pending ? "Adding..." : "Add purchase order"}
        </button>
      </div>
    </form>
  );
}
