export interface HotelConfig {
    id: string;
    name: string;
    subtitle: string;
    whatsapp: string;
    themeColor: string;
    primaryColor: string;
    enableMultiLanguage: boolean;
    enableGarage: boolean;
    footerText: string;
}

export const DEFAULT_HOTEL: HotelConfig = {
    id: 'alpha-plaza',
    name: 'Ficha Cadastral',
    subtitle: 'Alpha Plaza Hotel',
    whatsapp: '5561982062229',
    themeColor: '#D4AF37', // Gold
    primaryColor: '#000000', // Black
    enableMultiLanguage: true,
    enableGarage: true,
    footerText: '© 2026 Alpha Plaza Hotel - Todos os direitos reservados'
};
