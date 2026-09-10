import { Link } from "react-router-dom";
import { useLiveData } from "../hooks/useLiveData";
import {
  getCurrentGameweek,
  getH2H,
  getStandings,
  getWeekly,
} from "../api/client";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
} from "../components/ui";
import { formatPoints } from "../lib/format";

export default function HomePage() {
  const { data, error, loading, updatedAt } = useLiveData(
    async () => {
      const [gameweek, standings, weekly, h2h] = await Promise.all([
        getCurrentGameweek(),
        getStandings(),
        getWeekly(),
        getH2H(),
      ]);
      return { gameweek, standings, weekly, h2h };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock label="Loading Cancheros…" />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { gameweek, standings, weekly, h2h } = data;
  const live = gameweek && !gameweek.finished;

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative overflow-hidden border border-line bg-panel px-4 py-6 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,242,58,0.12),transparent_45%)]" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-lime sm:text-xs sm:tracking-[0.28em]">
            {live ? `Live · Gameweek ${gameweek.fplId}` : `Gameweek ${gameweek?.fplId}`}
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl leading-none text-sand sm:text-5xl">
            Private league.
            <br />
            Our rules.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-mist sm:text-base">
            Weekly, monthly, season, and head-to-head competitions on top of
            official Fantasy Premier League scores.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <Link
              to="/h2h"
              className="bg-lime px-4 py-2 text-sm font-bold text-pitch transition hover:brightness-110"
            >
              Head-to-Head
            </Link>
            <Link
              to="/weekly"
              className="border border-line px-4 py-2 text-sm font-semibold text-sand transition hover:border-lime/40"
            >
              This gameweek
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle
            title="Season table"
            subtitle={`${standings?.season?.name || "Season"} · FPL points`}
          />
          <StandingsTable rows={(standings?.standings || []).slice(0, 8)} />
          <Link
            to="/season"
            className="mt-4 inline-block text-sm font-semibold text-lime"
          >
            Full season →
          </Link>
        </div>

        <div>
          <SectionTitle
            title={`GW${weekly?.gameweek ?? ""}`}
            subtitle="Highest scorer this gameweek"
          />
          <div className="mb-4 border-l-4 border-lime bg-black/20 px-3 py-3 sm:px-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Weekly leader
            </p>
            <p className="mt-1 font-display text-xl text-sand sm:text-2xl">
              {weekly?.winner?.winner
                ? `${weekly.winner.winner.firstName} ${weekly.winner.winner.lastName}`
                : weekly?.winner?.tied
                  ? "Tied"
                  : "—"}
            </p>
            <p className="text-lime">
              {formatPoints(weekly?.leaderboard?.[0]?.points)} pts
            </p>
          </div>
          <StandingsTable rows={(weekly?.leaderboard || []).slice(0, 5)} />
        </div>
      </section>

      <section>
        <SectionTitle
          title="H2H table"
          subtitle="Provisional until the gameweek is finished"
        />
        <StandingsTable rows={(h2h?.standings || []).slice(0, 8)} showRecord />
        <Link
          to="/h2h"
          className="mt-4 inline-block text-sm font-semibold text-lime"
        >
          Fixtures & full table →
        </Link>
      </section>

      {updatedAt ? (
        <p className="sr-only">Last updated {updatedAt.toISOString()}</p>
      ) : null}
    </div>
  );
}
