import { Suspense } from "react";
import ShoppingList from "./shopping-list";

export default async function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <Suspense
          fallback={<p className="text-zinc-500 text-sm">Loading items...</p>}
        >
          <ShoppingList />
        </Suspense>
      </div>
    </main>
  );
}
