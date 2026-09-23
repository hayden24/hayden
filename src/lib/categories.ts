import type { ItemCategory } from "@prisma/client";

// The detail columns on HomeItem that each category relabels (or hides).
export type DetailField = "brand" | "model" | "size" | "color" | "spec";

type FieldConfig = { label: string; placeholder?: string };

export type CategoryConfig = {
  label: string;
  emoji: string;
  namePlaceholder: string;
  fields: Partial<Record<DetailField, FieldConfig>>;
  // Suggested replacement interval, pre-filled when adding a new item.
  defaultReplaceEveryMonths?: number;
};

export const CATEGORIES: Record<ItemCategory, CategoryConfig> = {
  PAINT: {
    label: "Paint",
    emoji: "🎨",
    namePlaceholder: "Living room walls",
    fields: {
      brand: { label: "Brand", placeholder: "Sherwin-Williams" },
      color: { label: "Color name / code", placeholder: "Agreeable Gray SW 7029" },
      spec: { label: "Sheen / finish", placeholder: "Eggshell" },
      model: { label: "Product line", placeholder: "Duration Interior" },
    },
  },
  FILTER: {
    label: "Filters",
    emoji: "🌬️",
    namePlaceholder: "Furnace filter",
    defaultReplaceEveryMonths: 3,
    fields: {
      size: { label: "Size", placeholder: "16x25x1" },
      spec: { label: "Rating", placeholder: "MERV 11" },
      brand: { label: "Brand", placeholder: "Filtrete" },
      model: { label: "Part #", placeholder: "UR01-4" },
    },
  },
  LIGHT_BULB: {
    label: "Light bulbs",
    emoji: "💡",
    namePlaceholder: "Kitchen recessed lights",
    fields: {
      size: { label: "Shape / base", placeholder: "BR30, E26" },
      spec: { label: "Wattage / lumens", placeholder: "9W LED (65W equiv.)" },
      color: { label: "Color temperature", placeholder: "2700K soft white" },
      brand: { label: "Brand", placeholder: "Philips" },
      model: { label: "Part # / quantity", placeholder: "6 bulbs, dimmable" },
    },
  },
  APPLIANCE: {
    label: "Appliances",
    emoji: "🧺",
    namePlaceholder: "Dishwasher",
    fields: {
      brand: { label: "Brand", placeholder: "Bosch" },
      model: { label: "Model #", placeholder: "SHX878ZD5N" },
      spec: { label: "Serial #", placeholder: "FD 9912 00123" },
      size: { label: "Size / capacity" },
    },
  },
  PLUMBING: {
    label: "Plumbing",
    emoji: "🚰",
    namePlaceholder: "Water heater",
    fields: {
      brand: { label: "Brand", placeholder: "Rheem" },
      model: { label: "Model #" },
      size: { label: "Size / capacity", placeholder: "50 gal" },
      spec: { label: "Part / cartridge #", placeholder: "Moen 1225" },
    },
  },
  ELECTRICAL: {
    label: "Electrical",
    emoji: "⚡",
    namePlaceholder: "Garage outlets breaker",
    fields: {
      spec: { label: "Breaker / circuit #", placeholder: "Panel A, #14" },
      size: { label: "Amperage", placeholder: "20A" },
      brand: { label: "Brand" },
      model: { label: "Model / part #" },
    },
  },
  FLOORING: {
    label: "Flooring",
    emoji: "🪵",
    namePlaceholder: "Main floor hardwood",
    fields: {
      spec: { label: "Material", placeholder: "Engineered oak" },
      color: { label: "Color / style", placeholder: "Natural Oak" },
      brand: { label: "Brand" },
      size: { label: "Plank / tile size", placeholder: '7.5" wide' },
    },
  },
  OTHER: {
    label: "Other",
    emoji: "🏠",
    namePlaceholder: "Garage door opener",
    fields: {
      brand: { label: "Brand" },
      model: { label: "Model / part #" },
      size: { label: "Size" },
      color: { label: "Color" },
      spec: { label: "Details" },
    },
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as ItemCategory[];

export function isCategory(value: string): value is ItemCategory {
  return value in CATEGORIES;
}

export const DETAIL_FIELDS: DetailField[] = ["brand", "model", "size", "color", "spec"];

// The fields a category shows, most useful first (the order they're declared in).
export function visibleFields(category: ItemCategory) {
  return Object.keys(CATEGORIES[category].fields) as DetailField[];
}

// Items with a replacement interval: when is the next one due?
export function nextDueDate(item: {
  lastReplaced: Date | null;
  replaceEveryMonths: number | null;
}) {
  if (!item.lastReplaced || !item.replaceEveryMonths) return null;
  const due = new Date(item.lastReplaced);
  due.setMonth(due.getMonth() + item.replaceEveryMonths);
  return due;
}

export function isOverdue(item: {
  lastReplaced: Date | null;
  replaceEveryMonths: number | null;
}) {
  const due = nextDueDate(item);
  return due !== null && due.getTime() <= Date.now();
}
