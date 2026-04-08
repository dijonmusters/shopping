"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAsPurchased(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_item_as_purchased", {
    item_id: id,
  });
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/add");
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
  revalidatePath("/");
  revalidatePath("/add");
}

export async function createItem(formData: FormData) {
  const name = String(formData.get("name")).trim();
  const isOnShoppingList = formData.get("is_on_shopping_list") === "true";
  if (!name) throw new Error("Name is required");
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .insert({ name, is_on_shopping_list: isOnShoppingList });
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/add");
}

export async function removeFromShoppingList(formData: FormData) {
  const id = Number(formData.get("id"));
  const supabase = await createClient();
  const { error } = await supabase
    .from("items")
    .update({ is_on_shopping_list: false })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/add");
}

export async function revalidateItems() {
  revalidatePath("/");
  revalidatePath("/add");
}
