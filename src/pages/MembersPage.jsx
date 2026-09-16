import { useLiveData } from "../hooks/useLiveData";
import { getRegisteredMembers } from "../api/client";
import { useProfile } from "../contexts/ProfileContext";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";

export default function MembersPage() {
  const { memberId } = useProfile();
  const { data, error, loading } = useLiveData(
    async () => {
      const members = await getRegisteredMembers();
      return { members };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock label="Loading members…" />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { members } = data;

  return (
    <div>
      <SectionTitle
        title="Registered members"
        subtitle="Cancheros managers who have linked their Telegram account."
      />

      {members.length === 0 ? (
        <div className="border border-line bg-panel px-4 py-5 text-sm text-mist">
          No members have registered yet. Open the bot and send /register
          <FPL_ID> to link your team.
        </div>
      ) : (
        <div className="space-y-2">
          {members.map((member) => {
            const isMe = memberId && member.memberId === memberId;
            const displayName = [member.firstName, member.lastName]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={member.telegramUserId}
                className={[
                  "flex items-center justify-between gap-3 border bg-panel px-3 py-3",
                  isMe ? "border-lime/60 bg-lime/10" : "border-line",
                ].join(" ")}
              >
                <div className="flex min-w-0 items-center gap-3">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime/20 font-display text-sm text-lime">
                      {(member.telegramFirstName || member.firstName || "?").slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sand">
                      {displayName || member.telegramFirstName || "Unknown"}
                      {isMe ? (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-lime">
                          You
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {member.teamName}
                      {member.username ? ` · @${member.username}` : ""}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  FPL #{member.fplId}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}