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
    id: 'demonstração-hotel',
    name: 'CHECK-IN DIGITAL',
    subtitle: 'checkin digital demonstração',
    whatsapp: '5561982062229',
    themeColor: '#D4AF37', // Gold
    primaryColor: '#000000', // Black
    enableMultiLanguage: true,
    enableGarage: true,
    footerText: '© Marketelli Software Solutions e tecnologia - 2026 - Todos os direitos reservados'
};
