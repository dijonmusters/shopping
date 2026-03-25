"use client";

import { useOptimistic } from "react";
import { markAsPurchased, updateNotes } from "./actions";

type Item = {
  id: number;
  name: string;
  notes: string | null;
};

export function ShoppingListClient({ items }: { items: Item[] }) {
  const [optimisticItems, removeOptimistic] = useOptimistic(
    items,
    (state, removedId: number) => state.filter((item) => item.id !== removedId),
  );

  return (
    <ul className="divide-y divide-zinc-800">
      {optimisticItems.map((item) => (
        <li key={item.id} className="py-4 flex items-start gap-3">
          <form
            action={async (formData) => {
              removeOptimistic(item.id);
              await markAsPurchased(formData);
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              className="mt-0.5 text-zinc-500 hover:text-zinc-100 transition-colors cursor-pointer"
              aria-label={`Mark ${item.name} as purchased`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
              </svg>
            </button>
          </form>
          <div className="flex-1 min-w-0">
            <span className="text-zinc-100 font-medium">{item.name}</span>
            <input
              type="text"
              defaultValue={item.notes ?? ""}
              placeholder="Add a note…"
              onBlur={(e) => {
                const value = e.target.value.trim();
                if (value !== (item.notes ?? "")) {
                  updateNotes(item.id, value);
                }
              }}
              className="mt-1 w-full bg-transparent text-sm text-zinc-400 placeholder-zinc-600 focus:outline-none focus:text-zinc-300 transition-colors"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
