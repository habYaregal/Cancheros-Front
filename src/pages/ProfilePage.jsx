import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import { useTelegram } from "../contexts/TelegramContext";
import { formatPoints } from "../lib/format";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";
import {
  haptic,
  openLink,
  useMainButton,
} from "../lib/telegram";

export default function ProfilePage() {
  const { isTelegram, user } = useTelegram();
  const { me, loading, linked, refreshMe } = useProfile();
  const navigate = useNavigate();
  const mainButton = useMemo(() => useMainButton(), []);

  useEffect(() => {
    if (!isTelegram) {
      mainButton.hide();
      return;
    }
    if (linked) {
      mainButton.hide();
      return;
    }
    mainButton.show("Register with FPL ID", () => {
      haptic("selection");
      navigate("/register");
    });
    return () => mainButton.hide();
  }, [isTelegram, linked, mainButton, navigate]);

  if (!isTelegram) {
    return (
      <div>
        <SectionTitle
          title="Your profile"
          subtitle="Open Cancheros from the Telegram bot to sign in with your Telegram account."
        />
      </div>
    );
  }

  if (loading && !me) return <LoadingBlock label="Loading profile…" />;
  if (!me) {
    return (
      <ErrorBlock message="Could not read your Telegram session. Close the Mini App and open it again from the bot." />
    );
  }

  if (!linked) {
    const name = me.telegram?.firstName || user?.first_name || "there";
    return (
      <div>
        <SectionTitle
          title={`Hey ${name}`}
          subtitle="Link your FPL team to highlight your rows and unlock your personal dashboard."
        />
        <div className="flex flex-wrap gap-3">
          <Link
            to="/register"
            onClick={() => haptic("selection")}
            className="inline-flex bg-lime px-4 py-2.5 text-sm font-bold text-pitch sm:hidden"
          >
            Register with FPL ID
          </Link>
          <button
            type="button"
            onClick={() => {
              haptic("medium");
              void refreshMe().then(() => haptic("success"));
            }}
            className="inline-flex border border-line bg-panel px-4 py-2.5 text-sm font-bold text-mist transition hover:border-lime/50 hover:text-lime"
          >
            Refresh
          </button>
        </div>
        <p className="mt-3 text-xs text-muted sm:hidden">
          Or tap the green Register button at the bottom of the screen.
        </p>
      </div>
    );
  }

  const { telegram, member, snapshot } = me;
  const displayName = [member.firstName, member.lastName].filter(Boolean).join(" ");
  const fplUrl = `https://fantasy.premierleague.com/entry/${member.fplId}`;

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-4 border border-line bg-panel px-4 py-4">
        {telegram.photoUrl ? (
          <img
            src={telegram.photoUrl}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime/20 font-display text-xl text-lime">
            {(telegram.firstName || member.firstName || "?").slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl leading-none text-sand">
            {displayName || telegram.firstName}
          </p>
          <p className="mt-1 truncate text-sm text-mist">{member.teamName}</p>
          <p className="text-xs text-muted">
            <button
              type="button"
              onClick={() => {
                haptic("selection");
                openLink(fplUrl, { tryInstantView: true });
              }}
              className="underline decoration-dotted underline-offset-2 hover:text-lime"
            >
              FPL #{member.fplId}
            </button>
            {telegram.username ? ` · @${telegram.username}` : ""}
          </p>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Season"
          value={snapshot?.season ? `#${snapshot.season.position}` : "—"}
          detail={
            snapshot?.season
              ? `${formatPoints(snapshot.season.points)} pts`
              : "No scores yet"
          }
        />
        <StatCard
          label={snapshot?.weekly?.gameweek ? `GW${snapshot.weekly.gameweek}` : "This GW"}
          value={snapshot?.weekly ? `#${snapshot.weekly.position}` : "—"}
          detail={
            snapshot?.weekly
              ? `${formatPoints(snapshot.weekly.points)} pts`
              : "Waiting on scores"
          }
        />
        <StatCard
          label="H2H"
          value={snapshot?.h2h ? `#${snapshot.h2h.position}` : "—"}
          detail={
            snapshot?.h2h
              ? `${formatPoints(snapshot.h2h.points)} pts · PD ${snapshot.h2h.points_difference >= 0 ? "+" : ""}${snapshot.h2h.points_difference} · ${snapshot.h2h.wins}W ${snapshot.h2h.draws}D ${snapshot.h2h.losses}L`
              : "No fixtures yet"
          }
        />
      </div>

      {snapshot?.nextMatch ? (
        <section className="border-l-4 border-lime bg-panel px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            This week’s H2H
          </p>
          <p className="mt-1 font-semibold text-sand">
            {snapshot.nextMatch.isBye
              ? `GW${snapshot.nextMatch.gameweek} · Bye`
              : `GW${snapshot.nextMatch.gameweek} vs ${snapshot.nextMatch.opponent?.firstName || ""} ${snapshot.nextMatch.opponent?.lastName || ""}`.trim()}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, detail }) {
  return (
    <div
      className="border border-line bg-panel px-4 py-3"
      onClick={() => haptic("selection")}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-3xl text-lime">{value}</p>
      <p className="mt-1 text-xs text-mist">{detail}</p>
    </div>
  );
}
