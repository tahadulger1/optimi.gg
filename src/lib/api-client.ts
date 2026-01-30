/**
 * Güvenli API Client
 * 
 * Bu modül tüm API çağrıları için merkezi bir client sağlar.
 * CSRF koruması, rate limiting ve güvenlik başlıkları içerir.
 */

import { getCsrfHeaders, initializeCsrfToken, checkRateLimit } from "./security";

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Rate limiting ayarları
const RATE_LIMIT_CONFIG = {
  maxRequests: 100, // Maksimum istek sayısı
  windowMs: 60 * 1000, // 1 dakika
};

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipCsrf?: boolean;
  skipRateLimit?: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export class ApiClientError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Güvenli API client
 * - CSRF token otomatik ekleme
 * - Rate limiting kontrolü
 * - Güvenlik başlıkları
 * - Hata yönetimi
 */
class SecureApiClient {
  private baseUrl: string;
  private csrfInitialized = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * CSRF token'ı başlat (ilk API çağrısında)
   */
  private initializeCsrf(): void {
    if (!this.csrfInitialized && typeof window !== "undefined") {
      initializeCsrfToken();
      this.csrfInitialized = true;
    }
  }

  /**
   * Güvenlik başlıklarını oluştur
   */
  private getSecurityHeaders(skipCsrf = false): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      // XSS koruması için
      "X-Content-Type-Options": "nosniff",
    };

    // CSRF token ekle (GET dışındaki istekler için)
    if (!skipCsrf) {
      const csrfHeaders = getCsrfHeaders();
      Object.assign(headers, csrfHeaders);
    }

    return headers;
  }

  /**
   * Rate limit kontrolü
   */
  private checkRateLimit(endpoint: string, skipRateLimit = false): void {
    if (skipRateLimit) return;

    const key = `api:${endpoint}`;
    const allowed = checkRateLimit(
      key,
      RATE_LIMIT_CONFIG.maxRequests,
      RATE_LIMIT_CONFIG.windowMs
    );

    if (!allowed) {
      throw new ApiClientError(
        "Çok fazla istek gönderdiniz. Lütfen bir süre bekleyin.",
        429,
        "RATE_LIMITED"
      );
    }
  }

  /**
   * API isteği gönder
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { body, skipCsrf, skipRateLimit, ...fetchOptions } = options;

    // CSRF'i başlat
    this.initializeCsrf();

    // Rate limit kontrolü
    this.checkRateLimit(endpoint, skipRateLimit);

    // URL oluştur
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${endpoint}`;

    // İstek seçenekleri
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.getSecurityHeaders(skipCsrf || fetchOptions.method === "GET"),
        ...fetchOptions.headers,
      },
      // Credentials dahil et (cookie tabanlı auth için)
      credentials: "same-origin",
    };

    // Body varsa ekle
    if (body !== undefined && body !== null) {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);

      // Response handling
      if (!response.ok) {
        let errorData: { message?: string; code?: string } = {};
        
        try {
          errorData = await response.json();
        } catch {
          // JSON parse hatası, varsayılan hata mesajı kullan
        }

        throw new ApiClientError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      // Boş response kontrolü
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Network hatası
      throw new ApiClientError(
        "Ağ hatası oluştu. Lütfen internet bağlantınızı kontrol edin.",
        0,
        "NETWORK_ERROR"
      );
    }
  }

  /**
   * GET isteği
   */
  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
      skipCsrf: true, // GET istekleri için CSRF gerekmez
    });
  }

  /**
   * POST isteği
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  /**
   * PUT isteği
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  /**
   * PATCH isteği
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  /**
   * DELETE isteği
   */
  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Singleton instance
export const apiClient = new SecureApiClient(API_BASE_URL);

// Export types
export type { SecureApiClient };
