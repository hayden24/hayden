"use client";

import { useActionState, useEffect } from "react";
import type { Panel } from "@prisma/client";
import { savePanel } from "../../actions";
import { Field, inputClass } from "../../field";

export default function PanelForm({
  customerId,
  panel,
  onDone,
}: {
  customerId: string;
  panel?: Panel;
  onDone: () => void;
}) {
  const boundAction = savePanel.bind(null, customerId, panel?.id ?? null);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const p = panel?.id ?? "new";

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4"
    >
      <Field
        id={`${p}-label`}
        name="label"
        label="Name *"
        required
        defaultValue={panel?.label}
        placeholder="Main panel"
        className="col-span-2"
      />
      <Field
        id={`${p}-location`}
        name="location"
        label="Location"
        defaultValue={panel?.location}
        placeholder="Garage, north wall"
        className="col-span-2"
      />
      <Field
        id={`${p}-brand`}
        name="brand"
        label="Brand"
        list="panel-brands"
        defaultValue={panel?.brand}
        className="col-span-2"
      />
      <Field
        id={`${p}-amperage`}
        name="amperage"
        label="Amps"
        type="number"
        defaultValue={panel?.amperage}
        placeholder="200"
      />
      <Field
        id={`${p}-spaces`}
        name="spaces"
        label="Spaces"
        type="number"
        defaultValue={panel?.spaces}
        placeholder="40"
      />
      <Field
        id={`${p}-panelType`}
        name="panelType"
        label="Type"
        list="panel-types"
        defaultValue={panel?.panelType}
        className="col-span-2"
      />
      <Field
        id={`${p}-voltage`}
        name="voltage"
        label="Voltage / phase"
        list="voltages"
        defaultValue={panel?.voltage}
        className="col-span-2"
      />
      <Field
        id={`${p}-breakerType`}
        name="breakerType"
        label="Breaker type"
        defaultValue={panel?.breakerType}
        placeholder="HOM, QO, BR, THQL..."
        className="col-span-2"
      />
      <div className="col-span-full">
        <label htmlFor={`${p}-notes`} className="block text-xs font-medium text-slate-700">
          Notes
        </label>
        <textarea
          id={`${p}-notes`}
          name="notes"
          rows={2}
          defaultValue={panel?.notes ?? ""}
          placeholder="Full? Tandems allowed? Double-tapped breakers, AFCI/GFCI, directory up to date..."
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="col-span-full text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="col-span-full flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : panel ? "Save panel" : "Add panel"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
