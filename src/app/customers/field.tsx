export const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

// Common answers offered as you type. Any value can still be typed in.
const SUGGESTIONS = {
  "panel-brands": [
    "Square D Homeline",
    "Square D QO",
    "Eaton BR",
    "Eaton CH (Cutler-Hammer)",
    "Siemens",
    "GE",
    "Murray",
    "Challenger",
    "Federal Pacific (Stab-Lok)",
    "Zinsco",
    "Wadsworth",
    "Pushmatic",
  ],
  "panel-types": ["Main breaker", "Main lug", "Sub-panel", "Meter/main combo", "Fuse box"],
  voltages: ["120/240V 1Ø", "120/208V 3Ø", "277/480V 3Ø", "120/240V 3Ø high-leg"],
  "service-types": ["Overhead", "Underground"],
  "device-brands": ["Leviton", "Legrand / Pass & Seymour", "Eaton", "Hubbell", "Lutron"],
  "device-styles": ["Decora (rocker)", "Standard (toggle/duplex)", "Mixed"],
  colors: ["White", "Ivory", "Light almond", "Almond", "Gray", "Black", "Brown", "Red (emergency)", "Orange (isolated ground)"],
  "plate-types": [
    "Standard plastic",
    "Unbreakable nylon",
    "Midway",
    "Jumbo",
    "Screwless",
    "Stainless steel",
    "Metal / painted",
  ],
  "fixture-types": ["2x4 troffer", "2x2 troffer", "4' strip", "8' strip", "Wrap", "High bay", "Recessed can", "Wall pack", "Pole light", "Exit/emergency"],
  "lamp-types": ["F32T8", "F28T5", "F54T5HO", "F96T12", "LED tube (Type A)", "LED tube (Type B)", "LED integrated", "CFL", "Metal halide", "HPS"],
};

export type SuggestionList = keyof typeof SUGGESTIONS;

// Render once on any page that uses Field with a `list`.
export function SuggestionLists() {
  return (
    <>
      {Object.entries(SUGGESTIONS).map(([id, options]) => (
        <datalist key={id} id={id}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ))}
    </>
  );
}

export function Field({
  id,
  name,
  label,
  defaultValue,
  list,
  placeholder,
  type = "text",
  required,
  className,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string | number | null;
  list?: SuggestionList;
  placeholder?: string;
  type?: "text" | "number" | "tel" | "email";
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? 1 : undefined}
        defaultValue={defaultValue ?? ""}
        list={list}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={inputClass}
      />
    </div>
  );
}
