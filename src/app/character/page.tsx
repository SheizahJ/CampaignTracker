
import Link from "next/link";

export default async function Character_Page() {
  return (
    <main className="mx-auto mt-8 w-full max-w-7xl px-6 md:mt-12 md:px-10">
      <section className="content rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h2 className="mb-3">Your Characters</h2>
        <hr className="mb-6 border-black/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/character/create"
            className="group flex min-h-32 w-full flex-col items-start justify-between rounded-md bg-[var(--theme-light-orange)] p-5 text-left outline-2 outline-dashed outline-[var(--theme-orange)] -outline-offset-4 hover:bg-[#f8b137] hover:outline-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-orange)] text-2xl text-white transition-colors group-hover:bg-white group-hover:text-[var(--theme-orange)]">
              +
            </span>
            <span className="font-semibold text-[var(--theme-orange)] group-hover:text-white">
              Create a character
            </span>
          </Link>

          <button
            className="light flex min-h-32 flex-col items-start justify-end rounded-md border border-black/10 p-5 text-left shadow-sm hover:shadow-md"
            type="button"
          >
            <span className="text-sm text-black/50">Character</span>
            <span className="text-lg font-semibold">New character</span>
          </button>
        </div>
      </section>
    </main>
  );
}