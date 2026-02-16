export interface HotelConfig {
  id: string;
  name: string;
  subtitle: string;
  whatsapp: string;
  logoUrl?: string; // Optional for now
  themeColor?: string; // Deprecated, use primaryColor
  primaryColor?: string; // e.g., #D4AF37
  enableMultiLanguage?: boolean;
  enableGarage?: boolean;
  footerText?: string;
  licenseKey?: string;
  createdAt?: string;
  backgroundUrl?: string;
}

export const DEFAULT_HOTEL: HotelConfig = {
  id: 'demonstração-hotel',
  name: 'CHECK-IN DIGITAL',
  subtitle: 'checkin digital demonstração',
  whatsapp: '5561982062229',
  themeColor: '#D4AF37', // Gold (Standard)
  primaryColor: '#D4AF37', // Gold (Standard)
  enableMultiLanguage: true,
  enableGarage: true,
  footerText: '© 2026 - Todos os direitos reservados',
  backgroundUrl: 'https://wallpapers.com/images/hd/orange-and-black-background-1600-x-1200-wl7ux7tltod19s4y.jpg'
};
