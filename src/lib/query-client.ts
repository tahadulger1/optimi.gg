import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Varsayılan olarak 30 saniye fresh kal
        staleTime: 30 * 1000,
        // 5 dakika cache'de tut
        gcTime: 5 * 60 * 1000,
        // Pencere odaklandığında otomatik yenileme
        refetchOnWindowFocus: false,
        // Bağlantı geri geldiğinde yenileme
        refetchOnReconnect: true,
        // 3 kez dene
        retry: 3,
        // Deneme aralığı (exponential backoff)
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Mutation başarısız olursa 1 kez dene
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: her zaman yeni client oluştur
    return makeQueryClient();
  } else {
    // Browser: singleton pattern
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
