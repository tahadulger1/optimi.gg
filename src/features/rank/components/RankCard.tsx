'use client';

import { memo } from 'react';
import {
  Shield,
  ShieldCheck,
  Award,
  Crown,
  Gem,
  Sparkles,
  Flame,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { type RankTier, RANK_TIER, type UserRankData } from '../types';
import { getRankConfig, getNextRank, RANK_CONFIGS } from '../constants';
import { RankProgress } from './RankProgress';

/**
 * Rütbe ikonunu al (büyük versiyon)
 */
function getRankIcon(tier: RankTier, className?: string) {
  const iconProps = { className: cn('w-full h-full', className) };
  
  switch (tier) {
    case RANK_TIER.BRONZE:
      return <Shield {...iconProps} />;
    case RANK_TIER.SILVER:
      return <ShieldCheck {...iconProps} />;
    case RANK_TIER.GOLD:
      return <Award {...iconProps} />;
    case RANK_TIER.PLATINUM:
      return <Crown {...iconProps} />;
    case RANK_TIER.DIAMOND:
      return <Gem {...iconProps} />;
    case RANK_TIER.MASTERY:
      return <Sparkles {...iconProps} />;
    case RANK_TIER.MASTER:
      return <Flame {...iconProps} />;
    default:
      return <Shield {...iconProps} />;
  }
}

export interface RankCardProps {
  /** Kullanıcı rütbe verisi */
  rankData: UserRankData;
  /** Kompakt görünüm */
  compact?: boolean;
  /** Yetkileri göster */
  showPerks?: boolean;
  /** Tıklama olayı */
  onClick?: () => void;
  /** Ek className */
  className?: string;
}

/**
 * RankCard - Detaylı rütbe kartı bileşeni
 * 
 * Kullanıcının rütbesini, XP'sini ve ilerlemesini detaylı olarak gösterir.
 */
export const RankCard = memo(function RankCard({
  rankData,
  compact = false,
  showPerks = false,
  onClick,
  className,
}: RankCardProps) {
  const { currentTier, totalXp, progressPercentage, xpToNextTier } = rankData;
  const config = getRankConfig(currentTier);
  const nextTier = getNextRank(currentTier);
  const nextConfig = nextTier ? RANK_CONFIGS[nextTier] : null;
  
  const isMaxRank = currentTier === RANK_TIER.MASTER;
  const isHighTier = currentTier === RANK_TIER.MASTER || currentTier === RANK_TIER.MASTERY;

  if (compact) {
    return (
      <Card
        className={cn(
          'relative overflow-hidden border transition-all',
          `rank-border-${currentTier}`,
          onClick && 'cursor-pointer hover:scale-[1.02]',
          className
        )}
        onClick={onClick}
      >
        {/* Arka plan gradient efekti */}
        <div 
          className={cn(
            'absolute inset-0 opacity-10',
            `rank-badge-${currentTier}`
          )}
        />
        
        <CardContent className="relative p-4">
          <div className="flex items-center gap-3">
            {/* İkon */}
            <div 
              className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                `rank-badge-${currentTier}`,
                `rank-glow-${currentTier}`,
                isHighTier && 'rank-icon-pulse'
              )}
            >
              <span className="w-7 h-7">
                {getRankIcon(currentTier)}
              </span>
            </div>
            
            {/* Bilgi */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={cn('font-bold text-lg', `rank-text-${currentTier}`)}>
                  {config.name}
                </h3>
                <span className="text-muted-foreground text-sm">
                  {config.tag}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {totalXp.toLocaleString('tr-TR')} XP
              </p>
            </div>
            
            {/* İlerleme */}
            {!isMaxRank && (
              <div className="text-right">
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
            )}
          </div>
          
          {/* İlerleme çubuğu */}
          {!isMaxRank && (
            <div className="mt-3">
              <RankProgress tier={currentTier} progress={progressPercentage} size="sm" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-2 transition-all',
        `rank-border-${currentTier}`,
        `rank-glow-${currentTier}`,
        onClick && 'cursor-pointer hover:scale-[1.01]',
        className
      )}
      onClick={onClick}
    >
      {/* Arka plan gradient efekti */}
      <div 
        className={cn(
          'absolute inset-0 opacity-5',
          `rank-badge-${currentTier}`
        )}
      />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          {/* Sol - İkon ve isim */}
          <div className="flex items-center gap-4">
            <div 
              className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center',
                `rank-badge-${currentTier}`,
                `rank-glow-${currentTier}`,
                isHighTier && 'rank-icon-pulse'
              )}
            >
              <span className="w-10 h-10">
                {getRankIcon(currentTier)}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className={cn('font-bold text-2xl', `rank-text-${currentTier}`)}>
                  {config.name}
                </h2>
                <span 
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-bold',
                    `rank-badge-${currentTier}`
                  )}
                >
                  {config.tag}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {config.description}
              </p>
            </div>
          </div>
          
          {/* Sağ - XP bilgisi */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-lg">
                {totalXp.toLocaleString('tr-TR')}
              </span>
              <span className="text-muted-foreground text-sm">XP</span>
            </div>
            {!isMaxRank && (
              <p className="text-xs text-muted-foreground">
                Sonraki seviyeye: {xpToNextTier.toLocaleString('tr-TR')} XP
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* İlerleme çubuğu */}
        {!isMaxRank && nextConfig && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={`rank-text-${currentTier} font-medium`}>
                {config.name}
              </span>
              <div className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <span className={`rank-text-${nextTier} font-medium`}>
                  {nextConfig.name}
                </span>
              </div>
            </div>
            <RankProgress 
              tier={currentTier} 
              progress={progressPercentage} 
              showPercentage 
              size="md"
            />
          </div>
        )}
        
        {isMaxRank && (
          <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-transparent via-orange-500/10 to-transparent">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">
              En Yüksek Rütbe Seviyesine Ulaştın!
            </span>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
        )}
        
        {/* Yetkiler */}
        {showPerks && config.perks.length > 0 && (
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Rütbe Ayrıcalıkları
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {config.perks.map((perk, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className={cn('w-1.5 h-1.5 rounded-full', `rank-badge-${currentTier}`)} />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

/**
 * Mini rütbe kartı - Profil yanında göstermek için
 */
export const RankCardMini = memo(function RankCardMini({
  tier,
  totalXp,
  className,
  onClick,
}: {
  tier: RankTier;
  totalXp: number;
  className?: string;
  onClick?: () => void;
}) {
  const config = getRankConfig(tier);
  const isHighTier = tier === RANK_TIER.MASTER || tier === RANK_TIER.MASTERY;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all',
        `rank-border-${tier}`,
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <div 
        className={cn(
          'w-6 h-6 rounded flex items-center justify-center',
          `rank-badge-${tier}`,
          isHighTier && 'rank-icon-pulse'
        )}
      >
        <span className="w-3.5 h-3.5">
          {getRankIcon(tier)}
        </span>
      </div>
      <div className="flex flex-col">
        <span className={cn('text-xs font-bold leading-tight', `rank-text-${tier}`)}>
          {config.name}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight">
          {totalXp.toLocaleString('tr-TR')} XP
        </span>
      </div>
    </div>
  );
});

export default RankCard;
