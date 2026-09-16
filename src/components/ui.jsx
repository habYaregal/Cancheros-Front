import { useState } from "react";
import { useProfile } from "../contexts/ProfileContext";
import { haptic } from "../lib/telegram";

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

function number(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
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

export function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
      <div className="min-w-0">
        <h2 className="font-display text-2xl text-sand sm:text-4xl">{title}</h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function RankMedallion({ position }) {
  const p = Number(position);
  const medal =
    p === 1 ? "🥇" : p === 2 ? "🥈" : p === 3 ? "🥉" : null;

  if (medal) {
    return (
      <span className="inline-flex items-center gap-1 tabular-nums text-muted">
        <span aria-hidden="true">{medal}</span>
        <span className="font-semibold text-sand">{p}</span>
      </span>
    );
  }
  return (
    <span className="tabular-nums font-semibold text-mist">{p}</span>
  );
}

function ExpandToggle({ expanded, onToggle, className = "" }) {
  return (
    <button
      type="button"
      onClick={() => {
        haptic("selection");
        onToggle((v) => !v);
      }}
      className={[
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-mist transition hover:text-lime",
        className,
      ].join(" ")}
    >
      <span className="flex h-4 w-4 items-center justify-center border border-line text-[9px]">
        {expanded ? "−" : "+"}
      </span>
      {expanded ? "Collapse" : "Expand"}
    </button>
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
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
          {rows.length} players
        </span>
        <ExpandToggle
          expanded={mobileExpanded}
          onToggle={setMobileExpanded}
        />
      </div>

      <div className="overflow-hidden rounded-sm border border-line bg-panel">
        <div className="overflow-x-auto">
          {/* DESKTOP TABLE: Team column always shown (desktop = expanded) */}
          <table className="hidden w-full min-w-[620px] border-collapse text-left text-sm sm:table">
            <thead>
              <tr className="border-b border-line bg-black/20 text-[10px] uppercase tracking-[0.18em] text-muted">
                <th className="py-2.5 pl-4 pr-3 font-medium">#</th>
                <th className="py-2.5 pr-4 font-medium">Manager</th>
                <th className="py-2.5 pr-4 font-medium">Team</th>
                {showRecord ? (
                  <>
                    <th className="w-12 py-2.5 pr-3 text-center font-medium">P</th>
                    <th className="w-12 py-2.5 pr-3 text-center font-medium">W</th>
                    <th className="w-12 py-2.5 pr-3 text-center font-medium">D</th>
                    <th className="w-12 py-2.5 pr-3 text-center font-medium">L</th>
                  </>
                ) : null}
                {showDiff ? (
                  <>
                    <th className="w-14 py-2.5 pr-3 text-right font-medium">PG</th>
                    <th className="w-14 py-2.5 pr-3 text-right font-medium">PL</th>
                    <th className="w-14 py-2.5 pr-3 text-right font-medium">PD</th>
                  </>
                ) : null}
                <th className="w-16 py-2.5 pr-4 text-right font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isMe = memberId && row.memberId === memberId;
                const zebra = index % 2 === 1 ? "bg-black/10" : "";
                const highlight = isMe
                  ? "!bg-lime/10 shadow-[inset_2px_0_0_0_#bfff00]"
                  : "";

                return (
                  <tr
                    key={row.memberId || row.fplId || index}
                    className={[
                      "border-b border-white/5 transition hover:bg-white/[0.04]",
                      zebra,
                      highlight,
                    ].join(" ")}
                  >
                    <td className="py-2.5 pl-4 pr-3">
                      <RankMedallion position={row.position ?? index + 1} />
                    </td>
                    <td className="py-2.5 pr-4">
                      <p className="font-semibold text-sand">
                        {row.firstName} {row.lastName}
                        {isMe ? (
                          <span className="ml-2 inline-flex items-center rounded-[3px] bg-lime/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime">
                            You
                          </span>
                        ) : null}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4 text-sand/80">{row.teamName}</td>
                    {showRecord ? (
                      <>
                        <td className="w-12 py-2.5 pr-3 text-center tabular-nums">{number(row.played)}</td>
                        <td className="w-12 py-2.5 pr-3 text-center tabular-nums">{number(row.wins)}</td>
                        <td className="w-12 py-2.5 pr-3 text-center tabular-nums">{number(row.draws)}</td>
                        <td className="w-12 py-2.5 pr-3 text-center tabular-nums">{number(row.losses)}</td>
                      </>
                    ) : null}
                    {showDiff ? (
                      <>
                        <td className="w-14 py-2.5 pr-3 text-right tabular-nums">{number(row.pointsGained)}</td>
                        <td className="w-14 py-2.5 pr-3 text-right tabular-nums">{number(row.pointsLost)}</td>
                        <td
                          className={`w-14 py-2.5 pr-3 text-right tabular-nums font-semibold ${diffClass(
                            row.pointsDifference
                          )}`}
                        >
                          {formatDiff(row.pointsDifference)}
                        </td>
                      </>
                    ) : null}
                    <td className="w-16 py-2.5 pr-4 text-right tabular-nums font-bold text-lime">
                      {number(row[pointsKey])}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* MOBILE: collapsed = Manager + Team separate columns + P/PD/Pts only
               expanded = Team nested under Manager + full stat columns */}
          <table className="w-full min-w-[340px] border-collapse text-left text-xs sm:hidden">
            <thead>
              <tr className="border-b border-line bg-black/20 text-[10px] uppercase tracking-[0.18em] text-muted">
                <th className="w-8 py-2 pr-1 pl-3 text-left font-medium">#</th>
                {mobileExpanded ? (
                  <th className="py-2 pr-3 text-left font-medium">Manager</th>
                ) : (
                  <>
                    <th className="py-2 pr-2 text-left font-medium">Manager</th>
                    <th className="py-2 pr-3 text-left font-medium">Team</th>
                  </>
                )}
                {showRecord ? (
                  <th className="w-8 py-2 pr-1.5 text-center font-medium">P</th>
                ) : null}
                {mobileExpanded && showRecord ? (
                  <>
                    <th className="w-7 py-2 pr-1.5 text-center font-medium">W</th>
                    <th className="w-7 py-2 pr-1.5 text-center font-medium">D</th>
                    <th className="w-7 py-2 pr-1.5 text-center font-medium">L</th>
                  </>
                ) : null}
                {mobileExpanded && showDiff ? (
                  <>
                    <th className="w-10 py-2 pr-1.5 text-right font-medium">PG</th>
                    <th className="w-10 py-2 pr-1.5 text-right font-medium">PL</th>
                  </>
                ) : null}
                {showDiff ? (
                  <th className="w-10 py-2 pr-1.5 text-right font-medium">PD</th>
                ) : null}
                <th className="w-10 py-2 pr-3 text-right font-medium">Pts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isMe = memberId && row.memberId === memberId;
                const zebra = index % 2 === 1 ? "bg-black/10" : "";
                const highlight = isMe
                  ? "!bg-lime/10 shadow-[inset_2px_0_0_0_#bfff00]"
                  : "";

                return (
                  <tr
                    key={row.memberId || row.fplId || index}
                    className={[
                      "border-b border-white/5",
                      zebra,
                      highlight,
                    ].join(" ")}
                  >
                    <td className="w-8 py-2 pr-1 pl-3 align-top">
                      <RankMedallion position={row.position ?? index + 1} />
                    </td>

                    {mobileExpanded ? (
                      <td className="py-2 pr-3 align-top">
                        <p className="font-semibold leading-tight text-sand">
                          {row.firstName} {row.lastName}
                          {isMe ? (
                            <span className="ml-1 inline-flex rounded-[2px] bg-lime/20 px-1 py-[1px] text-[9px] font-bold uppercase tracking-wider text-lime align-middle">
                              You
                            </span>
                          ) : null}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-tight text-muted">
                          {row.teamName}
                        </p>
                      </td>
                    ) : (
                      <>
                        <td className="py-2 pr-2 align-top">
                          <p className="font-semibold leading-tight text-sand">
                            {row.firstName} {row.lastName}
                            {isMe ? (
                              <span className="ml-1 inline-flex rounded-[2px] bg-lime/20 px-1 py-[1px] text-[9px] font-bold uppercase tracking-wider text-lime align-middle">
                                You
                              </span>
                            ) : null}
                          </p>
                        </td>
                        <td className="py-2 pr-3 align-top text-[11px] leading-tight text-sand/80 truncate">
                          {row.teamName}
                        </td>
                      </>
                    )}

                    {showRecord ? (
                      <td className="w-8 py-2 pr-1.5 align-top text-center tabular-nums">{number(row.played)}</td>
                    ) : null}
                    {mobileExpanded && showRecord ? (
                      <>
                        <td className="w-7 py-2 pr-1.5 align-top text-center tabular-nums">{number(row.wins)}</td>
                        <td className="w-7 py-2 pr-1.5 align-top text-center tabular-nums">{number(row.draws)}</td>
                        <td className="w-7 py-2 pr-1.5 align-top text-center tabular-nums">{number(row.losses)}</td>
                      </>
                    ) : null}
                    {mobileExpanded && showDiff ? (
                      <>
                        <td className="w-10 py-2 pr-1.5 align-top text-right tabular-nums">{number(row.pointsGained)}</td>
                        <td className="w-10 py-2 pr-1.5 align-top text-right tabular-nums">{number(row.pointsLost)}</td>
                      </>
                    ) : null}
                    {showDiff ? (
                      <td
                        className={`w-10 py-2 pr-1.5 align-top text-right tabular-nums font-semibold ${diffClass(
                          row.pointsDifference
                        )}`}
                      >
                        {formatDiff(row.pointsDifference)}
                      </td>
                    ) : null}
                    <td className="w-10 py-2 pr-3 align-top text-right tabular-nums font-bold text-lime">
                      {number(row[pointsKey])}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
      <div className="mb-4 rounded-sm border border-lime/20 bg-gradient-to-r from-lime/15 to-transparent px-4 py-3 sm:mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-lime/80">
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
    <div className="mb-4 rounded-sm border border-lime/20 bg-gradient-to-r from-lime/15 to-transparent px-4 py-3 sm:mb-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-lime/80">
        Leader
      </p>
      <p className="mt-1 font-display text-2xl text-sand sm:text-3xl">
        {winner.winner.firstName} {winner.winner.lastName}
      </p>
      <p className="text-sm text-mist">{winner.winner.teamName}</p>
    </div>
  );
}
