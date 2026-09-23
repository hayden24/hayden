"use client";

import { useActionState, useEffect } from "react";
import type { Fixture } from "@prisma/client";
import { saveFixture } from "../../actions";
import { Field, inputClass } from "../../field";

export default function FixtureForm({
  customerId,
  fixture,
  onDone,
}: {
  customerId: string;
  fixture?: Fixture;
  onDone: () => void;
}) {
  const boundAction = saveFixture.bind(null, customerId, fixture?.id ?? null);
  const [state, formAction, pending] = useActionState(boundAction, undefined);
  const p = fixture?.id ?? "new";

  useEffect(() => {
    if (state?.success) onDone();
  }, [state, onDone]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4"
    >
      <Field
        id={`${p}-location`}
        name="location"
        label="Location *"
        required
        defaultValue={fixture?.location}
        placeholder="Warehouse, office, parking lot..."
        className="col-span-2"
      />
      <Field
        id={`${p}-fixtureType`}
        name="fixtureType"
        label="Fixture type"
        list="fixture-types"
        defaultValue={fixture?.fixtureType}
      />
      <Field
        id={`${p}-quantity`}
        name="quantity"
        label="Qty"
        type="number"
        defaultValue={fixture?.quantity}
      />
      <Field
        id={`${p}-lampType`}
        name="lampType"
        label="Lamp"
        list="lamp-types"
        defaultValue={fixture?.lampType}
        placeholder="F32T8, 4100K"
        className="col-span-2"
      />
      <Field
        id={`${p}-ballast`}
        name="ballast"
        label="Ballast / driver"
        defaultValue={fixture?.ballast}
        placeholder="2-lamp F32T8, 120-277V, instant start"
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
          defaultValue={fixture?.notes ?? ""}
          placeholder="Ballast part number, lift needed, switched from panel B circuit 12..."
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
          {pending ? "Saving..." : fixture ? "Save" : "Add lighting"}
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
