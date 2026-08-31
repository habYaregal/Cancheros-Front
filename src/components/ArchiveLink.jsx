import { Link } from "react-router-dom";

export default function ArchiveLink({ to, label }) {
  return (
    <section className="mt-8 border-t border-line pt-6">
      <Link
        to={to}
        className="inline-flex border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-sand transition hover:border-lime/50 hover:text-lime"
      >
        {label}
      </Link>
    </section>
  );
}
