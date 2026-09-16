import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import { useTelegram } from "../contexts/TelegramContext";
import { ErrorBlock, SectionTitle } from "../components/ui";
import {
  haptic,
  readClipboard,
  showAlert,
  useMainButton,
} from "../lib/telegram";

function parseFplId(input) {
  const trimmed = String(input || "").trim();
  const fromUrl = trimmed.match(/entry\/(\d+)/i);
  if (fromUrl) return Number(fromUrl[1]);
  const n = Number(trimmed);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isTelegram } = useTelegram();
  const { linked, register } = useProfile();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(() => parseFplId(value), [value]);
  const mainButton = useMemo(() => useMainButton(), []);

  const doRegister = async () => {
    const fplId = parsed;
    if (!fplId) {
      setError("Paste your FPL team ID or the team URL.");
      haptic("warning");
      return;
    }

    haptic("medium");
    setSaving(true);
    setError("");
    mainButton.setProgress(true);
    mainButton.setEnabled(false);

    try {
      await register(fplId);
      haptic("success");
      await showAlert("✅ Linked! Your rows will be highlighted in the tables.");
      navigate("/profile", { replace: true });
    } catch (err) {
      haptic("rigid");
      const msg = err.response?.data?.error || err.message || "Could not register.";
      setError(msg);
      void showAlert(`❌ ${msg}`);
    } finally {
      setSaving(false);
      mainButton.setProgress(false);
      mainButton.setEnabled(true);
    }
  };

  useEffect(() => {
    if (!isTelegram || linked) {
      mainButton.hide();
      return;
    }
    const canSubmit = Boolean(parsed) && !saving;
    mainButton.show("Register with FPL ID", doRegister, {
      disabled: !canSubmit,
      progress: saving,
    });
    return () => mainButton.hide();
  }, [isTelegram, linked, parsed, saving, mainButton]);

  const handlePaste = async () => {
    haptic("selection");
    const text = await readClipboard();
    if (text) {
      setValue(String(text));
      const id = parseFplId(text);
      if (id) haptic("impact");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    void doRegister();
  };

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
          onClick={() => {
            haptic("selection");
            navigate("/profile");
          }}
          className="bg-lime px-4 py-2 text-sm font-bold text-pitch"
        >
          Open profile
        </button>
      </div>
    );
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
          <div className="mt-2 flex items-stretch gap-2">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 1234567 or full FPL URL"
              className="flex-1 border border-line bg-black/30 px-3 py-2.5 text-base font-medium text-sand outline-none focus:border-lime/60"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="border border-line bg-panel px-3 text-sm font-semibold text-mist transition hover:border-lime/50 hover:text-lime"
            >
              Paste
            </button>
          </div>
          {parsed ? (
            <p className="mt-1.5 text-xs text-lime">Detected FPL ID: {parsed}</p>
          ) : value.trim() ? (
            <p className="mt-1.5 text-xs text-amber-400/80">No FPL ID detected — check the format.</p>
          ) : null}
        </label>

        <button
          type="submit"
          disabled={saving || !parsed}
          className="bg-lime px-4 py-2.5 text-sm font-bold text-pitch disabled:opacity-60 sm:hidden"
        >
          {saving ? "Linking…" : "Register"}
        </button>
        <p className="text-[11px] text-muted sm:hidden">
          Or tap the green Register button at the bottom.
        </p>
      </form>
    </div>
  );
}
