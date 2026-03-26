"use client";

import { useOptimistic, useState, useEffect, startTransition } from "react";
import {
  addToShoppingList,
  removeFromShoppingList,
  revalidateItems,
} from "../actions";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type Item = {
  id: number;
  name: string;
  is_on_shopping_list: boolean;
};

type OptimisticAction =
  | { type: "toggle"; id: number }
  | { type: "insert"; item: Item }
  | { type: "update"; item: Item }
  | { type: "delete"; id: number };

function itemsReducer(state: Item[], action: OptimisticAction): Item[] {
  switch (action.type) {
    case "toggle":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, is_on_shopping_list: !item.is_on_shopping_list }
          : item,
      );
    case "insert":
      return [...state, action.item];
    case "update":
      return state.map((item) =>
        item.id === action.item.id ? action.item : item,
      );
    case "delete":
      return state.filter((item) => item.id !== action.id);
  }
}

export function AddItemsClient({ items: initialItems }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [optimisticItems, applyOptimistic] = useOptimistic(
    initialItems,
    itemsReducer,
  );

  useEffect(() => {
    const supabase = createClient();

    let channel: RealtimeChannel | null = null;

    const subscribeToRealtime = async () => {
      await supabase.realtime.setAuth();

      channel = supabase
        .channel("items-changes", {
          config: { private: true },
        })
        .on("broadcast", { event: "*" }, ({ payload }) => {
          startTransition(() => {
            if (payload.operation === "INSERT") {
              applyOptimistic({ type: "insert", item: payload.record as Item });
            } else if (payload.operation === "UPDATE") {
              applyOptimistic({ type: "update", item: payload.record as Item });
            } else if (payload.operation === "DELETE") {
              applyOptimistic({
                type: "delete",
                id: (payload.old_record as { id: number }).id,
              });
            }
            revalidateItems();
          });
        })
        .subscribe();
    };

    subscribeToRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

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
                <form
                  action={async (formData) => {
                    applyOptimistic({ type: "toggle", id: item.id });
                    await removeFromShoppingList(formData);
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    Added
                  </button>
                </form>
              ) : (
                <form
                  action={async (formData) => {
                    applyOptimistic({ type: "toggle", id: item.id });
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
