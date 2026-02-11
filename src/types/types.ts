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
  id: 'alpha-plaza',
  name: 'Ficha Cadastral',
  subtitle: 'Alpha Plaza Hotel',
  whatsapp: '5561982062229',
  themeColor: '#D4AF37', // Gold (Standard)
  primaryColor: '#D4AF37', // Gold (Standard)
  enableMultiLanguage: true,
  enableGarage: true,
  footerText: '© 2026 Alpha Plaza Hotel - Todos os direitos reservados',
  backgroundUrl: 'https://static.vecteezy.com/ti/vetor-gratis/t2/8953048-abstract-elegant-gold-lines-diagonal-scene-on-black-background-template-premium-award-design-gratis-vetor.jpg'
};
