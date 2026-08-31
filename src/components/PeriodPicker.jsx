import { Link } from "react-router-dom";

export default function PeriodPicker({
  title = "Choose a period",
  items = [],
  emptyMessage = "Nothing to show yet.",
}) {
  if (!items.length) {
    return (
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
          {title}
        </h3>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.to}
            className="border border-line bg-panel px-3 py-2 text-sm font-semibold text-sand transition hover:border-lime/50 hover:text-lime"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
