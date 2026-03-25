"use client";

import { useOptimistic, useState } from "react";
import { addToShoppingList } from "../actions";

type Item = {
  id: number;
  name: string;
  is_on_shopping_list: boolean;
};

export function AddItemsClient({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [optimisticItems, markOptimisticAdded] = useOptimistic(
    items,
    (state, addedId: number) =>
      state.map((item) =>
        item.id === addedId ? { ...item, is_on_shopping_list: true } : item,
      ),
  );

  const filtered = optimisticItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 bg-zinc-900 text-zinc-100 placeholder-zinc-500 text-sm rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-colors"
      />

      {filtered.length === 0 && (
        <p className="text-zinc-500 text-sm">No items found.</p>
      )}

      {filtered.length > 0 && (
        <ul className="divide-y divide-zinc-800">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="p-4 flex items-center justify-between gap-3"
            >
              <span className="text-zinc-100 font-medium">{item.name}</span>
              {item.is_on_shopping_list ? (
                <span className="text-xs text-zinc-500">Added</span>
              ) : (
                <form
                  action={async (formData) => {
                    markOptimisticAdded(item.id);
                    await addToShoppingList(formData);
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="flex items-center px-2 gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
