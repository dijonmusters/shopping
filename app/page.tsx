import { Suspense } from "react";
import ShoppingList from "./shopping-list";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8 mt-9">
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
        <Suspense
          fallback={<p className="text-zinc-500 text-sm">Loading items...</p>}
        >
          <ShoppingList />
        </Suspense>
      </div>
    </main>
  );
}
