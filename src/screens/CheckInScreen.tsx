import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Save, X, Palette } from 'lucide-react';
import { translations, Language } from '../data/translations';
import { useHotel } from '../context/HotelContext';
import { SettingsModal } from '../components/SettingsOverlay';

// --- Types & Interfaces ---
interface FormData {
  fullName: string;
  isForeigner: boolean;
  passportCountry: string;
  passportId: string;
  cpf: string;
  birthDate: string;
  address: string;
  number: string;
  zipCode: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  roomNumber: string;
  hasVehicle: boolean;
  vehicleModel: string;
  vehicleColor: string;
  vehiclePlate: string;
  vehicleExitTime: string;
}

// --- Constants ---
const ALPHA_GOLD = 'var(--primary-accent)';

const CheckInScreen: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentHotel, isLoading, updateHotelConfig, loadHotel } = useHotel();
  
  // Sync with context
  useEffect(() => {
    if (slug) {
      loadHotel(slug);
    }
  }, [slug, loadHotel]);

  const [showSettings, setShowSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempColor, setTempColor] = useState('#10B981'); // Default to Emerald (Pillar 1)

  useEffect(() => {
    if (currentHotel.primaryColor) {
      setTempColor(currentHotel.primaryColor);
    }
  }, [currentHotel.primaryColor]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('settings') === 'true') {
      setShowSettings(true);
    }
  }, []);

  // --- Trial Logic ---
  const [trialTimeLeft, setTrialTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!currentHotel || currentHotel.licenseKey) {
      setTrialTimeLeft('');
      setIsExpired(false);
      return;
    }

    const checkTrial = () => {
      // Use createdAt from config, or default to now if missing (should be set on creation/load)
      // Note: If createdAt is missing on an existing hotel, it will start a fresh trial this session.
      // Ideally backfill logic in HotelContext handles this.
      const createdAt = currentHotel.createdAt ? new Date(currentHotel.createdAt) : new Date(); 
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      const limit = 24 * 60 * 60 * 1000; // 24 hours in ms

      if (diff > limit) {
        setIsExpired(true);
        setTrialTimeLeft('00:00:00');
      } else {
        const remaining = limit - diff;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        setTrialTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        setIsExpired(false);
      }
    };

    checkTrial(); // Initial check
    const interval = setInterval(checkTrial, 1000);

    return () => clearInterval(interval);
  }, [currentHotel]);

  const handleExpiredRedirect = () => {
      window.location.href = "https://wa.me/5561982062229?text=Quero%20ativar%20minha%20licen%C3%A7a%20vital%C3%ADcia%20do%20Ficha%20Cadastral";
  };

  // --- State ---
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('selectedLanguage') as Language) || 'PT';
  });

  const t = translations[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    isForeigner: false,
    passportCountry: '',
    passportId: '',
    cpf: '',
    birthDate: '',
    address: '',
    number: '',
    zipCode: '',
    city: '',
    state: '',
    email: '',
    phone: '',
    roomNumber: '',
    hasVehicle: false,
    vehicleModel: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleExitTime: '',
  });

  const [isLegalChecked, setIsLegalChecked] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // --- Input Masks ---
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const maskZip = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const fetchAddress = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsFetchingAddress(true);

    // Timeout Promise (2 seconds max)
    const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
    );

    try {
      const fetchPromise = fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      const data = await response.json();

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
        }));
        
        setErrors(prev => ({
            ...prev,
            address: '',
            city: '',
            zipCode: ''
        }));

        // Speed Hack: Auto-focus Number field
        setTimeout(() => {
            numberInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching address or timeout:', error);
      // Fallback: Allow manual typing is automatic as loading state clears
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    // ADMIN TRIGGER
    if (name === 'fullName' && value === 'ADMIN_ACESS*') {
      setFormData(prev => ({ ...prev, fullName: '' }));
      setShowSettings(true);
      return;
    }

    // COLOR PICKER TRIGGER
    if (name === 'fullName' && value === 'ADMIN_COR*') {
      setFormData(prev => ({ ...prev, fullName: '' }));
      setShowColorPicker(true);
      return;
    }

    if (name === 'cpf') finalValue = maskCPF(value);
    if (name === 'phone') finalValue = maskPhone(value);
    if (name === 'birthDate') finalValue = maskDate(value);
    if (name === 'zipCode') {
      finalValue = maskZip(value);
      // INSTANT FETCH TRIGGER: Check clean digits length
      const cleanLength = finalValue.replace(/\D/g, '').length;
      if (cleanLength === 8) {
        fetchAddress(finalValue);
      }
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForeignerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isForeigner: e.target.value === 'yes' }));
  };

  const handleVehicleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, hasVehicle: e.target.value === 'yes' }));
  };

  // --- Color Picker Handlers ---
  useEffect(() => {
    if (showColorPicker && currentHotel.primaryColor) {
      setTempColor(currentHotel.primaryColor);
    }
  }, [showColorPicker, currentHotel.primaryColor]);

  const handleColorPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTempColor(color);
    document.documentElement.style.setProperty('--primary-accent', color);
  };

  const saveColor = () => {
    updateHotelConfig({ 
      ...currentHotel, 
      primaryColor: tempColor,
      themeColor: tempColor // Sync legacy field for compatibility
    });
    setShowColorPicker(false);
  };

  const cancelColor = () => {
    const originalColor = currentHotel.primaryColor || '#D4AF37';
    setTempColor(originalColor);
    document.documentElement.style.setProperty('--primary-accent', originalColor);
    setShowColorPicker(false);
  };

  // --- Validation & Submit ---
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = t.errorFullName;

    if (formData.isForeigner) {
      if (!formData.passportCountry.trim()) newErrors.passportCountry = t.errorCountry;
      if (!formData.passportId.trim()) newErrors.passportId = t.errorPassport;
    } else {
      if (formData.cpf.length < 14) newErrors.cpf = t.errorCpfInvalid;
    }

    if (formData.birthDate.length < 10) newErrors.birthDate = t.errorDate;
    if (!formData.address.trim()) newErrors.address = t.errorAddress;
    if (!formData.number.trim()) newErrors.number = t.errorNumber;
    if (formData.zipCode.length < 9) newErrors.zipCode = t.errorZip;
    if (!formData.city.trim()) newErrors.city = t.errorCity;
    if (!formData.state.trim()) newErrors.state = t.errorState;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.errorEmail;
    if (formData.phone.length < 14) newErrors.phone = t.errorPhone;

    if (formData.hasVehicle) {
      if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Modelo é obrigatório'; // Keeping generic or add to dict if needed, but dict has labels.
      if (!formData.vehicleColor.trim()) newErrors.vehicleColor = 'Cor é obrigatória';
      // Plate is optional now
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!isLegalChecked) return;

    // --- State & Unlock Logic (Custom User Instruction) ---
    // Atomic Unlock Trigger: Unlock Pillar 2 upon completion
    try {
      localStorage.setItem('unlockedPilar2', 'true');
      // Force storage event for same-window listeners
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error saving unlock state:', e);
    }

    const vehicleInfo = formData.hasVehicle 
      ? `${formData.vehicleModel} / ${formData.vehicleColor}${formData.vehiclePlate ? ' / ' + formData.vehiclePlate : ''}${formData.vehicleExitTime ? ' / Saída: ' + formData.vehicleExitTime : ''}` 
      : "Não vai usar a garagem";

    const idLine = formData.isForeigner
      ? `*🆔 PASSPORT:* ${formData.passportId} (${formData.passportCountry})`
      : `*🆔 CPF:* ${formData.cpf}`;

    const payload = [
      `*📋 CHECK-IN DIGITAL - ALPHA PLAZA*`,
      `--------------------------------`,
      `*👤 HÓSPEDE:* ${formData.fullName}`,
      idLine,
      `*🎂 DATA NASC:* ${formData.birthDate}`,
      `*📧 EMAIL:* ${formData.email}`,
      `*📞 TEL:* ${formData.phone}`,
      formData.roomNumber ? `*🚪 QUARTO:* ${formData.roomNumber}` : null,
      `*📍 ENDEREÇO:* ${formData.address}, ${formData.number}`,
      `*🌆 CIDADE:* ${formData.city} - ${formData.state} - ${formData.zipCode}`,
      `*🚗 VEÍCULO:* ${vehicleInfo}`,
      `--------------------------------`,
      `*IDIOMA:* ${language}`
    ].filter(Boolean).join('\n');

    // Use wa.me shortlink which is more reliable on mobile/desktop cross-platform
    const cleanPhone = currentHotel.whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(payload)}`;

    // Use window.open for better PWA/Mobile browser handling
    window.open(whatsappUrl, '_blank');

    // --- IMMEDIATE CLEANUP (Stateless Architecture) ---
    setFormData({
      fullName: '',
      isForeigner: false,
      passportCountry: '',
      passportId: '',
      cpf: '',
      birthDate: '',
      address: '',
      number: '',
      zipCode: '',
      city: '',
      state: '',
      email: '',
      phone: '',
      roomNumber: '',
      hasVehicle: false,
      vehicleModel: '',
      vehicleColor: '',
      vehiclePlate: '',
      vehicleExitTime: '',
    });
    setIsLegalChecked(false);
  };

  // --- Render Helpers ---
  const inputClasses = (hasError: boolean) => `
    w-full h-12 bg-black border ${hasError ? 'border-red-500' : 'border-white/20'} 
    rounded-lg px-4 text-base text-white placeholder-white/30 
    focus:outline-none focus:ring-1 focus:ring-[var(--primary-accent)] focus:border-[var(--primary-accent)]
    transition-all duration-300
  `;

  const labelClasses = "block text-[12px] uppercase tracking-wider text-[var(--primary-accent)] mb-1 font-semibold";

  const vehicleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formData.hasVehicle && vehicleRef.current) {
      setTimeout(() => {
        vehicleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [formData.hasVehicle]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--primary-accent)]" />
      </div>
    );
  }

  const bgUrl = currentHotel.backgroundUrl || 'https://static.vecteezy.com/ti/vetor-gratis/t2/8953048-abstract-elegant-gold-lines-diagonal-scene-on-black-background-template-premium-award-design-gratis-vetor.jpg';

  return (
    <div 
      className="min-h-[100dvh] w-full bg-[#050505] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col items-center justify-center px-4 py-8 pb-[safe-area-inset-bottom] font-sans selection:bg-[var(--primary-accent)] selection:text-black relative transition-all duration-500"
      style={{ backgroundImage: `url('${bgUrl}')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[10px]" /> {/* Overlay for better text readability */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} currentLanguage={language} />

      {/* Elite Color Picker Modal */}
      <AnimatePresence>
        {showColorPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-[#0a0a0a] border border-[var(--primary-accent)]/30 rounded-2xl p-8 text-center space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-20 h-20 bg-[var(--primary-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--primary-accent)]/20 shadow-[0_0_30px_var(--primary-accent)] transition-all duration-300">
                <Palette className="text-[var(--primary-accent)]" size={40} />
              </div>
              
              <h2 className="text-[var(--primary-accent)] text-lg font-bold tracking-[0.2em] uppercase leading-relaxed">
                {t.adminColorPicker}
              </h2>

              <div className="relative group">
                 <input 
                   type="color" 
                   value={tempColor}
                   onChange={handleColorPreview}
                   className="w-full h-20 bg-transparent cursor-pointer rounded-lg border-2 border-white/10 hover:border-[var(--primary-accent)] transition-all"
                 />
                 <p className="mt-4 font-mono text-white/50 tracking-widest">{tempColor.toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={cancelColor}
                  className="px-6 py-4 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs font-bold tracking-widest"
                >
                  {t.adminCancel}
                </button>
                <button 
                  onClick={saveColor}
                  className="px-6 py-4 rounded-lg bg-[var(--primary-accent)] text-black font-bold tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_0_20px_var(--primary-accent)]"
                >
                  {t.adminFixColor}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trial Countdown */}
      {trialTimeLeft && !isExpired && (
        <div className="absolute top-0 left-0 w-full bg-red-900/50 text-red-200 text-xs font-bold tracking-widest text-center py-2 z-50 backdrop-blur-md border-b border-red-500/30 uppercase animate-pulse">
           {t.trialMode}: {trialTimeLeft}
        </div>
      )}

      {/* Expired Overlay */}
      {isExpired && !showSettings && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-8 text-center space-y-6 backdrop-blur-xl">
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)]"
           >
              <Lock className="text-red-500" size={48} />
           </motion.div>
           <h2 className="text-2xl font-bold text-white max-w-md leading-relaxed">{t.trialExpired}</h2>
           <button 
             onClick={handleExpiredRedirect}
             className="bg-[#25D366] text-black font-bold py-4 px-8 rounded-full hover:bg-[#128C7E] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center gap-3"
           >
             <span className="text-xl">WhatsApp Marketelli</span>
           </button>
           <button 
              onClick={() => setShowSettings(true)}
              className="text-white/30 text-xs hover:text-white underline mt-8 uppercase tracking-widest"
           >
              {t.adminTitle}
           </button>
        </div>
      )}

      {/* Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-accent)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--primary-accent)]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden z-10"
      >
        
        {/* Header Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--primary-accent)] to-transparent opacity-50" />

        {/* Language Toggle */}
        {currentHotel.enableMultiLanguage !== false && (
          <div className="sticky top-0 right-0 w-full flex justify-end px-6 py-4 z-30 bg-black/20 backdrop-blur-sm gap-6">
            {(['PT', 'EN', 'ES'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`text-2xl transition-all duration-300 ${
                  language === lang ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-100 hover:scale-105'
                }`}
                title={lang}
              >
                {lang === 'PT' && (
                  <svg viewBox="0 0 72 50" width="24" height="16" className="rounded-sm shadow-sm">
                    <rect width="72" height="50" fill="#009c3b"/>
                    <path d="M36,11 L64,25 L36,39 L8,25 Z" fill="#ffdf00"/>
                    <circle cx="36" cy="25" r="9" fill="#002776"/>
                  </svg>
                )}
                {lang === 'EN' && (
                  <svg viewBox="0 0 72 50" width="24" height="16" className="rounded-sm shadow-sm">
                    <rect width="72" height="50" fill="#b22234"/>
                    <path d="M0,7.7 H72 M0,15.4 H72 M0,23.1 H72 M0,30.8 H72 M0,38.5 H72 M0,46.2 H72" stroke="#fff" strokeWidth="3.8"/>
                    <rect width="28.8" height="27" fill="#3c3b6e"/>
                  </svg>
                )}
                {lang === 'ES' && (
                  <svg viewBox="0 0 72 50" width="24" height="16" className="rounded-sm shadow-sm">
                    <rect width="72" height="50" fill="#AA151B"/>
                    <rect y="12.5" width="72" height="25" fill="#F1BF00"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="p-8 pt-2 space-y-8">
          
          {/* Title */}
          <div className="text-center space-y-2 flex flex-col items-center select-none">
             {currentHotel.logoUrl ? (
                <img src={currentHotel.logoUrl} alt={currentHotel.name} className="h-20 object-contain mb-2" />
             ) : (
                <h1 className="text-2xl font-bold text-white tracking-widest uppercase">{currentHotel.name || t.title}</h1>
             )}
            <p className="text-[var(--primary-accent)] text-xs tracking-[0.2em] uppercase">{currentHotel.subtitle}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            
            {/* Personal Data */}
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>{t.fullName}</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClasses(!!errors.fullName)}
                  placeholder={t.fullNamePlaceholder}
                  autoComplete="off"
                />
              </div>

              {/* Foreigner Toggle */}
              <div>
                <label className={labelClasses}>{t.isForeigner}</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="isForeigner" 
                      value="no" 
                      checked={!formData.isForeigner} 
                      onChange={handleForeignerToggle}
                      className="accent-[var(--primary-accent)] w-5 h-5"
                    />
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">{t.no}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="isForeigner" 
                      value="yes" 
                      checked={formData.isForeigner} 
                      onChange={handleForeignerToggle}
                      className="accent-[var(--primary-accent)] w-5 h-5"
                    />
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors">{t.yes}</span>
                  </label>
                </div>
              </div>

              {/* Conditional Foreigner Fields */}
              <AnimatePresence>
                {formData.isForeigner && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className={labelClasses}>{t.country}</label>
                        <input 
                          type="text" 
                          name="passportCountry"
                          value={formData.passportCountry}
                          onChange={handleChange}
                          className={inputClasses(!!errors.passportCountry)}
                          placeholder={t.countryPlaceholder}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>{t.passport}</label>
                        <input 
                          type="text" 
                          name="passportId"
                          value={formData.passportId}
                          onChange={handleChange}
                          className={inputClasses(!!errors.passportId)}
                          placeholder={t.passportPlaceholder}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!formData.isForeigner && (
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.3 }}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className={labelClasses}>{t.cpf}</label>
                        <input 
                            type="text" 
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className={inputClasses(!!errors.cpf)}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            inputMode="numeric"
                            autoComplete="off"
                        />
                        </div>
                        <div>
                        <label className={labelClasses}>{t.birthDate}</label>
                        <input 
                            type="text" 
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className={inputClasses(!!errors.birthDate)}
                            placeholder={t.birthDatePlaceholder}
                            maxLength={10}
                            inputMode="numeric"
                            autoComplete="off"
                        />
                        </div>
                    </div>
                </motion.div>
              )}
              
              {formData.isForeigner && (
                  <div className="pt-4">
                    <label className={labelClasses}>{t.birthDate}</label>
                    <input 
                        type="text" 
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={inputClasses(!!errors.birthDate)}
                        placeholder={t.birthDatePlaceholder}
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="off"
                    />
                  </div>
              )}
            </div>

            {/* Contact & Address */}
            <div className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className={labelClasses}>{t.zipCode}</label>
                    <input 
                      type="text" 
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={inputClasses(!!errors.zipCode)}
                      placeholder="00000-000"
                      maxLength={9}
                      inputMode="numeric"
                      autoComplete="off"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>{t.address}</label>
                    {isFetchingAddress ? (
                      <div className="w-full h-12 bg-white/5 animate-pulse rounded-lg border border-white/10 flex items-center px-4">
                        <span className="text-white/20 text-sm tracking-widest uppercase">Buscando...</span>
                      </div>
                    ) : (
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputClasses(!!errors.address)}
                        placeholder={t.addressPlaceholder}
                        autoComplete="off"
                      />
                    )}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                     <label className={labelClasses}>{t.number}</label>
                     <input 
                       ref={numberInputRef}
                       type="text" 
                       name="number"
                       value={formData.number}
                       onChange={handleChange}
                       className={inputClasses(!!errors.number)}
                       placeholder={t.numberPlaceholder}
                       autoComplete="off"
                       inputMode="numeric"
                     />
                  </div>
                  <div className="sm:col-span-2">
                     <label className={labelClasses}>{t.city}</label>
                     {isFetchingAddress ? (
                       <div className="w-full h-12 bg-white/5 animate-pulse rounded-lg border border-white/10 flex items-center px-4">
                         <span className="text-white/20 text-sm tracking-widest uppercase">Buscando...</span>
                       </div>
                     ) : (
                       <input 
                         type="text" 
                         name="city"
                         value={formData.city}
                         onChange={handleChange}
                         className={inputClasses(!!errors.city)}
                         placeholder={t.cityPlaceholder}
                         autoComplete="off"
                       />
                     )}
                  </div>
                  <div className="sm:col-span-1">
                     <label className={labelClasses}>{t.state}</label>
                     {isFetchingAddress ? (
                       <div className="w-full h-12 bg-white/5 animate-pulse rounded-lg border border-white/10 flex items-center px-4">
                         <span className="text-white/20 text-sm tracking-widest uppercase">...</span>
                       </div>
                     ) : (
                       <input 
                         type="text" 
                         name="state"
                         value={formData.state}
                         onChange={handleChange}
                         className={inputClasses(!!errors.state)}
                         placeholder={t.statePlaceholder}
                         autoComplete="off"
                       />
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>{t.email}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClasses(!!errors.email)}
                      placeholder={t.emailPlaceholder}
                      autoComplete="off"
                      inputMode="email"
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>{t.phone}</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses(!!errors.phone)}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      inputMode="tel"
                      autoComplete="off"
                    />
                  </div>
               </div>

               <div className="mt-4">
                  <label className={labelClasses}>{t.roomNumber}</label>
                  <input 
                    type="text" 
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className={inputClasses(false)}
                    placeholder={t.roomNumberPlaceholder}
                    autoComplete="off"
                    inputMode="numeric"
                  />
               </div>
            </div>

            {/* Vehicle Logic */}
            {currentHotel.enableGarage !== false && (
              <div className="pt-4 border-t border-white/10">
                <label className={labelClasses}>{t.hasVehicle}</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="hasVehicle" 
                      value="yes"
                      checked={formData.hasVehicle === true}
                      onChange={handleVehicleToggle}
                      className="appearance-none w-4 h-4 border border-[var(--primary-accent)] rounded-full checked:bg-[var(--primary-accent)] transition-all"
                    />
                    <span className={`text-sm ${formData.hasVehicle ? 'text-[var(--primary-accent)]' : 'text-white/60'} group-hover:text-[var(--primary-accent)] transition-colors`}>{t.yes}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="hasVehicle" 
                      value="no"
                      checked={formData.hasVehicle === false}
                      onChange={handleVehicleToggle}
                      className="appearance-none w-4 h-4 border border-[var(--primary-accent)] rounded-full checked:bg-[var(--primary-accent)] transition-all"
                    />
                    <span className={`text-sm ${!formData.hasVehicle ? 'text-[var(--primary-accent)]' : 'text-white/60'} group-hover:text-[var(--primary-accent)] transition-colors`}>{t.no}</span>
                  </label>
                </div>

                <AnimatePresence>
                  {formData.hasVehicle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div ref={vehicleRef} className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-1">
                        <label className={labelClasses}>{t.vehicleModel}</label>
                        <input 
                          type="text" 
                          name="vehicleModel"
                          value={formData.vehicleModel}
                          onChange={handleChange}
                          className={inputClasses(!!errors.vehicleModel)}
                          placeholder={t.vehicleModelPlaceholder}
                          autoComplete="off"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className={labelClasses}>{t.vehiclePlate}</label>
                        <input 
                          type="text" 
                          name="vehiclePlate"
                          value={formData.vehiclePlate}
                          onChange={handleChange}
                          className={inputClasses(!!errors.vehiclePlate)}
                          placeholder={t.vehiclePlatePlaceholder}
                          autoComplete="off"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className={labelClasses}>{t.vehicleColor}</label>
                        <input 
                          type="text" 
                          name="vehicleColor"
                          value={formData.vehicleColor}
                          onChange={handleChange}
                          className={inputClasses(!!errors.vehicleColor)}
                          placeholder={t.vehicleColorPlaceholder}
                          autoComplete="off"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label className={labelClasses}>{t.vehicleExitTime}</label>
                        <input 
                          type="text" 
                          name="vehicleExitTime"
                          value={formData.vehicleExitTime}
                          onChange={handleChange}
                          className={inputClasses(false)} // No validation error for optional field
                          placeholder={t.vehicleExitTimePlaceholder}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Legal Compliance Layer */}
            <div className="pt-6 pb-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative pt-1">
                  <input 
                    type="checkbox"
                    checked={isLegalChecked}
                    onChange={(e) => setIsLegalChecked(e.target.checked)}
                    className="appearance-none w-5 h-5 border border-[var(--primary-accent)] rounded bg-transparent checked:bg-[var(--primary-accent)] transition-all"
                  />
                  {isLegalChecked && (
                    <svg className="absolute top-1 left-0 w-5 h-5 text-black pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] text-white/60 leading-tight text-justify select-none group-hover:text-white/80 transition-colors">
                  {t.legalTerm} <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-accent)] underline underline-offset-2 hover:text-white transition-colors">Termos & Condições</a>
                </span>
              </label>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button 
                onClick={handleSubmit}
                disabled={!isLegalChecked}
                className={`w-full font-bold py-4 rounded-lg tracking-wider uppercase transition-all duration-300 transform 
                  ${isLegalChecked 
                    ? 'bg-[var(--primary-accent)] text-black hover:brightness-110 shadow-[0_0_20px_var(--primary-accent)] hover:shadow-[0_0_30px_var(--primary-accent)] hover:-translate-y-1 active:translate-y-0' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'
                  }`}
              >
                {t.submitButton}
              </button>
          </div>

        </div>
      </motion.div>

      {/* Footer Custom Text */}
      <div className="relative z-10 mt-8 px-4 text-center space-y-2">
        {currentHotel.footerText && (
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-light">
            {currentHotel.footerText}
          </p>
        )}
        <p className="text-[var(--primary-accent)]/40 text-[9px] uppercase tracking-widest font-light whitespace-pre-line leading-relaxed max-w-2xl mx-auto">
          {t.footerStateless}
        </p>
      </div>
    </div>
  );
};

export default CheckInScreen;
