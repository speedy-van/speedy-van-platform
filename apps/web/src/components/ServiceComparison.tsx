import Link from "next/link";

const ROWS = [
  {
    size: "Small Van",
    icon: "🚗",
    capacity: "1–2 rooms",
    cubicFt: "200 ft³",
    crew: "1 person",
    bestFor: "Single items, student moves",
    intercity: "—",
  },
  {
    size: "Medium Van",
    icon: "🚐",
    capacity: "2–3 rooms",
    cubicFt: "350 ft³",
    crew: "2 people",
    bestFor: "Flat moves, partial removals",
    intercity: "✓",
    popular: true,
  },
  {
    size: "Large Van",
    icon: "🚚",
    capacity: "3–4 rooms",
    cubicFt: "500 ft³",
    crew: "2–3 people",
    bestFor: "House moves, small office",
    intercity: "✓",
  },
  {
    size: "Luton Van",
    icon: "🚛",
    capacity: "4–5 rooms",
    cubicFt: "700 ft³",
    crew: "3 people",
    bestFor: "Full house, large office",
    intercity: "✓",
  },
];

export function ServiceComparison() {
  return (
    <section
      id="compare"
      className="py-16 bg-white"
      aria-labelledby="compare-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 id="compare-heading" className="section-heading">
            Which Van Do I Need?
          </h2>
          <p className="section-subheading mx-auto">
            A quick side-by-side so you can pick the right size in seconds.
          </p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="grid grid-cols-1 sm:hidden gap-3">
          {ROWS.map((r) => (
            <div
              key={r.size}
              className={`rounded-xl border p-4 ${
                r.popular ? "border-primary-400 bg-primary-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden="true">{r.icon}</span>
                <h3 className="font-bold text-slate-900">{r.size}</h3>
                {r.popular && (
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-primary-400 text-slate-900 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <dl className="text-sm space-y-1 text-slate-700">
                <div className="flex justify-between"><dt className="text-slate-500">Capacity</dt><dd className="font-medium">{r.capacity}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Cubic ft</dt><dd className="font-medium">{r.cubicFt}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Crew</dt><dd className="font-medium">{r.crew}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-500 shrink-0">Best for</dt><dd className="font-medium text-right">{r.bestFor}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Intercity</dt><dd className="font-medium">{r.intercity}</dd></div>
              </dl>
            </div>
          ))}
        </div>

        {/* Tablet/desktop: table */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Van</th>
                <th scope="col" className="px-4 py-3 font-semibold">Capacity</th>
                <th scope="col" className="px-4 py-3 font-semibold">Cubic ft</th>
                <th scope="col" className="px-4 py-3 font-semibold">Crew</th>
                <th scope="col" className="px-4 py-3 font-semibold">Best for</th>
                <th scope="col" className="px-4 py-3 font-semibold text-center">Intercity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ROWS.map((r) => (
                <tr
                  key={r.size}
                  className={r.popular ? "bg-primary-50/50" : "bg-white hover:bg-slate-50"}
                >
                  <th scope="row" className="px-4 py-3 font-semibold text-slate-900">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true">{r.icon}</span> {r.size}
                      {r.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-400 text-slate-900 px-1.5 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-slate-700">{r.capacity}</td>
                  <td className="px-4 py-3 text-slate-700">{r.cubicFt}</td>
                  <td className="px-4 py-3 text-slate-700">{r.crew}</td>
                  <td className="px-4 py-3 text-slate-700">{r.bestFor}</td>
                  <td className="px-4 py-3 text-slate-700 text-center">{r.intercity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/book"
            data-track-event="quote_click"
            data-track-location="compare_table"
            className="btn-primary text-sm px-6 py-3"
          >
            Get my exact price
          </Link>
        </div>
      </div>
    </section>
  );
}
