'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { type RankTier, RANK_TIER } from '../types';

export type RankProgressSize = 'sm' | 'md' | 'lg';

export interface RankProgressProps {
  /** Rütbe seviyesi (renk için) */
  tier: RankTier;
  /** İlerleme yüzdesi (0-100) */
  progress: number;
  /** Boyut */
  size?: RankProgressSize;
  /** Yüzde göster */
  showPercentage?: boolean;
  /** Animasyonlu */
  animated?: boolean;
  /** Ek className */
  className?: string;
}

const sizeClasses: Record<RankProgressSize, { bar: string; text: string }> = {
  sm: { bar: 'h-1.5', text: 'text-xs' },
  md: { bar: 'h-2.5', text: 'text-sm' },
  lg: { bar: 'h-4', text: 'text-base' },
};

/**
 * RankProgress - Rütbe ilerleme çubuğu bileşeni
 * 
 * Kullanıcının bir sonraki rütbeye olan ilerlemesini gösterir.
 */
export const RankProgress = memo(function RankProgress({
  tier,
  progress,
  size = 'md',
  showPercentage = false,
  animated = true,
  className,
}: RankProgressProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const isHighTier = tier === RANK_TIER.MASTER || tier === RANK_TIER.MASTERY;
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2">
        {/* İlerleme çubuğu */}
        <div 
          className={cn(
            'flex-1 rounded-full overflow-hidden bg-secondary/50',
            sizeClasses[size].bar
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              `rank-progress-${tier}`,
              animated && 'animate-pulse-slow',
              isHighTier && (tier === RANK_TIER.MASTER ? 'rank-shimmer-master' : 'rank-shimmer-mastery')
            )}
            style={{ width: `${safeProgress}%` }}
          />
        </div>
        
        {/* Yüzde */}
        {showPercentage && (
          <span className={cn(
            'font-medium tabular-nums min-w-[3ch]',
            sizeClasses[size].text,
            `rank-text-${tier}`
          )}>
            {safeProgress}%
          </span>
        )}
      </div>
    </div>
  );
});

/**
 * Çoklu rütbe ilerleme gösterimi
 * Tüm rütbeleri ve kullanıcının nerede olduğunu gösterir
 */
export const RankProgressFull = memo(function RankProgressFull({
  currentTier,
  totalXp,
  className,
}: {
  currentTier: RankTier;
  totalXp: number;
  className?: string;
}) {
  const tiers = Object.values(RANK_TIER) as RankTier[];
  const currentIndex = tiers.indexOf(currentTier);

  return (
    <div className={cn('w-full space-y-1', className)}>
      {/* Rütbe noktaları */}
      <div className="relative flex items-center justify-between">
        {/* Arka plan çizgi */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-secondary/50 rounded-full" />
        
        {/* İlerleme çizgisi */}
        <div 
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500',
            `rank-progress-${currentTier}`
          )}
          style={{ 
            width: `${(currentIndex / (tiers.length - 1)) * 100}%`,
            left: 0
          }}
        />
        
        {/* Rütbe noktaları */}
        {tiers.map((tier, index) => {
          const isPassed = index <= currentIndex;
          const isCurrent = tier === currentTier;
          
          return (
            <div
              key={tier}
              className={cn(
                'relative z-10 w-4 h-4 rounded-full border-2 transition-all',
                isPassed 
                  ? cn(`rank-badge-${tier}`, `rank-border-${tier}`)
                  : 'bg-secondary border-secondary',
                isCurrent && `rank-glow-${tier}`
              )}
              title={tier}
            />
          );
        })}
      </div>
      
      {/* XP gösterimi */}
      <div className="text-center">
        <span className="text-xs text-muted-foreground">
          Toplam: <span className="font-semibold text-foreground">{totalXp.toLocaleString('tr-TR')} XP</span>
        </span>
      </div>
    </div>
  );
});

/**
 * Dairesel ilerleme gösterimi
 */
export const RankProgressCircle = memo(function RankProgressCircle({
  tier,
  progress,
  size = 80,
  strokeWidth = 6,
  showPercentage = true,
  className,
}: {
  tier: RankTier;
  progress: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  className?: string;
}) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;
  const isHighTier = tier === RANK_TIER.MASTER || tier === RANK_TIER.MASTERY;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Arka plan halka */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary/30"
        />
        
        {/* İlerleme halkası */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-500 ease-out',
            `stroke-rank-${tier}`
          )}
          style={{
            stroke: `var(--color-rank-${tier})`,
          }}
        />
      </svg>
      
      {/* Merkez içerik */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            'text-lg font-bold',
            `rank-text-${tier}`,
            isHighTier && 'rank-icon-pulse'
          )}>
            {safeProgress}%
          </span>
        </div>
      )}
    </div>
  );
});

export default RankProgress;
