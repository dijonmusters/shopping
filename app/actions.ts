"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsPurchased(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_item_as_purchased", { item_id: id });
  if (error) throw error;
  revalidatePath("/");
}

export async function updateNotes(id: number, notes: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ notes: notes || null })
    .eq("id", id);
  if (error) throw error;
}

export async function addToShoppingList(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ is_on_shopping_list: true })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/add");
}
