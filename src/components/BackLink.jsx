import { Link } from "react-router-dom";
import { useTelegram } from "../contexts/TelegramContext";

export default function BackLink({ to, label = "Back" }) {
  const { isTelegram } = useTelegram();

  if (isTelegram) return null;

  return (
    <Link
      to={to}
      className="mb-4 inline-flex text-sm font-semibold text-muted transition hover:text-lime"
    >
      ← {label}
    </Link>
  );
}
