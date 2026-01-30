import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS sınıflarını birleştirmek için yardımcı fonksiyon
 * shadcn/ui bileşenleri için gerekli
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Tarih formatlama yardımcısı
 */
export function formatDate(date: string | Date, locale = "tr-TR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Tarih ve saat formatlama yardımcısı
 */
export function formatDateTime(date: string | Date, locale = "tr-TR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Para birimi formatlama
 */
export function formatCurrency(
  amount: number,
  currency = "TRY",
  locale = "tr-TR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Kısa sayı formatlama (1K, 1M vb.)
 */
export function formatCompactNumber(num: number, locale = "tr-TR"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
}

/**
 * Slug oluşturma
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
