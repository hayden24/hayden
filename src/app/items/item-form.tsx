"use client";

import { useActionState, useState } from "react";
import type { HomeItem, ItemCategory } from "@prisma/client";
import { CATEGORIES, CATEGORY_KEYS, DETAIL_FIELDS, visibleFields } from "@/lib/categories";
import type { FormState } from "@/lib/session";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelClass = "block text-xs font-medium text-slate-700";

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  rooms: string[];
  item?: HomeItem;
  initialCategory?: ItemCategory;
  submitLabel: string;
};

export default function ItemForm({ action, rooms, item, initialCategory, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [category, setCategory] = useState<ItemCategory>(
    item?.category ?? initialCategory ?? "PAINT"
  );
  const config = CATEGORIES[category];
  const lastReplaced = item?.lastReplaced
    ? new Date(item.lastReplaced).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-5">
      <fieldset>
        <legend className={labelClass}>Category</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORY_KEYS.map((key) => (
            <label
              key={key}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${
                category === key
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={key}
                checked={category === key}
                onChange={() => setCategory(key)}
                className="sr-only"
              />
              <span aria-hidden>{CATEGORIES[key].emoji}</span> {CATEGORIES[key].label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={item?.name}
            placeholder={config.namePlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="room" className={labelClass}>
            Room / location
          </label>
          <input
            id="room"
            name="room"
            list="room-options"
            defaultValue={item?.room ?? ""}
            placeholder="Kitchen, Basement, Whole house..."
            className={inputClass}
          />
          <datalist id="room-options">
            {rooms.map((room) => (
              <option key={room} value={room} />
            ))}
          </datalist>
        </div>

        {/* Keep hidden values so switching category never silently wipes data. */}
        {DETAIL_FIELDS.filter((field) => !config.fields[field]).map((field) => (
          <input key={field} type="hidden" name={field} defaultValue={item?.[field] ?? ""} />
        ))}

        {visibleFields(category).map((field) => {
          const fieldConfig = config.fields[field]!;
          return (
            <div key={field}>
              <label htmlFor={field} className={labelClass}>
                {fieldConfig.label}
              </label>
              <input
                id={field}
                name={field}
                defaultValue={item?.[field] ?? ""}
                placeholder={fieldConfig.placeholder}
                className={inputClass}
              />
            </div>
          );
        })}

        <div>
          <label htmlFor="whereToBuy" className={labelClass}>
            Where to buy
          </label>
          <input
            id="whereToBuy"
            name="whereToBuy"
            defaultValue={item?.whereToBuy ?? ""}
            placeholder="Home Depot, aisle 12 / amazon link"
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-700">Replacement reminder (optional)</p>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastReplaced" className={labelClass}>
              Last replaced / done
            </label>
            <input
              id="lastReplaced"
              name="lastReplaced"
              type="date"
              defaultValue={lastReplaced}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="replaceEveryMonths" className={labelClass}>
              Every (months)
            </label>
            <input
              id="replaceEveryMonths"
              name="replaceEveryMonths"
              type="number"
              min="1"
              step="1"
              key={item ? "saved" : category}
              defaultValue={item?.replaceEveryMonths ?? config.defaultReplaceEveryMonths ?? ""}
              placeholder="3"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={item?.notes ?? ""}
          placeholder="Leftover can is on the garage shelf. Touch-up needs a small roller."
          className={inputClass}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-700" role="status">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
