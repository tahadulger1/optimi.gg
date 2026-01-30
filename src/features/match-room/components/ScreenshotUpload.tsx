"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, X, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScreenshotUploadProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

type UploadState = "idle" | "preview" | "uploading" | "success" | "error";

// Güvenlik: İzin verilen dosya türleri ve magic bytes
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg"] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Magic bytes for image validation (dosya içeriği kontrolü)
const IMAGE_MAGIC_BYTES = {
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], // PNG header
  jpeg: [0xff, 0xd8, 0xff], // JPEG header
};

/**
 * Dosyanın gerçekten bir resim olup olmadığını magic bytes ile kontrol eder.
 * Bu, dosya uzantısının değiştirilmesiyle yapılan bypass saldırılarını önler.
 */
async function validateImageMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arr = new Uint8Array(reader.result as ArrayBuffer);
      
      // PNG kontrolü
      const isPng = IMAGE_MAGIC_BYTES.png.every((byte, index) => arr[index] === byte);
      
      // JPEG kontrolü
      const isJpeg = IMAGE_MAGIC_BYTES.jpeg.every((byte, index) => arr[index] === byte);
      
      resolve(isPng || isJpeg);
    };
    reader.onerror = () => resolve(false);
    
    // Sadece ilk 8 byte'ı oku (magic bytes için yeterli)
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
}

/**
 * Kapsamlı dosya validasyonu
 * - MIME type kontrolü
 * - Dosya uzantısı kontrolü
 * - Magic bytes (dosya içeriği) kontrolü
 * - Boyut kontrolü
 */
async function validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // 1. MIME type kontrolü
  if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return { valid: false, error: "Sadece PNG ve JPG dosyaları kabul edilir." };
  }

  // 2. Dosya uzantısı kontrolü
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["png", "jpg", "jpeg"].includes(extension)) {
    return { valid: false, error: "Geçersiz dosya uzantısı. Sadece .png, .jpg, .jpeg kabul edilir." };
  }

  // 3. Boyut kontrolü
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Dosya boyutu 5MB'dan küçük olmalıdır." };
  }

  // 4. Magic bytes kontrolü (en önemli güvenlik kontrolü)
  const hasValidMagicBytes = await validateImageMagicBytes(file);
  if (!hasValidMagicBytes) {
    return { 
      valid: false, 
      error: "Dosya içeriği geçersiz. Lütfen gerçek bir resim dosyası yükleyin." 
    };
  }

  return { valid: true };
}

export function ScreenshotUpload({ onUpload, disabled = false }: ScreenshotUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Hata durumunu sıfırla
    setError(null);

    // Reddedilen dosyaları kontrol et
    if (rejectedFiles.length > 0) {
      const firstError = rejectedFiles[0].errors[0];
      if (firstError.message.includes("type")) {
        setError("Sadece PNG ve JPG dosyaları kabul edilir.");
      } else if (firstError.message.includes("size")) {
        setError("Dosya boyutu 5MB'dan küçük olmalıdır.");
      } else {
        setError("Geçersiz dosya.");
      }
      return;
    }

    // Kabul edilen dosyayı işle
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Güvenlik: Kapsamlı dosya validasyonu
      const validation = await validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Geçersiz dosya.");
        return;
      }

      setSelectedFile(file);
      
      // Önizleme oluştur
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setUploadState("preview");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
    disabled: disabled || uploadState === "uploading",
  });

  const handleCancel = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
    setUploadState("idle");
    setError(null);
  }, [preview]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    setUploadState("uploading");
    setError(null);

    try {
      await onUpload(selectedFile);
      setUploadState("success");
      
      // 2 saniye sonra sıfırla
      setTimeout(() => {
        handleCancel();
      }, 2000);
    } catch {
      setUploadState("error");
      setError("Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }, [selectedFile, onUpload, handleCancel]);

  // Başarı durumu
  if (uploadState === "success") {
    return (
      <div className="rounded-lg border-2 border-emerald-500 bg-emerald-500/10 p-6">
        <div className="flex flex-col items-center gap-3 text-emerald-500">
          <CheckCircle className="h-12 w-12" />
          <p className="font-medium">Kanıt başarıyla gönderildi!</p>
        </div>
      </div>
    );
  }

  // Önizleme / yükleme / hata durumu (aynı UI, sadece butonlar disable olur)
  if ((uploadState === "preview" || uploadState === "uploading" || uploadState === "error") && preview) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Screenshot önizleme"
            className="h-full w-full object-contain"
          />
          <button
            onClick={handleCancel}
            className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            disabled={uploadState === "uploading"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {selectedFile.name}
            </span>
            <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={uploadState === "uploading"}
            className="flex-1"
          >
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploadState === "uploading"}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {uploadState === "uploading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Kanıtı Gönder
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Varsayılan dropzone durumu
  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && !isDragReject && "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              "rounded-full p-3",
              isDragActive && !isDragReject && "bg-primary/10 text-primary",
              isDragReject && "bg-destructive/10 text-destructive",
              !isDragActive && "bg-muted text-muted-foreground"
            )}
          >
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragActive
                ? isDragReject
                  ? "Bu dosya türü kabul edilmiyor"
                  : "Dosyayı buraya bırakın"
                : "Screenshot yükleyin"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sürükle-bırak veya tıklayarak seçin
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG (Maks. 5MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
