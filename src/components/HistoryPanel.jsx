import { formatPoints } from "../lib/format";

function winnerLabel(winner) {
  return `${winner.first_name} ${winner.last_name}`;
}

function periodLabel(entry, type) {
  if (type === "weekly") return `GW${entry.gameweek}`;
  if (type === "monthly") return entry.monthName || "Month";
  if (type === "season") return entry.seasonName || "Season";
  if (type === "h2h") return entry.seasonName || "H2H season";
  return "—";
}

export default function HistoryPanel({
  title = "Past results",
  entries = [],
  type = "weekly",
  emptyMessage = "Results appear here once a period is finished.",
}) {
  if (!entries.length) {
    return (
      <section className="mt-8 border-t border-line pt-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          {title}
        </h3>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="mt-8 border-t border-line pt-6">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
        {title}
      </h3>
      <div className="space-y-2">
        {[...entries].reverse().map((entry) => (
          <div
            key={entry.resultId}
            className="flex flex-col gap-1 border border-line bg-panel px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-sand">
                {periodLabel(entry, type)}
              </p>
              {entry.tied ? (
                <p className="text-xs text-muted">Joint winners</p>
              ) : null}
            </div>
            <div className="text-sm text-mist">
              {entry.winners.map((winner) => (
                <p key={winner.member_id}>
                  <span className="text-sand">{winnerLabel(winner)}</span>
                  {winner.points != null ? (
                    <span className="ml-2 text-lime">
                      {formatPoints(winner.points)} pts
                    </span>
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
