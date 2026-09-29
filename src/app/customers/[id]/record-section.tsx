"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveCustomerRecord, deleteCustomerRecord, type FormState } from "../actions";
import { RECORD_CONFIGS, type RecordKind } from "@/lib/customer-records";
import DeleteButton from "@/components/delete-button";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

export type CustomerRecord = { id: string } & Record<string, unknown>;

function RecordForm({
  customerId,
  kind,
  record,
  onDone,
}: {
  customerId: string;
  kind: RecordKind;
  record?: CustomerRecord;
  onDone?: () => void;
}) {
  const config = RECORD_CONFIGS[kind];
  const boundAction = saveCustomerRecord.bind(null, customerId, kind, record?.id ?? null);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const [handledState, setHandledState] = useState<FormState>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const idPrefix = `${kind}-${record?.id ?? "new"}`;

  if (state !== handledState) {
    setHandledState(state);
    if (state?.success) onDone?.();
  }

  useEffect(() => {
    if (state?.success && !record) {
      formRef.current?.reset();
    }
  }, [state, record]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4"
    >
      {config.fields.map((field) => (
        <div key={field.name} className={field.wide ? "col-span-full" : "col-span-1"}>
          <label htmlFor={`${idPrefix}-${field.name}`} className="block text-xs font-medium text-slate-700">
            {field.label}
          </label>
          {field.wide ? (
            <textarea
              id={`${idPrefix}-${field.name}`}
              name={field.name}
              rows={2}
              defaultValue={(record?.[field.name] as string | null) ?? ""}
              placeholder={field.placeholder}
              className={inputClass}
            />
          ) : (
            <input
              id={`${idPrefix}-${field.name}`}
              name={field.name}
              defaultValue={(record?.[field.name] as string | null) ?? ""}
              placeholder={field.placeholder}
              className={inputClass}
            />
          )}
        </div>
      ))}
      {state?.error && (
        <p className="col-span-full text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="col-span-full flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Saving..." : record ? "Save" : config.addLabel}
        </button>
        {record && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function RecordItem({
  customerId,
  kind,
  record,
}: {
  customerId: string;
  kind: RecordKind;
  record: CustomerRecord;
}) {
  const [editing, setEditing] = useState(false);
  const config = RECORD_CONFIGS[kind];

  if (editing) {
    return (
      <li className="p-3">
        <RecordForm
          customerId={customerId}
          kind={kind}
          record={record}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  const filled = config.fields.filter((f) => record[f.name]);

  return (
    <li className="flex items-start justify-between gap-3 p-3">
      <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {filled.map((field) => (
          <div key={field.name} className={field.wide ? "col-span-full" : undefined}>
            <dt className="text-xs text-slate-500">{field.label}</dt>
            <dd className="whitespace-pre-wrap break-words font-medium text-slate-900">
              {String(record[field.name])}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          Edit
        </button>
        <DeleteButton
          action={deleteCustomerRecord.bind(null, customerId, kind, record.id)}
          confirmText="Delete this entry?"
        />
      </div>
    </li>
  );
}

export default function RecordSection({
  customerId,
  kind,
  records,
}: {
  customerId: string;
  kind: RecordKind;
  records: CustomerRecord[];
}) {
  const config = RECORD_CONFIGS[kind];

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold text-slate-900">{config.title}</h2>
      {records.length === 0 ? (
        <p className="text-sm text-slate-500">{config.emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {records.map((record) => (
            <RecordItem key={record.id} customerId={customerId} kind={kind} record={record} />
          ))}
        </ul>
      )}
      <RecordForm customerId={customerId} kind={kind} />
    </section>
  );
}
