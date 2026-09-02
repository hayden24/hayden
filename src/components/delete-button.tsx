"use client";

import { useTransition } from "react";

export default function DeleteButton({
  action,
  confirmText = "Delete this entry?",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(confirmText)) {
          startTransition(() => action());
        }
      }}
      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
