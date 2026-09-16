import { useState } from "react";
import { useProfile } from "../contexts/ProfileContext";

function formatDiff(value) {
  const diff = Number(value) || 0;
  return diff > 0 ? `+${diff}` : `${diff}`;
}

function diffClass(value) {
  const diff = Number(value) || 0;
  if (diff > 0) return "text-lime";
  if (diff < 0) return "text-red-300";
  return "text-mist";
}

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

export function StandingsTable({
  rows,
  pointsKey = "points",
  showRecord = false,
  showDiff = false,
}) {
  const { memberId } = useProfile();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  if (!rows?.length) {
    return <p className="text-sm text-muted">No results yet.</p>;
  }

  return (
    <div className="space-y-3">
      {/* Mobile-only toggle */}
      <div className="flex items-center justify-between sm:hidden">
        <span />
        <button
          type="button"
          onClick={() => setMobileExpanded((v) => !v)}
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lime hover:underline"
        >
          {mobileExpanded ? "Show less ▲" : "Show more ▼"}
        </button>
      </div>

      <div className="overflow-x-auto">
        {/* DESKTOP TABLE: full team column + all stat columns */}
        <table className="hidden w-full min-w-[560px] border-collapse text-left text-sm sm:table">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-[0.18em] text-muted">
              <th className="py-3 pr-2 font-medium">#</th>
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
              {showDiff ? (
                <>
                  <th className="py-3 pr-2 font-medium">PG</th>
                  <th className="py-3 pr-2 font-medium">PL</th>
                  <th className="py-3 pr-2 font-medium">PD</th>
                </>
              ) : null}
              <th className="py-3 pr-0 text-right font-medium">Pts</th>
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
                  <td className="py-3 pr-2 tabular-nums text-muted">
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
                  {showDiff ? (
                    <>
                      <td className="py-3 pr-2 tabular-nums">
                        {row.pointsGained ?? 0}
                      </td>
                      <td className="py-3 pr-2 tabular-nums">
                        {row.pointsLost ?? 0}
                      </td>
                      <td
                        className={`py-3 pr-2 tabular-nums font-semibold ${diffClass(
                          row.pointsDifference
                        )}`}
                      >
                        {formatDiff(row.pointsDifference)}
                      </td>
                    </>
                  ) : null}
                  <td className="py-3 pr-0 text-right font-bold tabular-nums text-lime">
                    {row[pointsKey]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* MOBILE TABLE: team below manager + conditional stat columns */}
        <table className="w-full min-w-[320px] border-collapse text-left text-xs sm:hidden">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-[0.18em] text-muted">
              <th className="py-2 pr-2 font-medium">#</th>
              <th className="py-2 pr-3 text-left font-medium">Manager</th>
              {showRecord ? (
                <th className="py-2 pr-2 font-medium">P</th>
              ) : null}
              {mobileExpanded && showRecord ? (
                <>
                  <th className="py-2 pr-2 font-medium">W</th>
                  <th className="py-2 pr-2 font-medium">D</th>
                  <th className="py-2 pr-2 font-medium">L</th>
                </>
              ) : null}
              {mobileExpanded && showDiff ? (
                <>
                  <th className="py-2 pr-2 font-medium">PG</th>
                  <th className="py-2 pr-2 font-medium">PL</th>
                </>
              ) : null}
              {showDiff ? (
                <th className="py-2 pr-2 font-medium">PD</th>
              ) : null}
              <th className="py-2 pr-0 text-right font-medium">Pts</th>
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
                  <td className="py-2 pr-2 align-top tabular-nums text-muted">
                    {row.position ?? index + 1}
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <p className="font-semibold leading-tight text-sand">
                      {row.firstName} {row.lastName}
                      {isMe ? (
                        <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                          You
                        </span>
                      ) : null}
                    </p>
                    <p className="text-[10px] leading-tight text-muted">
                      {row.teamName}
                    </p>
                  </td>
                  {showRecord ? (
                    <td className="py-2 pr-2 align-top tabular-nums">
                      {row.played}
                    </td>
                  ) : null}
                  {mobileExpanded && showRecord ? (
                    <>
                      <td className="py-2 pr-2 align-top tabular-nums">
                        {row.wins}
                      </td>
                      <td className="py-2 pr-2 align-top tabular-nums">
                        {row.draws}
                      </td>
                      <td className="py-2 pr-2 align-top tabular-nums">
                        {row.losses}
                      </td>
                    </>
                  ) : null}
                  {mobileExpanded && showDiff ? (
                    <>
                      <td className="py-2 pr-2 align-top tabular-nums">
                        {row.pointsGained ?? 0}
                      </td>
                      <td className="py-2 pr-2 align-top tabular-nums">
                        {row.pointsLost ?? 0}
                      </td>
                    </>
                  ) : null}
                  {showDiff ? (
                    <td
                      className={`py-2 pr-2 align-top tabular-nums font-semibold ${diffClass(
                        row.pointsDifference
                      )}`}
                    >
                      {formatDiff(row.pointsDifference)}
                    </td>
                  ) : null}
                  <td className="py-2 pr-0 align-top text-right font-bold tabular-nums text-lime">
                    {row[pointsKey]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
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
