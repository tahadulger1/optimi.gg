"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserProfile } from "@/types";
import {
  isAuthenticated,
  getCurrentUser,
  mockLogin,
  mockLogout,
  updateUserProfile,
} from "@/lib/auth";

interface UseAuthReturn {
  /** Kullanıcı giriş yapmış mı */
  isLoggedIn: boolean;
  /** Mevcut kullanıcı bilgisi */
  user: UserProfile | null;
  /** Auth durumu yükleniyor mu */
  isLoading: boolean;
  /** Giriş yap */
  login: () => void;
  /** Çıkış yap */
  logout: () => void;
  /** Kullanıcı bilgilerini güncelle */
  updateProfile: (updates: Partial<UserProfile>) => void;
  /** Auth durumunu yenile */
  refresh: () => void;
}

/**
 * Auth hook'u - kullanıcı oturum yönetimi
 */
export function useAuth(): UseAuthReturn {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth durumunu kontrol et
  const checkAuth = useCallback(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    setUser(authenticated ? getCurrentUser() : null);
    setIsLoading(false);
  }, []);

  // Component mount olduğunda auth durumunu kontrol et
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Giriş yap
  const login = useCallback(() => {
    mockLogin();
    checkAuth();
  }, [checkAuth]);

  // Çıkış yap
  const logout = useCallback(() => {
    mockLogout();
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  // Profil güncelle
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    const updatedUser = updateUserProfile(updates);
    setUser(updatedUser);
  }, []);

  return {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    refresh: checkAuth,
  };
}
