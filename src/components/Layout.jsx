import { NavLink } from "react-router-dom";
import { formatTime } from "../lib/format";
import { useRefresh } from "../contexts/RefreshContext";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/weekly", label: "Weekly" },
  { to: "/monthly", label: "Monthly" },
  { to: "/season", label: "Season" },
  { to: "/h2h", label: "H2H" },
];

export default function Layout({ children, liveLabel, updatedAt }) {
  const { refresh, syncing } = useRefresh();

  return (
    <div className="pitch-grid min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 sm:mb-10 sm:gap-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-lime/80 sm:mb-2 sm:text-xs sm:tracking-[0.28em]">
                Mini Fantasy League
              </p>
              <h1 className="font-display text-[2.35rem] leading-none text-sand sm:text-6xl md:text-7xl">
                CANCHEROS
              </h1>
            </div>

            <button
              type="button"
              onClick={() => void refresh()}
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

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted sm:text-sm">
            {liveLabel ? (
              <p className="inline-flex items-center gap-2 text-lime">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                {liveLabel}
              </p>
            ) : (
              <span />
            )}
            {updatedAt ? <p>Updated {formatTime(updatedAt)}</p> : null}
          </div>

          <nav className="-mx-3 flex gap-1 overflow-x-auto border-y border-line px-3 py-2 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 sm:py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  [
                    "shrink-0 rounded-sm px-3 py-2 text-sm font-semibold tracking-wide transition",
                    isActive
                      ? "bg-lime text-pitch"
                      : "text-mist hover:bg-white/5 hover:text-sand",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-10 border-t border-line pt-4 text-xs text-muted sm:mt-12">
          Official FPL data · Cancheros competition rules
        </footer>
      </div>
    </div>
  );
}
