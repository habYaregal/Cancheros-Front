import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import { useTelegram } from "../contexts/TelegramContext";
import { ErrorBlock, SectionTitle } from "../components/ui";

function parseFplId(input) {
  const trimmed = String(input || "").trim();
  const fromUrl = trimmed.match(/entry\/(\d+)/i);
  if (fromUrl) return Number(fromUrl[1]);
  return Number(trimmed);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const { linked, register } = useProfile();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isTelegram) {
    return (
      <SectionTitle
        title="Register"
        subtitle="Registration only works inside the Telegram Mini App."
      />
    );
  }

  if (linked) {
    return (
      <div>
        <SectionTitle
          title="You’re in"
          subtitle="Your Telegram account is already linked to a Cancheros manager."
        />
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="bg-lime px-4 py-2 text-sm font-bold text-pitch"
        >
          Open profile
        </button>
      </div>
    );
  }

  async function onSubmit(event) {
    event.preventDefault();
    const fplId = parseFplId(value);
    if (!Number.isInteger(fplId) || fplId <= 0) {
      setError("Paste your FPL team ID or the team URL.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await register(fplId);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Could not register.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <SectionTitle
        title="Link your FPL team"
        subtitle="Find the number in fantasy.premierleague.com/entry/YOUR_ID/. You must already be in the Cancheros FPL mini-league."
      />

      {error ? <div className="mb-4"><ErrorBlock message={error} /></div> : null}

      <form onSubmit={onSubmit} className="max-w-md space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          FPL team ID
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 1234567"
            className="mt-2 w-full border border-line bg-black/30 px-3 py-2.5 text-base font-medium text-sand outline-none focus:border-lime/60"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="bg-lime px-4 py-2.5 text-sm font-bold text-pitch disabled:opacity-60"
        >
          {saving ? "Linking…" : "Register"}
        </button>
      </form>
    </div>
  );
}
