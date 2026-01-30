"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import { mockPastTournaments, GAME_TYPE_LABELS, formatPrize } from "@/constants/mockData";

// Sıralama için ikon ve renk
function getPlacementInfo(placement: number) {
  if (placement === 1) {
    return {
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      label: "1. Sıra",
    };
  }
  if (placement === 2) {
    return {
      icon: Medal,
      color: "text-gray-300",
      bgColor: "bg-gray-300/10",
      label: "2. Sıra",
    };
  }
  if (placement === 3) {
    return {
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-600/10",
      label: "3. Sıra",
    };
  }
  return {
    icon: null,
    color: "text-muted-foreground",
    bgColor: "bg-muted/10",
    label: `${placement}. Sıra`,
  };
}

export function PastTournamentsTab() {
  if (mockPastTournaments.length === 0) {
    return (
      <Card className="bg-optimi-surface border-border/50">
        <CardContent className="py-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Henüz turnuva geçmişi yok
          </h3>
          <p className="text-muted-foreground text-sm">
            Turnuvalara katıldığında burada görünecek.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {mockPastTournaments.map((tournament) => {
        const placementInfo = getPlacementInfo(tournament.placement);
        const PlacementIcon = placementInfo.icon;
        
        return (
          <Card 
            key={tournament.id} 
            className="bg-optimi-surface border-border/50 hover:border-border transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Sol - Turnuva Bilgisi */}
                <div className="flex items-start gap-4">
                  {/* Placement Badge */}
                  <div className={`p-3 rounded-lg ${placementInfo.bgColor} shrink-0`}>
                    {PlacementIcon ? (
                      <PlacementIcon className={`h-6 w-6 ${placementInfo.color}`} />
                    ) : (
                      <span className={`text-lg font-bold ${placementInfo.color}`}>
                        #{tournament.placement}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">
                      {tournament.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {GAME_TYPE_LABELS[tournament.gameType]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(tournament.date).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sağ - Sonuç */}
                <div className="flex items-center gap-4 md:gap-6">
                  {/* Sıralama */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Sıralama</p>
                    <p className={`font-bold ${placementInfo.color}`}>
                      {placementInfo.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      / {tournament.totalParticipants} takım
                    </p>
                  </div>

                  {/* Ödül */}
                  <div className="text-center min-w-[80px]">
                    <p className="text-xs text-muted-foreground">Ödül</p>
                    <p className={`font-bold ${tournament.prizeWon > 0 ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {tournament.prizeWon > 0 
                        ? formatPrize(tournament.prizeWon, tournament.currency)
                        : "-"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
