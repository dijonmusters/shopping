import Link from "next/link";
import { Suspense } from "react";
import AddItems from "./add-items";

export default async function AddItemPage() {
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

        <Suspense
          fallback={<p className="text-zinc-500 text-sm">Loading items...</p>}
        >
          <AddItems />
        </Suspense>
      </div>
    </main>
  );
}
