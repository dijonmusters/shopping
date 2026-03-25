import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingListClient } from "./shopping-list-client";

export default async function ShoppingList() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("items")
    .select("id, name, notes")
    .eq("is_on_shopping_list", true)
    .order("name");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
          Shopping List
        </h1>
        <Link
          href="/add"
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
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
          Add item
        </Link>
      </div>

      {error && <p className="text-red-400 text-sm">Failed to load items.</p>}

      {!error && items?.length === 0 && (
        <p className="text-zinc-500 text-sm">No items on the list.</p>
      )}

      {!error && items && items.length > 0 && (
        <ShoppingListClient items={items} />
      )}
    </>
  );
}
