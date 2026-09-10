import { NavLink, Link } from "react-router-dom";
import { formatTime } from "../lib/format";
import { useRefresh } from "../contexts/RefreshContext";
import { useProfile } from "../contexts/ProfileContext";
import { haptic } from "../lib/telegram";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/weekly", label: "Weekly" },
  { to: "/monthly", label: "Monthly" },
  { to: "/season", label: "Season" },
  { to: "/h2h", label: "H2H" },
];

export default function Layout({ children, liveLabel, updatedAt }) {
  const { refresh, syncing } = useRefresh();
  const { me, linked } = useProfile();
  const initial =
    (me?.telegram?.firstName || me?.member?.firstName || "?").slice(0, 1);

  return (
    <div className="pitch-grid tma-shell">
      <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-3 pt-3 sm:px-6 sm:pt-5 lg:px-8">
        <header className="mb-4 flex items-start justify-between gap-3 sm:mb-8">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-lime/80">
              Mini Fantasy League
            </p>
            <h1 className="font-display text-[1.85rem] leading-none text-sand sm:text-6xl">
              CANCHEROS
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted sm:text-sm">
              {liveLabel ? (
                <p className="inline-flex items-center gap-2 text-lime">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  {liveLabel}
                </p>
              ) : null}
              {updatedAt ? <p>Updated {formatTime(updatedAt)}</p> : null}
            </div>
          </div>

          <div className="mt-1 flex shrink-0 items-center gap-2">
            <Link
              to={linked ? "/profile" : "/register"}
              onClick={() => haptic("selection")}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-panel text-sm font-bold text-lime"
              aria-label={linked ? "Profile" : "Register"}
            >
              {me?.telegram?.photoUrl ? (
                <img
                  src={me.telegram.photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </Link>
            <button
            type="button"
            onClick={() => {
              haptic("impact");
              void refresh();
            }}
            disabled={syncing}
            className="mt-1 inline-flex shrink-0 items-center gap-2 border border-line bg-panel px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-sand transition hover:border-lime/50 hover:text-lime disabled:cursor-wait disabled:opacity-60 sm:px-3 sm:text-xs sm:tracking-[0.14em]"
          >
            <span
              className={[
                "inline-block h-3 w-3 rounded-full border-2 border-current border-r-transparent",
                syncing ? "animate-spin" : "",
              ].join(" ")}
              aria-hidden="true"
            />
            {syncing ? "Syncing…" : "Refresh"}
            </button>
          </div>
        </header>

        <main className="flex-1 pb-[calc(4.75rem+var(--tma-safe-bottom))]">
          {children}
        </main>
      </div>

      <nav className="tma-tabbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => haptic("selection")}
            className={({ isActive }) =>
              [
                "flex min-w-0 flex-1 items-center justify-center px-1 py-2 text-[11px] font-semibold tracking-wide transition sm:text-sm",
                isActive ? "text-lime" : "text-mist",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
