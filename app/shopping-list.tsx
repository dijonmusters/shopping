import { createClient } from "@/lib/supabase/server";
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
      {error && <p className="text-red-400 text-sm">Failed to load items.</p>}

      {!error && items && <ShoppingListClient items={items} />}
    </>
  );
}
