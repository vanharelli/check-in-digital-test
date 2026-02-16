import React, { createContext, useContext, useState, useCallback } from 'react';
import type { HotelConfig } from '../types/types';
import { DEFAULT_HOTEL } from '../types/types';

interface HotelContextType {
  currentHotel: HotelConfig;
  isLoading: boolean;
  updateHotelConfig: (config: HotelConfig) => void;
  loadHotel: (id: string) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Helper functions (defined outside to avoid re-creation)
const getHotelFromDB = async (id: string): Promise<HotelConfig | null> => {
  // LocalStorage (Local DB Only)
  try {
    const db = localStorage.getItem('hotels_db');
    if (!db) return null;
    const hotels = JSON.parse(db);
    return hotels[id] || null;
  } catch (e) {
    return null;
  }
};

const saveHotelToDB = async (config: HotelConfig) => {
  // Save to LocalStorage (Instant)
  try {
    const db = localStorage.getItem('hotels_db');
    const hotels = db ? JSON.parse(db) : {};
    hotels[config.id] = config;
    localStorage.setItem('hotels_db', JSON.stringify(hotels));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentHotel, setCurrentHotel] = useState<HotelConfig>(DEFAULT_HOTEL);
  const [isLoading, setIsLoading] = useState(true);

  const loadHotel = useCallback((id: string) => {
    setIsLoading(true);
    // Simulate network delay for UX smoothness
    setTimeout(async () => {
      try {
        const hotel = await getHotelFromDB(id);
        if (hotel) {
          // Migration: Auto-correct old Green theme to Gold Standard
          if (hotel.primaryColor === '#10B981' || !hotel.primaryColor) {
            hotel.primaryColor = '#D4AF37';
            hotel.themeColor = '#D4AF37';
            saveHotelToDB(hotel);
          }

          // Backfill createdAt for existing hotels to start trial tracking
          if (!hotel.createdAt) {
            hotel.createdAt = new Date().toISOString();
            saveHotelToDB(hotel);
          }
          setCurrentHotel(hotel);
        } else if (id === 'alpha-plaza') {
          const defaultWithDate = {
            ...DEFAULT_HOTEL,
            createdAt: new Date().toISOString()
          };
          setCurrentHotel(defaultWithDate);
          saveHotelToDB(defaultWithDate); // Seed default
        } else if (id === 'demo-hotel') {
          const demoConfig: HotelConfig = {
            ...DEFAULT_HOTEL,
            id: 'demo-hotel',
            name: 'Demo Hotel',
            subtitle: 'Demonstração do Sistema',
            primaryColor: '#D4AF37', // Gold
            createdAt: new Date().toISOString()
          };
          setCurrentHotel(demoConfig);
          saveHotelToDB(demoConfig);
        } else {
          // Auto-create template for new IDs
          const newHotel: HotelConfig = {
              ...DEFAULT_HOTEL,
              id,
              name: 'New Hotel Setup',
              subtitle: `Hotel ID: ${id}`,
              whatsapp: '',
              createdAt: new Date().toISOString()
          };
          setCurrentHotel(newHotel);
          saveHotelToDB(newHotel);
        }
      } catch (error) {
        console.error("Failed to load hotel config", error);
        // Fallback to default in worst case to avoid infinite loading
        setCurrentHotel(DEFAULT_HOTEL);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const updateHotelConfig = useCallback((config: HotelConfig) => {
    setCurrentHotel(config);
    saveHotelToDB(config);
    // Live update CSS variable
    if (config.primaryColor) {
      document.documentElement.style.setProperty('--primary-accent', config.primaryColor);
      document.documentElement.style.setProperty('--primary', config.primaryColor);
    }
  }, []);

  // Initial load CSS variable
  React.useEffect(() => {
    if (currentHotel.primaryColor) {
      document.documentElement.style.setProperty('--primary-accent', currentHotel.primaryColor);
      document.documentElement.style.setProperty('--primary', currentHotel.primaryColor);
    }
  }, [currentHotel.primaryColor]);

  return (
    <HotelContext.Provider value={{ currentHotel, isLoading, updateHotelConfig, loadHotel }}>
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
