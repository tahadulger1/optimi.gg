// Etkinlikler için TypeScript tip tanımlamaları

import { GameType } from "@/types";

/**
 * Etkinlik durumu
 */
export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration_open",
  REGISTRATION_CLOSED: "registration_closed",
  LIVE: "live",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/**
 * Etkinlik tipi
 */
export const EVENT_TYPE = {
  ONLINE: "online",
  OFFLINE: "offline",
  HYBRID: "hybrid",
} as const;

export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

/**
 * Etkinlik kategorisi
 */
export const EVENT_CATEGORY = {
  MEETUP: "meetup",
  WORKSHOP: "workshop",
  PANEL: "panel",
  WEBINAR: "webinar",
  CONFERENCE: "conference",
  NETWORKING: "networking",
  COMMUNITY: "community",
  UNIVERSITY: "university",
} as const;

export type EventCategory =
  (typeof EVENT_CATEGORY)[keyof typeof EVENT_CATEGORY];

/**
 * Organizatör tipi
 */
export interface EventOrganizer {
  id: string;
  name: string;
  logoUrl: string | null;
  type: "university" | "company" | "community" | "optimi";
}

/**
 * Etkinlik lokasyon bilgisi
 */
export interface EventLocation {
  city: string;
  venue?: string;
  address?: string;
  isOnline: boolean;
  onlineUrl?: string;
}

/**
 * Etkinlik tipi
 */
export interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  bannerUrl?: string;
  status: EventStatus;
  type: EventType;
  category: EventCategory;
  gameType?: GameType;
  organizer: EventOrganizer;
  location: EventLocation;
  startDate: string;
  endDate?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  currentParticipants: number;
  isPaid: boolean;
  price?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Etkinlik kart özeti (liste görünümü için)
 */
export interface EventCard {
  id: string;
  title: string;
  imageUrl: string;
  status: EventStatus;
  type: EventType;
  category: EventCategory;
  gameType?: GameType;
  organizer: EventOrganizer;
  location: EventLocation;
  startDate: string;
  currentParticipants: number;
  maxParticipants?: number;
  tags: string[];
}

/**
 * Etkinlik filtreleme parametreleri
 */
export interface EventFilters {
  type?: EventType | "all";
  category?: EventCategory | "all";
  gameType?: GameType | "all";
  status?: EventStatus | "all";
  city?: string;
  search?: string;
}
