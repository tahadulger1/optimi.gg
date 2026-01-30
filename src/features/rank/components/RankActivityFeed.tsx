'use client';

import { memo } from 'react';
import {
  Users,
  Trophy,
  Swords,
  Star,
  Zap,
  Target,
  Award,
  Medal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RankActivityLog, RANK_ACTIVITY, type RankActivity } from '../types';

/**
 * Aktivite ikonunu al
 */
function getActivityIcon(activity: RankActivity) {
  switch (activity) {
    case RANK_ACTIVITY.CREATE_LOBBY:
      return Users;
    case RANK_ACTIVITY.JOIN_LOBBY:
      return Users;
    case RANK_ACTIVITY.JOIN_TOURNAMENT:
      return Trophy;
    case RANK_ACTIVITY.WIN_MATCH:
      return Swords;
    case RANK_ACTIVITY.COMPLETE_MATCH:
      return Target;
    case RANK_ACTIVITY.FIRST_BLOOD:
      return Star;
    case RANK_ACTIVITY.WIN_STREAK:
      return Zap;
    case RANK_ACTIVITY.TOURNAMENT_TOP_3:
      return Medal;
    case RANK_ACTIVITY.TOURNAMENT_WINNER:
      return Award;
    default:
      return Star;
  }
}

/**
 * Aktivite rengini al
 */
function getActivityColor(activity: RankActivity): string {
  switch (activity) {
    case RANK_ACTIVITY.CREATE_LOBBY:
    case RANK_ACTIVITY.JOIN_LOBBY:
      return 'text-blue-400 bg-blue-400/10';
    case RANK_ACTIVITY.JOIN_TOURNAMENT:
      return 'text-purple-400 bg-purple-400/10';
    case RANK_ACTIVITY.WIN_MATCH:
    case RANK_ACTIVITY.WIN_STREAK:
      return 'text-green-400 bg-green-400/10';
    case RANK_ACTIVITY.COMPLETE_MATCH:
      return 'text-cyan-400 bg-cyan-400/10';
    case RANK_ACTIVITY.FIRST_BLOOD:
      return 'text-yellow-400 bg-yellow-400/10';
    case RANK_ACTIVITY.TOURNAMENT_TOP_3:
      return 'text-orange-400 bg-orange-400/10';
    case RANK_ACTIVITY.TOURNAMENT_WINNER:
      return 'text-amber-400 bg-amber-400/10';
    default:
      return 'text-gray-400 bg-gray-400/10';
  }
}

/**
 * Tarihi formatla
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 7) return `${diffDays} gün önce`;
  
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'short' 
  });
}

export interface RankActivityItemProps {
  /** Aktivite logu */
  activity: RankActivityLog;
  /** Kompakt görünüm */
  compact?: boolean;
}

/**
 * Tek aktivite öğesi
 */
export const RankActivityItem = memo(function RankActivityItem({
  activity,
  compact = false,
}: RankActivityItemProps) {
  const Icon = getActivityIcon(activity.activity);
  const colorClass = getActivityColor(activity.activity);

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2">
          <div className={cn('p-1 rounded', colorClass)}>
            <Icon className="w-3 h-3" />
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
            {activity.description}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-semibold text-green-400">
            +{activity.xpGained}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors">
      {/* İkon */}
      <div className={cn('p-2 rounded-lg', colorClass)}>
        <Icon className="w-4 h-4" />
      </div>
      
      {/* İçerik */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{activity.description}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTimestamp(activity.timestamp)}
        </p>
      </div>
      
      {/* XP */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
        <Zap className="w-3.5 h-3.5 text-yellow-500" />
        <span className="text-sm font-bold text-green-400">
          +{activity.xpGained}
        </span>
      </div>
    </div>
  );
});

export interface RankActivityFeedProps {
  /** Aktivite listesi */
  activities: RankActivityLog[];
  /** Maksimum gösterilecek öğe sayısı */
  maxItems?: number;
  /** Kompakt görünüm */
  compact?: boolean;
  /** Başlık göster */
  showHeader?: boolean;
  /** Tümünü gör butonu tıklaması */
  onViewAll?: () => void;
  /** Ek className */
  className?: string;
}

/**
 * RankActivityFeed - XP kazanım aktiviteleri listesi
 */
export const RankActivityFeed = memo(function RankActivityFeed({
  activities,
  maxItems = 10,
  compact = false,
  showHeader = true,
  onViewAll,
  className,
}: RankActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  // Toplam XP hesapla
  const totalXp = displayedActivities.reduce((sum, a) => sum + a.xpGained, 0);

  if (compact) {
    return (
      <div className={cn('space-y-0', className)}>
        {displayedActivities.map((activity) => (
          <RankActivityItem 
            key={activity.id} 
            activity={activity} 
            compact 
          />
        ))}
        {hasMore && onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full text-xs text-primary hover:underline pt-2"
          >
            Tümünü gör ({activities.length})
          </button>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              XP Geçmişi
            </CardTitle>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10">
              <span className="text-sm font-bold text-green-400">
                +{totalXp} XP
              </span>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="pt-0">
        <div className="space-y-1">
          {displayedActivities.length > 0 ? (
            displayedActivities.map((activity) => (
              <RankActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Henüz aktivite yok. Lobi oluştur veya turnuvaya katıl!
            </p>
          )}
        </div>
        
        {hasMore && onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full text-sm text-primary hover:underline mt-4 pt-3 border-t border-border/50"
          >
            Tüm aktiviteleri gör ({activities.length})
          </button>
        )}
      </CardContent>
    </Card>
  );
});

export default RankActivityFeed;
