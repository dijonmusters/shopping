import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AddItemsClient } from "./add-items-client";

export default async function AddItemPage() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("items")
    .select("id, name, is_on_shopping_list")
    .order("number_of_times_purchased", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Add Items
          </h1>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {error && (
          <p className="text-red-400 text-sm">Failed to load items.</p>
        )}

        {!error && items && (
          <AddItemsClient items={items} />
        )}
      </div>
    </main>
  );
}
