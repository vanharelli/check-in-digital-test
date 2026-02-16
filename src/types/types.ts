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
  backgroundUrl: 'https://png.pngtree.com/thumb_back/fh260/background/20230704/pngtree-illustrated-3d-rendering-of-a-purple-and-black-geometric-background-image_3744926.jpg'
};
