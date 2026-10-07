type Props = {
  compact?: boolean;
  defaultValue?: string;
};

export function SearchBox({ compact = false, defaultValue = "" }: Props) {
  return (
    <form action="/search" role="search" className="w-full">
      <label htmlFor={compact ? "global-search" : "page-search"} className="sr-only">
        Cari pengetahuan Batak
      </label>
      <div className="flex gap-2">
        <input
          id={compact ? "global-search" : "page-search"}
          name="q"
          defaultValue={defaultValue}
          type="search"
          placeholder="Cari marga, adat, wilayah…"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-950 shadow-sm outline-none placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-950/10"
        />
        <button
          type="submit"
          className="rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
        >
          Cari
        </button>
      </div>
    </form>
  );
}
