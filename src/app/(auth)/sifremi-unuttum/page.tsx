"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: API entegrasyonu
      console.log("Forgot password data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Başarılı gönderim sonrası ekran
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        {/* Başarı İkonu */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </div>

        {/* Başlık */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            E-posta Gönderildi!
          </h1>
          <p className="text-muted-foreground">
            Şifre sıfırlama bağlantısı{" "}
            <span className="font-medium text-foreground">{submittedEmail}</span>{" "}
            adresine gönderildi.
          </p>
        </div>

        {/* Bilgilendirme */}
        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>
            E-postanız birkaç dakika içinde ulaşmazsa, spam klasörünüzü kontrol
            edin veya farklı bir e-posta adresi deneyin.
          </p>
        </div>

        {/* Butonlar */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsSuccess(false);
              setSubmittedEmail("");
            }}
          >
            Farklı bir e-posta dene
          </Button>
          <Link href="/giris" className="block">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Giriş sayfasına dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Geri Butonu */}
      <Link
        href="/giris"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Giriş sayfasına dön
      </Link>

      {/* Başlık */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Şifremi Unuttum</h1>
        <p className="text-muted-foreground">
          E-posta adresini gir, şifre sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Gönder Butonu */}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            "Şifre Sıfırlama Bağlantısı Gönder"
          )}
        </Button>
      </form>

      {/* Yardım Metni */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          E-posta adresini hatırlamıyor musun?{" "}
          <Link
            href="/destek"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Destek Al
          </Link>
        </p>
      </div>
    </div>
  );
}
