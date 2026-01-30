import { type Team } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { USER_RANK_LABELS } from "@/constants/mockData";
import { Users, Crown, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: Team;
  side: "left" | "right";
  isWinner?: boolean;
}

/**
 * Takım adının baş harflerini alır
 */
function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TeamCard({ team, side, isWinner }: TeamCardProps) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:gap-4 rounded-lg border border-border bg-card p-3 sm:p-4",
        isWinner && "border-emerald-500/50 ring-1 ring-emerald-500/20"
      )}
    >
      {/* Team Header */}
      <div
        className={cn(
          "flex items-center gap-2 sm:gap-3",
          !isLeft && "md:flex-row-reverse"
        )}
      >
        <Avatar className="h-10 w-10 sm:h-14 sm:w-14 border-2 border-border shrink-0">
          <AvatarImage src={team.logoUrl ?? undefined} alt={team.name} />
          <AvatarFallback className="bg-muted text-sm sm:text-lg font-bold">
            {getTeamInitials(team.name)}
          </AvatarFallback>
        </Avatar>

        <div className={cn("flex-1 min-w-0", !isLeft && "md:text-right")}>
          <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{team.name}</h3>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground",
              !isLeft && "md:justify-end"
            )}
          >
            <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{team.players.length} oyuncu</span>
          </div>
        </div>

        {isWinner && (
          <Badge className="bg-emerald-500 text-white text-xs shrink-0">Kazanan</Badge>
        )}
      </div>

      {/* Player List */}
      <div className="space-y-2">
        <h4
          className={cn(
            "text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground",
            !isLeft && "md:text-right"
          )}
        >
          Kadro
        </h4>
        <div className="space-y-1 sm:space-y-1.5">
          {team.players.map((player) => {
            const isCaptain = player.id === team.captain.id;
            const rankLabel = USER_RANK_LABELS[player.rank];

            return (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 rounded-md bg-muted/30 px-2 py-1.5 min-h-[36px] sm:min-h-[40px]",
                  !isLeft && "md:flex-row-reverse"
                )}
              >
                <Avatar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0">
                  <AvatarImage src={player.avatarUrl ?? undefined} />
                  <AvatarFallback className="bg-secondary text-[10px] sm:text-xs">
                    <User className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </AvatarFallback>
                </Avatar>

                <span
                  className={cn(
                    "flex-1 text-xs sm:text-sm text-foreground truncate",
                    !isLeft && "md:text-right"
                  )}
                >
                  {player.username}
                </span>

                {isCaptain && (
                  <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 shrink-0" title="Kaptan" />
                )}

                <Badge
                  className={cn("text-[10px] sm:text-xs shrink-0", rankLabel.className)}
                  variant="secondary"
                >
                  {rankLabel.text}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
