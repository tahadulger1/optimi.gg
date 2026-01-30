import { type Match } from "@/types";
import { Badge } from "@/components/ui/badge";
import { MATCH_STATUS_LABELS, GAME_TYPE_LABELS } from "@/constants/mockData";
import { Swords, Trophy, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  match: Match;
}

/**
 * Tarihi formatlar
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Saati formatlar
 */
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ScoreDisplay({ match }: ScoreDisplayProps) {
  const statusLabel = MATCH_STATUS_LABELS[match.status];
  const gameLabel = GAME_TYPE_LABELS[match.gameType];

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 rounded-lg border border-border bg-card p-4 sm:p-6">
      {/* Match Info Header */}
      <div className="text-center">
        <Badge className={cn("text-xs", statusLabel.className)}>{statusLabel.text}</Badge>
        <h2 className="mt-2 text-base sm:text-lg font-bold text-foreground line-clamp-1">
          {match.tournamentName}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">{match.round}</p>
      </div>

      {/* Score Section */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Team A Score */}
        <div className="text-center">
          <span className="text-4xl sm:text-5xl font-black text-foreground">
            {match.scoreA}
          </span>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <Swords className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">VS</span>
        </div>

        {/* Team B Score */}
        <div className="text-center">
          <span className="text-4xl sm:text-5xl font-black text-foreground">
            {match.scoreB}
          </span>
        </div>
      </div>

      {/* Winner Indicator */}
      {match.winner && (
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 text-emerald-500">
          <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">
            {match.winner === "teamA" ? match.teamA.name : match.teamB.name} Kazandı!
          </span>
        </div>
      )}

      {/* Match Details - Mobilde dikey, tablet+ yatay */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">{gameLabel}</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-border" />
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{formatDate(match.scheduledAt)}</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{formatTime(match.scheduledAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Kompakt skor gösterimi (header için)
 */
interface CompactScoreProps {
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
}

export function CompactScore({
  teamAName,
  teamBName,
  scoreA,
  scoreB,
}: CompactScoreProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2">
      <span className="font-medium text-foreground">{teamAName}</span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-2xl font-black",
            scoreA > scoreB ? "text-emerald-500" : "text-foreground"
          )}
        >
          {scoreA}
        </span>
        <span className="text-muted-foreground">-</span>
        <span
          className={cn(
            "text-2xl font-black",
            scoreB > scoreA ? "text-emerald-500" : "text-foreground"
          )}
        >
          {scoreB}
        </span>
      </div>
      <span className="font-medium text-foreground">{teamBName}</span>
    </div>
  );
}
