"use client";

import { useActionState, useState } from "react";
import type { PostType } from "@prisma/client";
import { POST_TYPES } from "@/lib/posts";
import { createPost } from "@/app/posts/actions";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";

export default function NewPostForm({ types }: { types: PostType[] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<PostType>(types[0]);
  const [state, formAction, pending] = useActionState(createPost, undefined);
  const config = POST_TYPES[type];

  if (!open) {
    return (
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              setOpen(true);
            }}
            className="flex-1 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-left text-sm text-slate-500 hover:border-emerald-500 hover:text-slate-700"
          >
            + {POST_TYPES[t].newLabel}
          </button>
        ))}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <input type="hidden" name="type" value={type} />
      {types.length > 1 && (
        <div role="radiogroup" aria-label="Post type" className="flex gap-2">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => setType(t)}
              className={`rounded-full border px-3 py-1 text-sm ${
                type === t
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-300 text-slate-600"
              }`}
            >
              {POST_TYPES[t].title}
            </button>
          ))}
        </div>
      )}
      <div>
        <label htmlFor="title" className="block text-xs font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          autoFocus
          placeholder={config.titlePlaceholder}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-xs font-medium text-slate-700">
          Details
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          placeholder={config.bodyPlaceholder}
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {pending ? "Posting..." : "Post"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
