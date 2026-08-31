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
import ArchiveLink from "../components/ArchiveLink";
import H2HMatchRow from "../components/H2HMatchRow";
import HistoryPanel from "../components/HistoryPanel";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function H2HPage() {
  const { refresh } = useRefresh();
  const [drawing, setDrawing] = useState(false);
  const [drawMessage, setDrawMessage] = useState("");
  const [drawResult, setDrawResult] = useState(null);

  const { data, error, loading } = useLiveData(
    async () => {
      const gameweek = await getCurrentGameweek();
      const [standings, allMatches, drawStatus, history] = await Promise.all([
        getH2H(),
        getH2HMatches(),
        getH2HDrawStatus(),
        getH2HHistory(),
      ]);
      return { gameweek, standings, allMatches, drawStatus, history };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { gameweek, standings, allMatches, drawStatus, history } = data;
  const displayFplId = resolveDisplayFplId(gameweek, drawStatus);
  const displayMatches = (allMatches?.matches || []).filter(
    (match) => match.gameweek === displayFplId
  );
  const live =
    gameweek &&
    displayFplId === gameweek.fplId &&
    !gameweek.finished;

  async function handleDraw() {
    if (drawing || !drawStatus?.canDraw) return;

    setDrawing(true);
    setDrawMessage("");
    setDrawResult(null);

    try {
      const result = await drawH2HLottery();
      setDrawResult(result);
      await refresh();
    } catch (err) {
      setDrawMessage(
        err.response?.data?.error || err.message || "Draw failed."
      );
    } finally {
      setDrawing(false);
    }
  }

  const showDrawButton = Boolean(drawStatus?.pendingDraw);

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          title="Head-to-Head"
          subtitle={
            live
              ? `GW${displayFplId} fixtures are live and update as FPL scores move.`
              : `GW${displayFplId} fixtures`
          }
        />

        {showDrawButton ? (
          <div className="flex max-w-xs flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => void handleDraw()}
              disabled={drawing || !drawStatus.canDraw}
              className="shrink-0 self-start bg-lime px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-pitch transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
            >
              {drawing
                ? "Drawing…"
                : `Draw GW${drawStatus.targetGameweek?.fplId}`}
            </button>
            {!drawStatus.canDraw ? (
              <p className="text-xs text-muted sm:text-right">
                {drawStatus.reason}
              </p>
            ) : null}
          </div>
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

      {drawResult ? (
        <DrawReveal result={drawResult} />
      ) : null}

      <WinnerBanner
        winner={standings.winner}
        tiedLabel="Joint H2H leaders"
      />

      <section>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          GW{displayFplId} scoresheet
        </h3>
        {displayMatches.length === 0 ? (
          <div className="border border-line bg-panel px-4 py-5 text-sm text-mist">
            No H2H fixtures for this gameweek yet.
          </div>
        ) : (
          <div className="space-y-3">
            {displayMatches.map((match) => (
              <H2HMatchRow key={match.matchId} match={match} live={live} />
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

      <ArchiveLink to="/h2h/past" label="Browse past H2H gameweeks" />

      <HistoryPanel
        title="H2H season champions"
        entries={history}
        type="h2h"
        emptyMessage="H2H season winner is saved after GW38."
      />
    </div>
  );
}

function DrawReveal({ result }) {
  const gw = result.gameweek?.fplId;

  return (
    <section className="border border-lime/40 bg-panel px-4 py-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-lime">
        GW{gw} draw
      </h3>
      <div className="space-y-3">
        {(result.matches || []).map((match) => (
          <div
            key={match.matchId}
            className="border border-line bg-pitch px-3 py-3 sm:px-4"
          >
            {match.isBye ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-sand">
                    {match.playerOne}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {match.teamOne}
                  </p>
                </div>
                <p className="shrink-0 text-xs uppercase tracking-[0.16em] text-lime">
                  BYE
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-sand">
                    {match.playerOne}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {match.teamOne}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  vs
                </p>
                <div className="min-w-0 text-right">
                  <p className="truncate font-semibold text-sand">
                    {match.playerTwo}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {match.teamTwo}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function resolveDisplayFplId(gameweek, drawStatus) {
  const currentFplId = gameweek?.fplId;
  if (!currentFplId) return null;

  const targetFplId = drawStatus?.targetGameweek?.fplId;
  if (
    drawStatus?.alreadyDrawn &&
    targetFplId != null &&
    targetFplId > currentFplId
  ) {
    return targetFplId;
  }

  return currentFplId;
}
