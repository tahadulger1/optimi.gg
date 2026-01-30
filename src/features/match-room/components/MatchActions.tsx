"use client";

import { useState } from "react";
import { type Match, MATCH_STATUS } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScreenshotUpload } from "./ScreenshotUpload";
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ImagePlus 
} from "lucide-react";

interface MatchActionsProps {
  match: Match;
  onReportResult: (winner: "teamA" | "teamB") => void;
  onUploadEvidence: (file: File) => Promise<void>;
  onDispute: () => void;
}

export function MatchActions({
  match,
  onReportResult,
  onUploadEvidence,
  onDispute,
}: MatchActionsProps) {
  const [selectedWinner, setSelectedWinner] = useState<"teamA" | "teamB" | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const isMatchActive = 
    match.status === MATCH_STATUS.IN_PROGRESS || 
    match.status === MATCH_STATUS.AWAITING_RESULT;
  
  const canReportResult = isMatchActive && !match.winner;
  const canDispute = match.status === MATCH_STATUS.AWAITING_RESULT;

  const handleWinnerSelect = (winner: "teamA" | "teamB") => {
    setSelectedWinner(winner);
    setShowUpload(true);
  };

  const handleEvidenceUpload = async (file: File) => {
    await onUploadEvidence(file);
    if (selectedWinner) {
      onReportResult(selectedWinner);
    }
    setShowUpload(false);
    setSelectedWinner(null);
  };

  // Maç tamamlandıysa sadece bilgi göster
  if (match.status === MATCH_STATUS.COMPLETED) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="flex items-center gap-3 p-3 sm:p-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm sm:text-base">Maç Tamamlandı</p>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Kazanan: {match.winner === "teamA" ? match.teamA.name : match.teamB.name}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Maç iptal edildiyse
  if (match.status === MATCH_STATUS.CANCELLED) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-center gap-3 p-3 sm:p-4">
          <XCircle className="h-5 w-5 text-destructive shrink-0" />
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm sm:text-base">Maç İptal Edildi</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Bu maç hakem tarafından iptal edilmiştir.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Flag className="h-4 w-4 text-primary" />
          Maç Sonucu Bildir
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Maç bittikten sonra kazananı seçin ve screenshot ile kanıtlayın.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0 sm:pt-0">
        {/* Winner Selection */}
        {canReportResult && !showUpload && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 min-h-[80px] hover:border-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleWinnerSelect("teamA")}
            >
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium line-clamp-1">{match.teamA.name}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Kazandı</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 min-h-[80px] hover:border-emerald-500 hover:bg-emerald-500/10"
              onClick={() => handleWinnerSelect("teamB")}
            >
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              <span className="text-xs sm:text-sm font-medium line-clamp-1">{match.teamB.name}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Kazandı</span>
            </Button>
          </div>
        )}

        {/* Screenshot Upload */}
        {showUpload && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start sm:items-center gap-2 rounded-lg bg-muted/50 p-2.5 sm:p-3">
              <ImagePlus className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-xs sm:text-sm">
                <strong>{selectedWinner === "teamA" ? match.teamA.name : match.teamB.name}</strong>
                {" "}kazandı olarak bildiriliyor. Screenshot ile kanıtlayın.
              </span>
            </div>
            <ScreenshotUpload onUpload={handleEvidenceUpload} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowUpload(false);
                setSelectedWinner(null);
              }}
              className="w-full min-h-[44px]"
            >
              İptal
            </Button>
          </div>
        )}

        {/* Dispute Button */}
        {canDispute && !showUpload && (
          <Button
            variant="outline"
            className="w-full min-h-[44px] border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={onDispute}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Sonuca İtiraz Et
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
