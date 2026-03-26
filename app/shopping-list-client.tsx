"use client";

import { useOptimistic, useEffect, startTransition } from "react";
import { markAsPurchased, updateNotes, revalidateItems } from "./actions";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type Item = {
  id: number;
  name: string;
  notes: string | null;
};

type OptimisticAction =
  | { type: "remove"; id: number }
  | { type: "insert"; row: Item & { is_on_shopping_list: boolean } }
  | { type: "update"; row: Item & { is_on_shopping_list: boolean } }
  | { type: "delete"; id: number };

function itemsReducer(state: Item[], action: OptimisticAction): Item[] {
  switch (action.type) {
    case "remove":
    case "delete":
      return state.filter((item) => item.id !== action.id);
    case "insert":
      if (!action.row.is_on_shopping_list) return state;
      return [
        ...state,
        { id: action.row.id, name: action.row.name, notes: action.row.notes },
      ];
    case "update": {
      const { id, name, notes, is_on_shopping_list } = action.row;
      if (!is_on_shopping_list) return state.filter((item) => item.id !== id);
      const exists = state.some((item) => item.id === id);
      if (exists)
        return state.map((item) =>
          item.id === id ? { id, name, notes } : item,
        );
      return [...state, { id, name, notes }];
    }
  }
}

export function ShoppingListClient({ items: initialItems }: { items: Item[] }) {
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
              applyOptimistic({
                type: "insert",
                row: payload.record as Item & { is_on_shopping_list: boolean },
              });
            } else if (payload.operation === "UPDATE") {
              applyOptimistic({
                type: "update",
                row: payload.record as Item & { is_on_shopping_list: boolean },
              });
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

  return (
    <ul className="divide-y divide-zinc-800">
      {optimisticItems.map((item) => (
        <li key={item.id} className="py-4 flex items-start gap-3">
          <form
            action={async (formData) => {
              applyOptimistic({ type: "remove", id: item.id });
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
