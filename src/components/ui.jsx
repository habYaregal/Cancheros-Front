import { useProfile } from "../contexts/ProfileContext";

export function LoadingBlock({ label = "Loading…" }) {
  return (
    <div className="animate-pulse py-12 text-center text-sm text-muted sm:py-16">
      {label}
    </div>
  );
}

export function ErrorBlock({ message }) {
  return (
    <div className="border border-red-400/40 bg-red-950/30 px-4 py-3 text-sm text-red-200">
      {message || "Something went wrong."}
    </div>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4 sm:mb-6">
      <h2 className="font-display text-2xl text-sand sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function StandingsTable({ rows, pointsKey = "points", showRecord = false }) {
  const { memberId } = useProfile();

  if (!rows?.length) {
    return <p className="text-sm text-muted">No results yet.</p>;
  }

  return (
    <>
      {/* Mobile cards */}
      <div className="space-y-2 sm:hidden">
        {rows.map((row, index) => {
          const isMe = memberId && row.memberId === memberId;
          return (
          <div
            key={row.memberId || row.fplId || index}
            className={[
              "flex items-center justify-between gap-3 border bg-panel px-3 py-3",
              isMe ? "border-lime/60 bg-lime/10" : "border-line",
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-5 shrink-0 tabular-nums text-muted">
                {row.position ?? index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-sand">
                  {row.firstName} {row.lastName}
                  {isMe ? (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-lime">
                      You
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-muted">{row.teamName}</p>
                {showRecord ? (
                  <p className="mt-0.5 text-xs text-mist">
                    P{row.played} W{row.wins} D{row.draws} L{row.losses}
                  </p>
                ) : null}
              </div>
            </div>
            <span className="shrink-0 font-bold tabular-nums text-lime">
              {row[pointsKey]}
            </span>
          </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.18em] text-muted">
              <th className="py-3 pr-3 font-medium">#</th>
              <th className="py-3 pr-3 font-medium">Manager</th>
              <th className="py-3 pr-3 font-medium">Team</th>
              {showRecord ? (
                <>
                  <th className="py-3 pr-3 font-medium">P</th>
                  <th className="py-3 pr-3 font-medium">W</th>
                  <th className="py-3 pr-3 font-medium">D</th>
                  <th className="py-3 pr-3 font-medium">L</th>
                </>
              ) : null}
              <th className="py-3 text-right font-medium">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isMe = memberId && row.memberId === memberId;
              return (
              <tr
                key={row.memberId || row.fplId || index}
                className={[
                  "border-b border-white/5 transition hover:bg-white/[0.03]",
                  isMe ? "bg-lime/10" : "",
                ].join(" ")}
              >
                <td className="py-3 pr-3 tabular-nums text-muted">
                  {row.position ?? index + 1}
                </td>
                <td className="py-3 pr-3 font-semibold text-sand">
                  {row.firstName} {row.lastName}
                  {isMe ? (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-lime">
                      You
                    </span>
                  ) : null}
                </td>
                <td className="py-3 pr-3 text-mist">{row.teamName}</td>
                {showRecord ? (
                  <>
                    <td className="py-3 pr-3 tabular-nums">{row.played}</td>
                    <td className="py-3 pr-3 tabular-nums">{row.wins}</td>
                    <td className="py-3 pr-3 tabular-nums">{row.draws}</td>
                    <td className="py-3 pr-3 tabular-nums">{row.losses}</td>
                  </>
                ) : null}
                <td className="py-3 text-right font-bold tabular-nums text-lime">
                  {row[pointsKey]}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function WinnerBanner({ winner, tiedLabel = "Joint leaders" }) {
  if (!winner) return null;

  if (winner.tied) {
    const names = (winner.winners || [])
      .map((w) => `${w.firstName} ${w.lastName}`)
      .join(" · ");

    return (
      <div className="mb-4 border-l-4 border-lime bg-panel px-3 py-3 sm:mb-6 sm:px-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">
          {tiedLabel}
        </p>
        <p className="mt-1 text-sm font-semibold text-sand sm:text-base">
          {names || "Tied"}
        </p>
      </div>
    );
  }

  if (!winner.winner) return null;

  return (
    <div className="mb-4 border-l-4 border-lime bg-panel px-3 py-3 sm:mb-6 sm:px-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Leader</p>
      <p className="mt-1 font-display text-xl text-sand sm:text-2xl">
        {winner.winner.firstName} {winner.winner.lastName}
      </p>
      <p className="text-sm text-mist">{winner.winner.teamName}</p>
    </div>
  );
}
