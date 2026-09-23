"use client";

import { useState } from "react";
import type { Panel } from "@prisma/client";
import { deletePanel } from "../../actions";
import DeleteButton from "@/components/delete-button";
import PanelForm from "./panel-form";

function PanelCard({ customerId, panel }: { customerId: string; panel: Panel }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <PanelForm customerId={customerId} panel={panel} onDone={() => setEditing(false)} />;
  }

  const specs = [
    ["Brand", panel.brand],
    ["Type", panel.panelType],
    ["Voltage", panel.voltage],
    ["Spaces", panel.spaces],
    ["Breakers", panel.breakerType],
  ].filter(([, value]) => value != null && value !== "");

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">
            {panel.label}
            {panel.amperage != null && (
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {panel.amperage}A
              </span>
            )}
          </p>
          {panel.location && <p className="text-sm text-slate-500">{panel.location}</p>}
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
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-0.5 text-sm text-slate-500 sm:grid-cols-2">
          {specs.map(([label, value]) => (
            <div key={label as string}>
              <dt className="inline font-medium text-slate-600">{label}: </dt>
              <dd className="inline">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {panel.notes && <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{panel.notes}</p>}
      <div className="mt-3">
        <DeleteButton
          action={deletePanel.bind(null, customerId, panel.id)}
          confirmText={`Delete "${panel.label}"?`}
        />
      </div>
    </div>
  );
}

export default function PanelList({ customerId, panels }: { customerId: string; panels: Panel[] }) {
  const [adding, setAdding] = useState(panels.length === 0);

  return (
    <section className="space-y-3">
      {panels.map((panel) => (
        <PanelCard key={panel.id} customerId={customerId} panel={panel} />
      ))}
      {adding ? (
        <PanelForm customerId={customerId} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full rounded-lg border border-dashed border-slate-300 py-3 text-sm font-medium text-blue-600 hover:bg-white"
        >
          + Add panel
        </button>
      )}
    </section>
  );
}
