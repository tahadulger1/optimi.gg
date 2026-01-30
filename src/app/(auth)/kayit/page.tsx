"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

// Şifre gereksinimleri
const passwordRequirements = [
  { id: "length", label: "En az 8 karakter", regex: /.{8,}/ },
  { id: "uppercase", label: "Bir büyük harf", regex: /[A-Z]/ },
  { id: "lowercase", label: "Bir küçük harf", regex: /[a-z]/ },
  { id: "number", label: "Bir rakam", regex: /[0-9]/ },
] as const;

// Sosyal giriş butonları
const socialProviders = [
  {
    id: "discord",
    name: "Discord",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    bgColor: "bg-[#5865F2] hover:bg-[#4752C4]",
  },
  {
    id: "steam",
    name: "Steam",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012zm8.094-7.301a3.017 3.017 0 0 0 3.017-3.016 3.017 3.017 0 0 0-6.033 0 3.016 3.016 0 0 0 3.016 3.016zm.001-5.503a2.49 2.49 0 0 1 2.489 2.487 2.49 2.49 0 0 1-4.978 0 2.49 2.49 0 0 1 2.489-2.487z" />
      </svg>
    ),
    bgColor: "bg-[#171A21] hover:bg-[#2A475E]",
  },
  {
    id: "google",
    name: "Google",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    bgColor: "bg-white hover:bg-gray-100 text-gray-900",
  },
] as const;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  });

  const password = watch("password");
  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API entegrasyonu
      console.log("Register data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Başarılı kayıt sonrası yönlendirme veya email doğrulama
    } catch (error) {
      console.error("Register error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Sosyal giriş entegrasyonu
    console.log("Social login:", provider);
  };

  const checkPasswordRequirement = (regex: RegExp) => {
    return password ? regex.test(password) : false;
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Hesap Oluştur</h1>
        <p className="text-muted-foreground">
          Optimi.gg ailesine katıl ve espor macerana başla
        </p>
      </div>

      {/* Sosyal Giriş Butonları */}
      <div className="grid grid-cols-3 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            className={cn(
              "h-11 border-border",
              provider.id === "google" && provider.bgColor
            )}
            onClick={() => handleSocialLogin(provider.id)}
          >
            {provider.icon}
            <span className="sr-only">{provider.name} ile kayıt ol</span>
          </Button>
        ))}
      </div>

      {/* Ayırıcı */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            veya e-posta ile kayıt ol
          </span>
        </div>
      </div>

      {/* Kayıt Formu */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Kullanıcı Adı */}
        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="optimigamer"
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
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              className={cn(
                "pl-10",
                errors.email && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Şifre */}
        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              </span>
            </button>
          </div>
          
          {/* Şifre Gereksinimleri */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {passwordRequirements.map((req) => {
              const isMet = checkPasswordRequirement(req.regex);
              return (
                <div
                  key={req.id}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    isMet ? "text-success" : "text-muted-foreground"
                  )}
                >
                  {isMet ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  {req.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Şifre Tekrar */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10",
                errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
              )}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showConfirmPassword ? "Şifreyi gizle" : "Şifreyi göster"}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Kullanım Şartları */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) =>
                setValue("acceptTerms", checked as true)
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm font-normal leading-tight cursor-pointer"
            >
              <Link
                href="/kullanim-sartlari"
                className="text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Kullanım Şartları
              </Link>
              &apos;nı ve{" "}
              <Link
                href="/gizlilik-politikasi"
                className="text-primary hover:text-primary/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Gizlilik Politikası
              </Link>
              &apos;nı okudum ve kabul ediyorum.
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Kayıt Ol Butonu */}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Hesap oluşturuluyor...
            </>
          ) : (
            "Kayıt Ol"
          )}
        </Button>
      </form>

      {/* Giriş Yap Linki */}
      <p className="text-center text-sm text-muted-foreground">
        Zaten bir hesabın var mı?{" "}
        <Link
          href="/giris"
          className="text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
