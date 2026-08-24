import { useState } from "react";
import { useLiveData } from "../hooks/useLiveData";
import { useRefresh } from "../contexts/RefreshContext";
import {
  drawH2HLottery,
  getCurrentGameweek,
  getH2H,
  getH2HDrawStatus,
  getH2HHistory,
  getH2HMatches,
} from "../api/client";
import HistoryPanel from "../components/HistoryPanel";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";
import { formatPoints } from "../lib/format";

export default function H2HPage() {
  const { refresh } = useRefresh();
  const [drawing, setDrawing] = useState(false);
  const [drawMessage, setDrawMessage] = useState("");

  const { data, error, loading } = useLiveData(
    async () => {
      const gameweek = await getCurrentGameweek();
      const [standings, matches, allMatches, drawStatus, history] =
        await Promise.all([
          getH2H(),
          getH2HMatches(gameweek.fplId),
          getH2HMatches(),
          getH2HDrawStatus(),
          getH2HHistory(),
        ]);
      return { gameweek, standings, matches, allMatches, drawStatus, history };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { gameweek, standings, matches, allMatches, drawStatus, history } =
    data;
  const live = gameweek && !gameweek.finished;

  const pastGameweeks = groupPastH2HMatches(
    allMatches?.matches || [],
    gameweek?.fplId
  );

  async function handleDraw() {
    if (drawing || !drawStatus?.canDraw) return;

    setDrawing(true);
    setDrawMessage("");

    try {
      const result = await drawH2HLottery();
      setDrawMessage(result.message);
      await refresh();
    } catch (err) {
      setDrawMessage(
        err.response?.data?.error || err.message || "Draw failed."
      );
    } finally {
      setDrawing(false);
    }
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          title="Head-to-Head"
          subtitle={
            live
              ? `GW${gameweek.fplId} fixtures are live and update as FPL scores move.`
              : `GW${gameweek?.fplId} fixtures`
          }
        />

        {drawStatus?.canDraw ? (
          <button
            type="button"
            onClick={() => void handleDraw()}
            disabled={drawing}
            className="shrink-0 self-start bg-lime px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-pitch transition hover:brightness-110 disabled:opacity-60"
          >
            {drawing
              ? "Drawing…"
              : `Draw GW${drawStatus.targetGameweek?.fplId}`}
          </button>
        ) : (
          <p className="max-w-xs text-xs text-muted sm:text-right">
            {drawStatus?.reason ||
              "Draw unlocks after a gameweek finishes."}
          </p>
        )}
      </div>

      {drawMessage ? (
        <p className="border border-line bg-panel px-3 py-2 text-sm text-mist">
          {drawMessage}
        </p>
      ) : null}

      <WinnerBanner
        winner={standings.winner}
        tiedLabel="Joint H2H leaders"
      />

      <section>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          GW{gameweek?.fplId} scoresheet
        </h3>
        {(matches?.matches || []).length === 0 ? (
          <div className="border border-line bg-panel px-4 py-5 text-sm text-mist">
            No H2H fixtures for this gameweek yet.
          </div>
        ) : (
          <div className="space-y-3">
            {(matches?.matches || []).map((match) => (
              <MatchRow key={match.matchId} match={match} live={live} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          Table
        </h3>
        <StandingsTable rows={standings.standings} showRecord />
      </section>

      {pastGameweeks.length > 0 ? (
        <section className="border-t border-line pt-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            Past gameweeks
          </h3>
          <div className="space-y-6">
            {pastGameweeks.map(({ gameweek: gw, matches: gwMatches }) => (
              <div key={gw}>
                <h4 className="mb-3 font-semibold text-sand">GW{gw}</h4>
                <div className="space-y-3">
                  {gwMatches.map((match) => (
                    <MatchRow
                      key={match.matchId}
                      match={match}
                      live={false}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <HistoryPanel
        title="H2H season champions"
        entries={history}
        type="h2h"
        emptyMessage="H2H season winner is saved after GW38."
      />
    </div>
  );
}

function groupPastH2HMatches(matches, currentGameweekFplId) {
  const byGameweek = new Map();

  for (const match of matches) {
    if (match.gameweek >= currentGameweekFplId) continue;

    if (!byGameweek.has(match.gameweek)) {
      byGameweek.set(match.gameweek, []);
    }
    byGameweek.get(match.gameweek).push(match);
  }

  return [...byGameweek.entries()]
    .sort(([a], [b]) => b - a)
    .map(([gameweek, gwMatches]) => ({ gameweek, matches: gwMatches }));
}

function MatchRow({ match, live }) {
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
      {/* Mobile stacked layout */}
      <div className="space-y-3 sm:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`truncate font-semibold ${p1Wins ? "text-lime" : "text-sand"}`}>
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
            <p className={`truncate font-semibold ${p2Wins ? "text-lime" : "text-sand"}`}>
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

      {/* Desktop row */}
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
