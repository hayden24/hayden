"use client";

import { useState } from "react";
import type { Fixture } from "@prisma/client";
import { deleteFixture } from "../../actions";
import DeleteButton from "@/components/delete-button";
import FixtureForm from "./fixture-form";

function FixtureCard({ customerId, fixture }: { customerId: string; fixture: Fixture }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <FixtureForm customerId={customerId} fixture={fixture} onDone={() => setEditing(false)} />;
  }

  const specs = [
    ["Lamp", fixture.lampType],
    ["Ballast / driver", fixture.ballast],
  ].filter(([, value]) => value);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{fixture.location}</p>
          {(fixture.fixtureType || fixture.quantity != null) && (
            <p className="text-sm text-slate-500">
              {fixture.quantity != null && <>{fixture.quantity} &times; </>}
              {fixture.fixtureType ?? "fixtures"}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          Edit
        </button>
      </div>
      {specs.length > 0 && (
        <dl className="mt-2 space-y-0.5 text-sm text-slate-500">
          {specs.map(([label, value]) => (
            <div key={label}>
              <dt className="inline font-medium text-slate-600">{label}: </dt>
              <dd className="inline">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {fixture.notes && (
        <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{fixture.notes}</p>
      )}
      <div className="mt-3">
        <DeleteButton
          action={deleteFixture.bind(null, customerId, fixture.id)}
          confirmText={`Delete lighting for "${fixture.location}"?`}
        />
      </div>
    </div>
  );
}

export default function FixtureList({
  customerId,
  fixtures,
}: {
  customerId: string;
  fixtures: Fixture[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="space-y-3">
      {fixtures.length === 0 && !adding && (
        <p className="text-sm text-slate-500">
          No lighting on file. Add fixture types, lamps, and ballast sizes by area.
        </p>
      )}
      {fixtures.map((fixture) => (
        <FixtureCard key={fixture.id} customerId={customerId} fixture={fixture} />
      ))}
      {adding ? (
        <FixtureForm customerId={customerId} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-blue-600 hover:bg-white"
        >
          + Add lighting
        </button>
      )}
    </section>
  );
}
