import React, { useState, useEffect } from 'react';
import { useHotel } from './HotelContext';
import { X, Save, Settings, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations, Language } from './translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentLanguage }) => {
  const { currentHotel, updateHotelConfig } = useHotel();
  const [formData, setFormData] = useState(currentHotel);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const t = translations[currentLanguage];

  useEffect(() => {
    if (isOpen) {
      setFormData(currentHotel);
      setIsAuthenticated(false); // Reset auth on open
      setPin('');
      setError('');
    }
  }, [isOpen, currentHotel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '54321') {
      setIsAuthenticated(true);
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateHotelConfig(formData);
    
    // Simulate Success LED/Delay
    setTimeout(() => {
      window.location.href = `/${formData.id}`;
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4"
        >
          {!isAuthenticated ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-[#1a1a1a] border border-[var(--primary-accent)]/30 rounded-xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[var(--primary-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-[var(--primary-accent)]" size={32} />
              </div>
              <h2 className="text-[var(--primary-accent)] text-xl font-bold tracking-widest">{t.adminSecurity}</h2>
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder={t.adminPinPlaceholder}
                  className="w-full bg-black border border-white/20 rounded p-4 text-center text-2xl text-white tracking-[0.5em] focus:border-[var(--primary-accent)] outline-none transition-all"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-xs font-bold tracking-widest"
                  >
                    {t.adminCancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 rounded bg-[var(--primary-accent)] text-black font-bold tracking-widest text-xs hover:brightness-110"
                  >
                    ENTER
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-[#1a1a1a] border border-[var(--primary-accent)] rounded-xl p-6 space-y-6 shadow-[0_0_50px_var(--primary-accent)] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Settings className="text-[var(--primary-accent)]" size={24} />
                  <h2 className="text-[var(--primary-accent)] text-xl font-bold flex items-center gap-2 tracking-wider">
                    {t.adminTitle}
                  </h2>
                </div>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--primary-accent)] uppercase mb-1">{t.adminHotelId} (SLUG URL)</label>
                  <div className="flex gap-2">
                    <input 
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="ex: hotel-beta"
                      className="flex-1 bg-black border border-white/20 rounded p-3 text-white focus:border-[var(--primary-accent)] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[var(--primary-accent)] uppercase mb-1">{t.adminWhatsapp}</label>
                  <input 
                    name="whatsapp"
                    placeholder="ex: +1234567890"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-[var(--primary-accent)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--primary-accent)] uppercase mb-1">{t.adminSubtitle}</label>
                  <input 
                    name="subtitle"
                    value={formData.subtitle || ''}
                    onChange={handleChange}
                    placeholder={t.adminSubtitle}
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-[var(--primary-accent)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--primary-accent)] uppercase mb-1">{t.adminFooterText}</label>
                  <textarea 
                    name="footerText"
                    value={formData.footerText || ''}
                    onChange={handleChange}
                    placeholder="© 2026 Alpha Plaza Hotel..."
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-[var(--primary-accent)] outline-none h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--primary-accent)] uppercase mb-1">{t.adminLicenseKey}</label>
                  <input 
                    name="licenseKey"
                    value={formData.licenseKey || ''}
                    onChange={handleChange}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="w-full bg-black border border-white/20 rounded p-3 text-white focus:border-[var(--primary-accent)] outline-none font-mono tracking-widest text-center"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-black/50 rounded border border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="text-[var(--primary-accent)]" size={20} />
                    <span className="text-sm text-white">{t.adminMultiLanguage}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="enableMultiLanguage"
                      checked={formData.enableMultiLanguage !== false}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 bg-black/50 rounded border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-[var(--primary-accent)] flex items-center justify-center">
                      <div className="w-3 h-3 bg-[var(--primary-accent)] rounded-sm" />
                    </div>
                    <span className="text-sm text-white">{t.adminGarage}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="enableGarage"
                      checked={formData.enableGarage !== false}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-accent)]"></div>
                  </label>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex gap-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-xs font-bold tracking-widest"
                >
                  {t.adminCancel}
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`flex-1 px-4 py-3 rounded font-bold tracking-widest text-xs transition-all ${
                    isSaving ? 'bg-green-500 text-black' : 'bg-[var(--primary-accent)] text-black hover:brightness-110'
                  }`}
                >
                  {isSaving ? t.adminSaved : t.adminSave}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
