// Field definitions for the per-customer electrical info sections. Shared by the
// server actions (to know which form fields to save) and the forms/lists (to render them).
// To track a new detail on an existing section, add a column to the matching Prisma
// model and a field here.

export type RecordField = {
  name: string;
  label: string;
  placeholder?: string;
  wide?: boolean;
};

export type RecordKind = "service" | "lighting" | "circuits" | "info";

export type RecordConfig = {
  title: string;
  addLabel: string;
  emptyMessage: string;
  fields: RecordField[];
};

export const RECORD_CONFIGS: Record<RecordKind, RecordConfig> = {
  service: {
    title: "Electrical service",
    addLabel: "Add service / panel",
    emptyMessage: "No service info yet.",
    fields: [
      { name: "location", label: "Location", placeholder: "Main - garage wall" },
      { name: "amperage", label: "Amperage", placeholder: "200A" },
      { name: "voltage", label: "Voltage", placeholder: "120/240V" },
      { name: "phase", label: "Phase", placeholder: "Single phase" },
      { name: "panelBrand", label: "Panel brand", placeholder: "Square D" },
      { name: "panelModel", label: "Panel model", placeholder: "HOM4080M200PC" },
      { name: "utilityMeter", label: "Utility meter #", placeholder: "optional" },
      { name: "notes", label: "Notes", wide: true },
    ],
  },
  lighting: {
    title: "Lighting & ballasts",
    addLabel: "Add fixture",
    emptyMessage: "No lighting info yet.",
    fields: [
      { name: "area", label: "Area", placeholder: "Shop bay 2" },
      { name: "fixtureType", label: "Fixture type", placeholder: "4ft 2-lamp wrap" },
      { name: "lampType", label: "Lamp type", placeholder: "F32T8" },
      { name: "ballastBrand", label: "Ballast brand", placeholder: "Philips Advance" },
      { name: "ballastModel", label: "Ballast model", placeholder: "ICN-2P32-N" },
      { name: "quantity", label: "Qty", placeholder: "6" },
      { name: "notes", label: "Notes", wide: true },
    ],
  },
  circuits: {
    title: "Circuits",
    addLabel: "Add circuit",
    emptyMessage: "No circuits recorded yet.",
    fields: [
      { name: "description", label: "Feeds", placeholder: "Kitchen counter receptacles" },
      { name: "fedFrom", label: "Fed from (panel)", placeholder: "Main panel" },
      { name: "circuitNumber", label: "Circuit #", placeholder: "12/14" },
      { name: "breakerSize", label: "Breaker", placeholder: "20A" },
      { name: "wireSize", label: "Wire", placeholder: "12/2 NM" },
      { name: "notes", label: "Notes", wide: true },
    ],
  },
  info: {
    title: "Other info",
    addLabel: "Add info",
    emptyMessage: "Nothing here yet. Use this for anything else worth remembering — gate codes, generator, EV charger, etc.",
    fields: [
      { name: "label", label: "Label", placeholder: "Generator" },
      { name: "value", label: "Details", placeholder: "Generac 22kW, ATS in garage", wide: true },
    ],
  },
};

export function isRecordKind(value: string): value is RecordKind {
  return value in RECORD_CONFIGS;
}
