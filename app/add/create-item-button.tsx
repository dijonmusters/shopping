"use client";

import { useState, useRef } from "react";
import { createItem } from "../actions";

export function CreateItemButton() {
  const [open, setOpen] = useState(false);
  const [isOnShoppingList, setIsOnShoppingList] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createItem(formData);
    setOpen(false);
    setIsOnShoppingList(true);
    formRef.current?.reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
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
        Create item
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-5">
              Create item
            </h2>
            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoFocus
                  className="w-full bg-zinc-950 text-zinc-100 placeholder-zinc-600 text-sm rounded-lg px-3 py-2 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-colors"
                  placeholder="e.g. Olive oil"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_on_shopping_list"
                  checked={isOnShoppingList}
                  onChange={(e) => setIsOnShoppingList(e.target.checked)}
                  className="w-4 h-4 rounded accent-zinc-400 cursor-pointer"
                />
                <input
                  type="hidden"
                  name="is_on_shopping_list"
                  value={String(isOnShoppingList)}
                />
                <label
                  htmlFor="is_on_shopping_list"
                  className="text-sm text-zinc-400 cursor-pointer select-none"
                >
                  Add to shopping list
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm bg-zinc-100 text-zinc-900 hover:bg-white transition-colors rounded-lg px-4 py-2 font-medium cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
