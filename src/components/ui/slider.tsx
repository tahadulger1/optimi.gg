"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * Slider component
 * 
 * Kullanım:
 * - Controlled: value ve onValueChange proplarını birlikte kullanın
 * - Uncontrolled: defaultValue kullanın
 * 
 * UYARI: value ve defaultValue birlikte kullanmayın - 
 * bu React'te "uncontrolled to controlled" uyarısına neden olur.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // Thumb sayısını belirle - controlled veya uncontrolled moduna göre
  // value varsa controlled, yoksa defaultValue'dan veya varsayılan [min, max]'tan hesapla
  const thumbCount = React.useMemo(() => {
    if (value !== undefined && Array.isArray(value)) {
      return value.length;
    }
    if (defaultValue !== undefined && Array.isArray(defaultValue)) {
      return defaultValue.length;
    }
    // Varsayılan: single thumb
    return 1;
  }, [value, defaultValue]);

  // Controlled/Uncontrolled mantığını Radix'e bırakıyoruz
  // Sadece thumb sayısını hesaplıyoruz
  const thumbKeys = React.useMemo(
    () => Array.from({ length: thumbCount }, (_, i) => `thumb-${i}`),
    [thumbCount]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {thumbKeys.map((key) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={key}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
