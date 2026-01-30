/**
 * Z-Index Scale Sistemi
 * 
 * Projede tutarlı z-index kullanımı sağlamak için merkezi bir scale sistemi.
 * Yeni bileşenler eklerken bu değerleri kullanın.
 * 
 * Sıralama (düşükten yükseğe):
 * 1. Base (varsayılan içerik)
 * 2. Dropdown/Popover (10-20)
 * 3. Sticky elements (30)
 * 4. Fixed header/footer (40)
 * 5. Overlay/Backdrop (50)
 * 6. Modal/Dialog (60)
 * 7. Mobile menu (70)
 * 8. Toast/Notification (80)
 * 9. Tooltip (90)
 * 10. Maximum (100) - Kritik durumlar
 */

export const Z_INDEX = {
  /** Varsayılan z-index (0) */
  base: 0,
  
  /** Dropdown menüler, select içerikleri (10) */
  dropdown: 10,
  
  /** Popover, tooltip trigger üzerindeki içerikler (20) */
  popover: 20,
  
  /** Sticky elementler - section içi yapışkan öğeler (30) */
  sticky: 30,
  
  /** Fixed header, navigation bar (40) */
  header: 40,
  
  /** Kullanıcı dropdown menüsü - header üzerinde (45) */
  headerDropdown: 45,
  
  /** Overlay/Backdrop - modal arkası (50) */
  overlay: 50,
  
  /** Modal/Dialog içeriği (60) */
  modal: 60,
  
  /** Loading screen - modal üzerinde (65) */
  loading: 65,
  
  /** Mobile navigation menu (70) */
  mobileMenu: 70,
  
  /** Toast/Notification mesajları (80) */
  toast: 80,
  
  /** Tooltip (90) */
  tooltip: 90,
  
  /** Maksimum - kritik durumlar için (100) */
  max: 100,
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;
export type ZIndexValue = (typeof Z_INDEX)[ZIndexKey];

/**
 * Tailwind class'ı döndürür
 * @example getZIndexClass('modal') // 'z-[60]'
 */
export function getZIndexClass(key: ZIndexKey): string {
  return `z-[${Z_INDEX[key]}]`;
}

/**
 * CSS custom property olarak kullanım için
 * @example getZIndexVar('header') // 'var(--z-header)'
 */
export function getZIndexVar(key: ZIndexKey): string {
  return `var(--z-${key})`;
}
