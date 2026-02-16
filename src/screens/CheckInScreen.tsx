import React, { useState, useRef, useEffect } from 'react';
import { User, MapPin, Phone, Car } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { DEFAULT_HOTEL } from '../data/hotel_config';
import { fetchAddress } from '../logic/api/viacep';
import { generateWhatsAppPayload } from '../logic/generators/vcard';
import { LegalShield, LegalFooter } from '../components/security/LegalShield';
import { Link } from 'react-router-dom';
import { translations } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';

export const CheckInScreen: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const t = translations[language];

    const [loadingAddress, setLoadingAddress] = useState(false);
    const numberInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
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
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('24:00:00');
    const [showLicenseModal, setShowLicenseModal] = useState(false);

    useEffect(() => {
        const createdAt = localStorage.getItem('demo_created_at');
        let startTime: number;

        if (createdAt) {
            startTime = new Date(createdAt).getTime();
        } else {
            startTime = Date.now();
            localStorage.setItem('demo_created_at', new Date(startTime).toISOString());
        }

        const endTime = startTime + 24 * 60 * 60 * 1000;

        const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft('00:00:00');
                setShowLicenseModal(true);
                return false;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${seconds.toString().padStart(2, '0')}`
            );
            return true;
        };

        updateTimer();
        const interval = setInterval(() => {
            const keep = updateTimer();
            if (!keep) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'zipCode') {
            const cleanZip = value.replace(/\D/g, '');
            if (cleanZip.length === 8) {
                handleFetchAddress(cleanZip);
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchAddress = async (cep: string) => {
        setLoadingAddress(true);
        const address = await fetchAddress(cep);
        setLoadingAddress(false);

        if (address) {
            setFormData(prev => ({
                ...prev,
                address: address.logradouro,
                city: address.localidade,
                state: address.uf
            }));
            numberInputRef.current?.focus();
        }
    };

    const handleSubmit = () => {
        if (!isLegalChecked) {
            alert('Por favor, aceite os termos legais para continuar.');
            return;
        }

        const payload = generateWhatsAppPayload(formData);
        const whatsappUrl = `https://wa.me/${DEFAULT_HOTEL.whatsapp}?text=${encodeURIComponent(payload)}`;

        window.open(whatsappUrl, '_blank');

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

    const getTimerColorClass = () => {
        const [hoursStr] = timeLeft.split(':');
        const hours = parseInt(hoursStr, 10);

        if (Number.isNaN(hours)) {
            return 'text-white';
        }

        if (hours >= 15) {
            return 'text-green-400';
        }

        if (hours > 6) {
            return 'text-orange-400';
        }

        return 'text-red-500';
    };

    const inputClasses =
        "w-full p-3 bg-transparent border border-white/10 rounded-xl text-white placeholder-white " +
        "focus:ring-2 focus:ring-[#f97316]/70 focus:border-[#f97316] outline-none transition-all uppercase " +
        "backdrop-blur-xl shadow-[0_0_18px_rgba(0,0,0,0.8)]";
    const labelClasses =
        "block text-xs font-bold text-white uppercase mb-1 tracking-wider";

    return (
        <div className="min-h-[100dvh] flex flex-col items-center px-4 py-10 bg-transparent pt-[env(safe-area-inset-top,1.5rem)] pb-[env(safe-area-inset-bottom,1.5rem)]">
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-30 w-full px-4 pointer-events-none">
                <div className="w-full max-w-2xl mx-auto relative pointer-events-auto">
                    <div className="flex items-center justify-between bg-black/70 border border-orange-500 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-300 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                        <span className="animate-giggle font-bold shiny-text-purple">{t.trialMode}</span>
                        <span className={`font-mono ${getTimerColorClass()}`}>{timeLeft}</span>
                    </div>
                </div>
            </div>
            <div className="text-center mt-16 mb-8 relative z-10">
                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 rounded-full bg-[#8B5CF6] opacity-30 blur-xl animate-ping" />
                    <a
                        href="https://instagram.com/marketelli_"
                        target="_blank"
                        rel="noreferrer"
                        className="relative block"
                    >
                        <img
                            src="/marketellilogo.png"
                            alt="Marketelli"
                            className="mx-auto h-12 w-auto drop-shadow-[0_0_24px_rgba(0,0,0,0.9)]"
                        />
                    </a>
                </div>
                <p className="text-white text-xs tracking-wide uppercase opacity-80 mb-1">
                    {language === 'PT' && 'SOLUÇÕES, RESULTADOS E TECNOLOGIA'}
                    {language === 'EN' && 'SOLUTIONS, RESULTS AND TECHNOLOGY'}
                    {language === 'ES' && 'SOLUCIONES, RESULTADOS Y TECNOLOGÍA'}
                </p>
                <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-1 drop-shadow-lg">
                    CHECK-IN DIGITAL
                </h1>
                <p className="text-white font-medium tracking-wide text-[11px] opacity-90 leading-relaxed">
                    {language === 'PT' && (
                        <>
                            Realize agora uma simulação de cadastro (não utilize dados pessoais reais).<br />
                            Basta preencher o formulário abaixo e finalizar para validar o envio da mensagem automática via WhatsApp.
                        </>
                    )}
                    {language === 'EN' && (
                        <>
                            Perform now a simulation (do not use real personal data).<br />
                            Just fill in the form below and finish to validate the automatic WhatsApp message.
                        </>
                    )}
                    {language === 'ES' && (
                        <>
                            Realice ahora una simulación de registro (no use datos personales reales).<br />
                            Simplemente complete el formulario abajo y finalice para validar el envío automático por WhatsApp.
                        </>
                    )}
                </p>
            </div>

            <div className="w-full max-w-2xl rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9)] p-8 border border-white/10 backdrop-blur-xl bg-black/80 relative z-10">
                <div className="flex justify-end mb-4 text-lg gap-3">
                    <button type="button" onClick={() => setLanguage('PT')}>🇧🇷</button>
                    <button type="button" onClick={() => setLanguage('EN')}>🇺🇸</button>
                    <button type="button" onClick={() => setLanguage('ES')}>🇪🇸</button>
                </div>
                <div className="space-y-6 mb-8">
                    <h2 className="flex items-center gap-3 text-lg font-bold text-white/90 border-b border-white/10 pb-3">
                        <User className="text-orange-500" size={20} />
                        {language === 'PT' && 'Dados Pessoais'}
                        {language === 'EN' && 'Personal Data'}
                        {language === 'ES' && 'Datos Personales'}
                    </h2>

                    <div>
                        <label className={labelClasses}>{t.fullName}</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="DIGITE SEU NOME"
                            className={inputClasses}
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className={labelClasses}>{t.isForeigner}</label>
                            <div className="flex gap-2 mt-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(prev => ({ ...prev, isForeigner: false }))
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${
                                        !formData.isForeigner
                                            ? 'bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                                            : 'bg-white/5 text-gray-400'
                                    }`}
                                >
                                    {t.no}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(prev => ({ ...prev, isForeigner: true }))
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${
                                        formData.isForeigner
                                            ? 'bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                                            : 'bg-white/5 text-gray-400'
                                    }`}
                                >
                                    {t.yes}
                                </button>
                            </div>
                        </div>

                        {formData.isForeigner ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>{t.country}</label>
                                    <input
                                        name="passportCountry"
                                        value={formData.passportCountry}
                                        onChange={handleChange}
                                        placeholder={t.countryPlaceholder}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>{t.passport}</label>
                                    <input
                                        name="passportId"
                                        value={formData.passportId}
                                        onChange={handleChange}
                                        placeholder={t.passportPlaceholder}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className={labelClasses}>{t.cpf}</label>
                                <IMaskInput
                                    mask="000.000.000-00"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder={t.cpf}
                                    className={inputClasses}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-6 mb-8">
                    <h2 className="flex items-center gap-3 text-lg font-bold text-white/90 border-b border-white/10 pb-3">
                        <MapPin className="text-orange-500" size={20} />
                        {language === 'PT' && 'Endereço'}
                        {language === 'EN' && 'Address'}
                        {language === 'ES' && 'Dirección'}
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className={labelClasses}>{t.zipCode}</label>
                            <IMaskInput
                                mask="00000-000"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                placeholder="00000-000"
                                className={`${inputClasses} ${loadingAddress ? 'animate-pulse bg-white/10' : ''}`}
                            />
                        </div>
                        <div className="col-span-2">
                            <label className={labelClasses}>
                                {language === 'PT' && 'Cidade / Estado'}
                                {language === 'EN' && 'City / State'}
                                {language === 'ES' && 'Ciudad / Estado'}
                            </label>
                            <input
                                value={`${formData.city} ${formData.state ? '/' + formData.state : ''}`}
                                readOnly
                                className={`${inputClasses} opacity-70 cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className={labelClasses}>{t.address}</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="RUA / AVENIDA"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>{t.number}</label>
                            <input
                                ref={numberInputRef}
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                placeholder="Nº"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-6 mb-8">
                    <h2 className="flex items-center gap-3 text-lg font-bold text-white/90 border-b border-white/10 pb-3">
                        <Phone className="text-orange-500" size={20} />
                        {language === 'PT' && 'Contato & Estadia'}
                        {language === 'EN' && 'Contact & Stay'}
                        {language === 'ES' && 'Contacto & Estancia'}
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className={labelClasses}>{t.phone}</label>
                            <IMaskInput
                                mask="(00) 00000-0000"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>{t.roomNumber}</label>
                            <input
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                placeholder="101 (Opcional)"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                     <div>
                        <label className={labelClasses}>{t.email}</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            className={inputClasses}
                        />
                    </div>
                </div>

                 {/* Vehicle */}
                 <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h2 className="flex items-center gap-3 text-lg font-bold text-white/90">
                            <Car className="text-orange-500" size={20} />
                            {t.hasVehicle}
                        </h2>
                        <div className="flex items-center gap-3 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xl">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(prev => ({ ...prev, hasVehicle: false }))
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${
                                        !formData.hasVehicle
                                            ? 'bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                                            : 'bg-white/5 text-gray-400'
                                    }`}
                                >
                                    {t.no}
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(prev => ({ ...prev, hasVehicle: true }))
                                    }
                                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${
                                        formData.hasVehicle
                                            ? 'bg-orange-500 text-black shadow-[0_0_18px_rgba(249,115,22,0.5)]'
                                            : 'bg-white/5 text-gray-400'
                                    }`}
                                >
                                    {t.yes}
                                </button>
                            </div>
                        </div>
                    </div>

                    {formData.hasVehicle && (
                        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                            <input
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                placeholder={t.vehicleModelPlaceholder}
                                className={inputClasses}
                            />
                            <input
                                name="vehicleColor"
                                value={formData.vehicleColor}
                                onChange={handleChange}
                                placeholder={t.vehicleColorPlaceholder}
                                className={inputClasses}
                            />
                            <input
                                name="vehiclePlate"
                                value={formData.vehiclePlate}
                                onChange={handleChange}
                                placeholder={t.vehiclePlatePlaceholder}
                                className={inputClasses}
                            />
                             <IMaskInput
                                mask="00:00"
                                name="vehicleExitTime"
                                value={formData.vehicleExitTime}
                                onChange={handleChange}
                                placeholder={t.vehicleExitTimePlaceholder}
                                className={inputClasses}
                            />
                        </div>
                    )}
                </div>

                <LegalShield isChecked={isLegalChecked} onChange={setIsLegalChecked} />

                <button
                    onClick={handleSubmit}
                    disabled={!isLegalChecked}
                    className={`w-full mt-8 py-4 rounded-xl font-bold text-white tracking-[0.2em] transition-all duration-300 border border-transparent
                        ${isLegalChecked 
                            ? 'bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transform hover:-translate-y-0.5' 
                            : 'bg-white/10 text-gray-500 cursor-not-allowed border-white/5'}
                    `}
                >
                    FAZER CHECK-IN
                </button>

                <div className="mt-6 text-center">
                    <Link to="/termos" className="text-xs text-orange-400/90 hover:text-orange-300 hover:underline tracking-wide transition-colors">
                        Ver Termos de Uso Completos
                    </Link>
                </div>

            </div>

            <LegalFooter />

            {showColorPicker && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-80 text-center border border-white/10 shadow-2xl">
                        <h3 className="font-bold text-lg mb-2 text-white">ADMIN COLOR PICKER</h3>
                        <p className="text-xs text-gray-400 mb-6">Selecione a cor primária do tema</p>
                        <input 
                            type="color" 
                            className="w-full h-12 cursor-pointer mb-6 rounded-lg border-2 border-white/10 bg-transparent"
                            onChange={(e) => {
                                document.documentElement.style.setProperty('--primary-accent', e.target.value);
                            }} 
                        />
                        <button 
                            onClick={() => setShowColorPicker(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-colors border border-white/5"
                        >
                            FECHAR PAINEL
                        </button>
                    </div>
                </div>
            )}

            {showLicenseModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-80 text-center shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                        <h2 className="text-white text-lg font-bold uppercase tracking-[0.2em] mb-4">
                            DEMONSTRAÇÃO ENCERRADA
                        </h2>
                        <p className="text-sm text-gray-300 mb-6">
                            Quer ter acesso à licença da ficha cadastral?
                        </p>
                        <button
                            onClick={() => {
                                const message = 'Quero a licença do check-in digital!';
                                const url = `https://wa.me/5561982062229?text=${encodeURIComponent(message)}`;
                                window.open(url, '_blank');
                            }}
                            className="w-full py-3 rounded-xl bg-[#25c522ff] text-black font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_24px_rgba(37,197,34,0.8)] hover:brightness-110 transition-all"
                        >
                            Quero a licença
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
