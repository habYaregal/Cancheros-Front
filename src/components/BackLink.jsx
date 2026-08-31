import { Link } from "react-router-dom";

export default function BackLink({ to, label = "Back" }) {
  return (
    <Link
      to={to}
      className="mb-4 inline-flex text-sm font-semibold text-muted transition hover:text-lime"
    >
      ← {label}
    </Link>
  );
}
