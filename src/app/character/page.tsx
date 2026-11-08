
export default async function Character_Page() {
  return (
    <main className="mx-auto mt-20 w-full max-w-7xl px-6 md:mt-24 md:px-10">
      <section className="content rounded-xs border border-black/10 p-6 shadow-sm md:p-8">
        <h1 className="mb-3">Your Characters</h1>
        <hr className="mb-6 border-black/10" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            className="light group flex min-h-32 flex-col items-start justify-between rounded-md bg-white/40 p-5 text-left outline-2 outline-dashed outline-[var(--theme-orange)] -outline-offset-4 hover:bg-white/75 hover:outline-white"
            type="button"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-orange)] text-2xl text-white transition-colors group-hover:bg-white group-hover:text-[var(--theme-orange)]">
              +
            </span>
            <span className="font-semibold text-[var(--theme-orange)] group-hover:text-white">
              Create a character
            </span>
          </button>

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