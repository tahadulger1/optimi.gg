"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, User, AtSign, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

// Form şeması
const settingsSchema = z.object({
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalı")
    .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
    .regex(/^[a-zA-Z0-9_]+$/, "Sadece harf, rakam ve alt çizgi kullanılabilir"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  bio: z.string().max(200, "Biyografi en fazla 200 karakter olabilir").optional(),
  discord: z.string().optional(),
  twitter: z.string().optional(),
  twitch: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsTabProps {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function SettingsTab({ user, onUpdateProfile }: SettingsTabProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      discord: user.socialLinks?.discord || "",
      twitter: user.socialLinks?.twitter || "",
      twitch: user.socialLinks?.twitch || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      // Mock API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Profili güncelle
      onUpdateProfile({
        username: data.username,
        email: data.email,
        bio: data.bio,
        socialLinks: {
          discord: data.discord || undefined,
          twitter: data.twitter || undefined,
          twitch: data.twitch || undefined,
        },
      });

      setSuccessMessage("Profil başarıyla güncellendi!");
      
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Başarı Mesajı */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {successMessage}
        </div>
      )}

      {/* Profil Bilgileri */}
      <Card className="bg-optimi-surface border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Bilgileri
          </CardTitle>
          <CardDescription>
            Temel profil bilgilerinizi güncelleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Kullanıcı Adı */}
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="kullanici_adi"
                className={cn(
                  "pl-10",
                  errors.username && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* E-posta */}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              className={cn(
                errors.email && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Biyografi */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biyografi</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                placeholder="Kendinizi kısaca tanıtın..."
                className={cn(
                  "pl-10 min-h-[100px] resize-none",
                  errors.bio && "border-destructive focus-visible:ring-destructive"
                )}
                {...register("bio")}
              />
            </div>
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maksimum 200 karakter
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sosyal Medya Bağlantıları */}
      <Card className="bg-optimi-surface border-border/50">
        <CardHeader>
          <CardTitle>Sosyal Medya</CardTitle>
          <CardDescription>
            Sosyal medya hesaplarınızı bağlayın
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Discord */}
          <div className="space-y-2">
            <Label htmlFor="discord" className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Discord
            </Label>
            <Input
              id="discord"
              placeholder="KullanıcıAdı#1234"
              {...register("discord")}
            />
          </div>

          {/* Twitter/X */}
          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X (Twitter)
            </Label>
            <Input
              id="twitter"
              placeholder="@kullaniciadi"
              {...register("twitter")}
            />
          </div>

          {/* Twitch */}
          <div className="space-y-2">
            <Label htmlFor="twitch" className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Twitch
            </Label>
            <Input
              id="twitch"
              placeholder="kullaniciadi"
              {...register("twitch")}
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-border/50" />

      {/* Kaydet Butonu */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 min-w-[150px]"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Değişiklikleri Kaydet
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
