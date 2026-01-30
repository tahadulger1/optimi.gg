/**
 * Güvenlik Yardımcı Fonksiyonları
 * 
 * Bu modül XSS, CSRF ve diğer güvenlik açıklarına karşı koruma sağlar.
 * Tüm kullanıcı girdileri bu fonksiyonlardan geçirilmelidir.
 */

// ============================================
// XSS (Cross-Site Scripting) Koruması
// ============================================

/**
 * HTML özel karakterlerini escape eder.
 * React varsayılan olarak JSX içinde escape yapar, ancak bu fonksiyon
 * ekstra güvenlik katmanı sağlar (özellikle backend'den gelen veriler için).
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Tehlikeli HTML tag'lerini ve attribute'larını temizler.
 * Rich text içerik için kullanılır.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return "";

  // Tehlikeli tag'leri kaldır
  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "link",
    "meta",
    "style",
    "base",
    "svg",
    "math",
  ];

  let sanitized = html;

  // Tag'leri kaldır
  dangerousTags.forEach((tag) => {
    const tagRegex = new RegExp(`<${tag}[^>]*>.*?</${tag}>|<${tag}[^>]*/?>`, "gis");
    sanitized = sanitized.replace(tagRegex, "");
  });

  // Tehlikeli attribute'ları kaldır
  const dangerousAttributes = [
    "onclick",
    "onerror",
    "onload",
    "onmouseover",
    "onfocus",
    "onblur",
    "onsubmit",
    "onreset",
    "onchange",
    "oninput",
    "onkeydown",
    "onkeyup",
    "onkeypress",
    "onmousedown",
    "onmouseup",
    "onmousemove",
    "onmouseout",
    "onmouseenter",
    "onmouseleave",
    "ondrag",
    "ondragstart",
    "ondragend",
    "ondragover",
    "ondragenter",
    "ondragleave",
    "ondrop",
    "javascript:",
    "data:",
    "vbscript:",
  ];

  dangerousAttributes.forEach((attr) => {
    const attrRegex = new RegExp(`\\s*${attr}[^>]*`, "gi");
    sanitized = sanitized.replace(attrRegex, "");
  });

  return sanitized;
}

/**
 * Kullanıcı girdisini güvenli hale getirir (düz metin için).
 * Chat mesajları, kullanıcı adları, bio vb. için kullanılır.
 */
export function sanitizeInput(input: string, maxLength = 1000): string {
  if (typeof input !== "string") return "";

  // Uzunluk sınırı
  let sanitized = input.slice(0, maxLength);

  // Null bytes ve diğer kontrol karakterlerini kaldır
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * URL'yi güvenli hale getirir (open redirect koruması).
 * Sadece izin verilen domain'lere yönlendirmeye izin verir.
 */
export function sanitizeUrl(url: string, allowedDomains: string[] = []): string | null {
  if (typeof url !== "string") return null;

  try {
    const parsed = new URL(url, window.location.origin);

    // javascript:, data: gibi tehlikeli protokolleri engelle
    const allowedProtocols = ["http:", "https:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return null;
    }

    // External URL kontrolü
    if (parsed.origin !== window.location.origin) {
      // Eğer allowedDomains belirtilmişse, sadece o domain'lere izin ver
      if (allowedDomains.length > 0) {
        const isAllowed = allowedDomains.some(
          (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
        );
        if (!isAllowed) {
          return null;
        }
      }
    }

    return parsed.href;
  } catch {
    // Geçersiz URL
    return null;
  }
}

/**
 * Sadece relative URL'lere izin verir (internal navigation için).
 */
export function sanitizeRelativeUrl(url: string): string {
  if (typeof url !== "string") return "/";

  // URL absolute ise veya protokol içeriyorsa reddet
  if (url.startsWith("//") || /^[a-z]+:/i.test(url)) {
    return "/";
  }

  // Sadece path kısmını al
  const sanitized = url.replace(/[^\w\-./]/g, "");
  
  return sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
}

// ============================================
// CSRF (Cross-Site Request Forgery) Koruması
// ============================================

/**
 * CSRF token oluşturur.
 * Bu token form gönderimlerinde ve API çağrılarında kullanılmalıdır.
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * CSRF token'ı session storage'a kaydeder.
 */
export function storeCsrfToken(token: string): void {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("csrf_token", token);
  }
}

/**
 * Session storage'dan CSRF token'ı alır.
 */
export function getCsrfToken(): string | null {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem("csrf_token");
  }
  return null;
}

/**
 * CSRF token'ı başlatır (sayfa yüklendiğinde çağrılmalı).
 */
export function initializeCsrfToken(): string {
  let token = getCsrfToken();
  if (!token) {
    token = generateCsrfToken();
    storeCsrfToken(token);
  }
  return token;
}

/**
 * API çağrıları için CSRF header'ı ekler.
 */
export function getCsrfHeaders(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { "X-CSRF-Token": token } : {};
}

// ============================================
// IDOR (Insecure Direct Object Reference) Koruması
// ============================================

/**
 * Kullanıcının belirli bir kaynağa erişim yetkisi olup olmadığını kontrol eder.
 * NOT: Bu fonksiyon sadece client-side için bir yardımcıdır.
 * Gerçek yetki kontrolü her zaman server-side'da yapılmalıdır!
 */
export interface AuthContext {
  userId: string;
  roles: string[];
  permissions: string[];
}

export function hasPermission(
  authContext: AuthContext | null,
  requiredPermission: string
): boolean {
  if (!authContext) return false;
  return authContext.permissions.includes(requiredPermission);
}

export function hasRole(
  authContext: AuthContext | null,
  requiredRole: string
): boolean {
  if (!authContext) return false;
  return authContext.roles.includes(requiredRole);
}

export function isResourceOwner(
  authContext: AuthContext | null,
  resourceOwnerId: string
): boolean {
  if (!authContext) return false;
  return authContext.userId === resourceOwnerId;
}

// ============================================
// Input Validation Helpers
// ============================================

/**
 * Email validasyonu
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Kullanıcı adı validasyonu (alfanumerik + underscore)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Güçlü şifre kontrolü
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Şifre en az 8 karakter olmalıdır.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Şifre en az bir büyük harf içermelidir.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Şifre en az bir küçük harf içermelidir.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Şifre en az bir rakam içermelidir.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Şifre en az bir özel karakter içermelidir.");
  }

  return { valid: errors.length === 0, errors };
}

// ============================================
// Rate Limiting (Client-Side)
// ============================================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Client-side rate limiting helper.
 * NOT: Gerçek rate limiting server-side'da yapılmalıdır!
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// ============================================
// Content Security Policy Helper
// ============================================

/**
 * Dinamik içerik için nonce oluşturur.
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
