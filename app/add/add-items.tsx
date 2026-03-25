import { createClient } from "@/lib/supabase/server";
import { AddItemsClient } from "./add-items-client";

export default async function AddItems() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("items")
    .select("id, name, is_on_shopping_list")
    .order("number_of_times_purchased", { ascending: false });

  return (
    <>
      {error && <p className="text-red-400 text-sm">Failed to load items.</p>}

      {!error && items && <AddItemsClient items={items} />}
    </>
  );
}
