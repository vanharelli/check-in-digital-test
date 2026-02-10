import { HotelConfig, DEFAULT_HOTEL } from './types';

export const hotelConfig: Record<string, HotelConfig> = {
  'default': DEFAULT_HOTEL,
  'alpha-plaza': DEFAULT_HOTEL,
  'demo-hotel': {
    ...DEFAULT_HOTEL,
    id: 'demo-hotel',
    name: 'Demo Hotel',
    subtitle: 'Demonstração do Sistema',
    primaryColor: '#D4AF37' // Gold
  }
};
