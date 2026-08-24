export function managerName(row) {
  if (!row) return "—";
  const first = row.firstName || row.first_name || "";
  const last = row.lastName || row.last_name || "";
  const full = `${first} ${last}`.trim();
  return full || row.teamName || row.team_name || "Unknown";
}

export function teamName(row) {
  if (!row) return "—";
  return row.teamName || row.team_name || row.displayName || "—";
}

export function formatPoints(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

export function formatTime(date) {
  if (!date) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
