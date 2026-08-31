import { formatPoints } from "../lib/format";

export default function H2HMatchRow({ match, live }) {
  if (match.isBye) {
    return (
      <div className="border border-line bg-panel px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-sand">
              {match.playerOne?.firstName} {match.playerOne?.lastName}
            </p>
            <p className="truncate text-xs text-muted">
              {match.playerOne?.teamName}
            </p>
          </div>
          <div className="shrink-0 text-xs uppercase tracking-[0.16em] text-lime">
            BYE · {formatPoints(match.playerOne?.points)}
          </div>
        </div>
      </div>
    );
  }

  const p1Wins =
    match.playerOne?.points === 3 ||
    (match.playerOne?.score != null &&
      match.playerTwo?.score != null &&
      match.playerOne.score > match.playerTwo.score);
  const p2Wins =
    match.playerTwo?.points === 3 ||
    (match.playerOne?.score != null &&
      match.playerTwo?.score != null &&
      match.playerTwo.score > match.playerOne.score);

  return (
    <div className="border border-line bg-panel px-3 py-3 sm:px-4 sm:py-4">
      <div className="space-y-3 sm:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`truncate font-semibold ${p1Wins ? "text-lime" : "text-sand"}`}
            >
              {match.playerOne?.firstName} {match.playerOne?.lastName}
            </p>
            <p className="truncate text-xs text-muted">
              {match.playerOne?.teamName}
            </p>
          </div>
          <p className="shrink-0 font-display text-xl tabular-nums text-sand">
            {match.playerOne?.score ?? "–"}
          </p>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`truncate font-semibold ${p2Wins ? "text-lime" : "text-sand"}`}
            >
              {match.playerTwo?.firstName} {match.playerTwo?.lastName}
            </p>
            <p className="truncate text-xs text-muted">
              {match.playerTwo?.teamName}
            </p>
          </div>
          <p className="shrink-0 font-display text-xl tabular-nums text-sand">
            {match.playerTwo?.score ?? "–"}
          </p>
        </div>
        <p className="text-center text-xs text-muted">
          H2H {formatPoints(match.playerOne?.points)}–
          {formatPoints(match.playerTwo?.points)}
          {live ? " · live" : ""}
        </p>
      </div>

      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-3 sm:grid">
        <div className={`min-w-0 ${p1Wins ? "text-sand" : "text-mist"}`}>
          <p className={`truncate font-semibold ${p1Wins ? "text-lime" : ""}`}>
            {match.playerOne?.firstName} {match.playerOne?.lastName}
          </p>
          <p className="truncate text-xs text-muted">
            {match.playerOne?.teamName}
          </p>
        </div>

        <div className="min-w-[7rem] text-center">
          <p className="font-display text-2xl tabular-nums text-sand">
            {match.playerOne?.score ?? "–"} – {match.playerTwo?.score ?? "–"}
          </p>
          <p className="mt-1 text-xs text-muted">
            H2H {formatPoints(match.playerOne?.points)}–
            {formatPoints(match.playerTwo?.points)}
            {live ? " · live" : ""}
          </p>
        </div>

        <div className={`min-w-0 text-right ${p2Wins ? "text-sand" : "text-mist"}`}>
          <p className={`truncate font-semibold ${p2Wins ? "text-lime" : ""}`}>
            {match.playerTwo?.firstName} {match.playerTwo?.lastName}
          </p>
          <p className="truncate text-xs text-muted">
            {match.playerTwo?.teamName}
          </p>
        </div>
      </div>
    </div>
  );
}
