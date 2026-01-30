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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type RankTier, RANK_TIER } from '../types';
import { getRankConfig } from '../constants';

/**
 * Rütbe ikonunu al
 */
function getRankIcon(tier: RankTier) {
  const iconProps = { className: 'w-full h-full' };
  
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

export type RankBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RankBadgeVariant = 'default' | 'outline' | 'minimal' | 'icon-only';

export interface RankBadgeProps {
  /** Rütbe seviyesi */
  tier: RankTier;
  /** Boyut */
  size?: RankBadgeSize;
  /** Varyant */
  variant?: RankBadgeVariant;
  /** Glow efekti göster */
  showGlow?: boolean;
  /** Tag göster (BRZ, SLV vb.) */
  showTag?: boolean;
  /** İkon göster */
  showIcon?: boolean;
  /** Ek className */
  className?: string;
  /** Tıklanabilir mi */
  onClick?: () => void;
}

const sizeClasses: Record<RankBadgeSize, string> = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
  lg: 'text-base px-3 py-1.5 gap-2',
  xl: 'text-lg px-4 py-2 gap-2',
};

const iconSizeClasses: Record<RankBadgeSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

/**
 * RankBadge - Rütbe rozeti bileşeni
 * 
 * Kullanıcının rütbesini görsel olarak gösterir.
 * Farklı boyut ve varyantlarla özelleştirilebilir.
 */
export const RankBadge = memo(function RankBadge({
  tier,
  size = 'md',
  variant = 'default',
  showGlow = false,
  showTag = true,
  showIcon = true,
  className,
  onClick,
}: RankBadgeProps) {
  const config = getRankConfig(tier);
  
  // Master ve Mastery için özel shimmer efekti
  const isHighTier = tier === RANK_TIER.MASTER || tier === RANK_TIER.MASTERY;
  const shimmerClass = tier === RANK_TIER.MASTER 
    ? 'rank-shimmer-master' 
    : tier === RANK_TIER.MASTERY 
      ? 'rank-shimmer-mastery' 
      : '';

  // Variant bazlı stil
  const variantClasses = {
    default: cn(
      `rank-badge-${tier}`,
      showGlow && `rank-glow-${tier}`,
      isHighTier && shimmerClass
    ),
    outline: cn(
      'bg-transparent border-2',
      `rank-border-${tier}`,
      `rank-text-${tier}`
    ),
    minimal: cn(
      'bg-transparent',
      `rank-text-${tier}`
    ),
    'icon-only': cn(
      `rank-badge-${tier}`,
      showGlow && `rank-glow-${tier}`,
      'p-1.5 rounded-full'
    ),
  };

  if (variant === 'icon-only') {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center',
          variantClasses[variant],
          isHighTier && 'rank-icon-pulse',
          onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        title={config.name}
      >
        <span className={iconSizeClasses[size]}>
          {getRankIcon(tier)}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-semibold transition-all',
        sizeClasses[size],
        variantClasses[variant],
        onClick && 'cursor-pointer hover:opacity-90 active:scale-95',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      title={`${config.name} - ${config.description}`}
    >
      {showIcon && (
        <span className={cn(iconSizeClasses[size], isHighTier && 'rank-icon-pulse')}>
          {getRankIcon(tier)}
        </span>
      )}
      {showTag && (
        <span className="font-bold tracking-wide">
          {config.tag}
        </span>
      )}
    </div>
  );
});

/**
 * Kullanıcı adı yanında gösterilecek minimal rütbe rozeti
 */
export const RankBadgeInline = memo(function RankBadgeInline({
  tier,
  className,
}: {
  tier: RankTier;
  className?: string;
}) {
  return (
    <RankBadge
      tier={tier}
      size="xs"
      variant="default"
      showIcon={false}
      showTag={true}
      className={className}
    />
  );
});

export default RankBadge;
