import React, { useState, useRef } from 'react';
import { User, MapPin, Phone, Car } from 'lucide-react';
import { IMaskInput } from 'react-imask';
// import { useGuest } from '../context/GuestContext'; // REMOVED
import { DEFAULT_HOTEL } from '../data/hotel_config';
import { fetchAddress } from '../logic/api/viacep';
import { generateWhatsAppPayload } from '../logic/generators/vcard';
import { LegalShield, LegalFooter } from '../components/security/LegalShield';
import { Link } from 'react-router-dom';

export const CheckInScreen: React.FC = () => {
    // const { setGuestData } = useGuest(); // REMOVED: Context Dependency
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;



        // Zero-latency Address Fetch
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

        // 1. Generate WhatsApp Link
        const payload = generateWhatsAppPayload(formData);
        const whatsappUrl = `https://wa.me/${DEFAULT_HOTEL.whatsapp}?text=${encodeURIComponent(payload)}`;

        // 2. Save Context & Unlock Pillar 2 (Atomic)
        // setGuestData(formData.fullName, formData.roomNumber); // REMOVED
        // localStorage.setItem('unlockedPilar2', 'true'); // REMOVED
        // window.dispatchEvent(new Event('storage')); // Sync across tabs/windows // REMOVED

        // 3. Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // 4. Wipe Data (Stateless)
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

    const inputClasses = "w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none transition-all uppercase backdrop-blur-sm";
    const labelClasses = "block text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider";

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-transparent">
            
            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <h1 className="text-2xl font-bold text-white uppercase tracking-[0.2em] mb-2 drop-shadow-lg">
                    FICHA DE CHECK-IN
                </h1>
                <p className="text-gold-500 font-medium tracking-wide text-sm opacity-90">{DEFAULT_HOTEL.subtitle}</p>
            </div>

            {/* Glassmorphism Card */}
            <div className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 border-t border-white/10 backdrop-blur-xl bg-black/40 relative z-10">
                
                {/* Personal Info */}
                <div className="space-y-6 mb-8">
                    <h2 className="flex items-center gap-3 text-lg font-bold text-white/90 border-b border-white/10 pb-3">
                        <User className="text-gold-500" size={20} />
                        Dados Pessoais
                    </h2>

                    <div>
                        <label className={labelClasses}>Nome Completo</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="DIGITE SEU NOME"
                            className={inputClasses}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>É Estrangeiro?</label>
                            <select
                                name="isForeigner"
                                value={formData.isForeigner ? 'yes' : 'no'}
                                onChange={(e) => setFormData(prev => ({ ...prev, isForeigner: e.target.value === 'yes' }))}
                                className={inputClasses}
                            >
                                <option value="no" className="bg-gray-900 text-white">NÃO</option>
                                <option value="yes" className="bg-gray-900 text-white">SIM</option>
                            </select>
                        </div>
                        {formData.isForeigner ? (
                             <div>
                                <label className={labelClasses}>País de Origem</label>
                                <input
                                    name="passportCountry"
                                    value={formData.passportCountry}
                                    onChange={handleChange}
                                    placeholder="PAÍS"
                                    className={inputClasses}
                                />
                            </div>
                        ) : (
                            <div>
                                <label className={labelClasses}>CPF</label>
                                <IMaskInput
                                    mask="000.000.000-00"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                    className={inputClasses}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-6 mb-8">
                    <h2 className="flex items-center gap-3 text-lg font-bold text-white/90 border-b border-white/10 pb-3">
                        <MapPin className="text-gold-500" size={20} />
                        Endereço
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className={labelClasses}>CEP</label>
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
                            <label className={labelClasses}>Cidade / Estado</label>
                            <input
                                value={`${formData.city} ${formData.state ? '/' + formData.state : ''}`}
                                readOnly
                                className={`${inputClasses} opacity-70 cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className={labelClasses}>Endereço</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="RUA / AVENIDA"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Número</label>
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
                        <Phone className="text-gold-500" size={20} />
                        Contato & Estadia
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className={labelClasses}>WhatsApp</label>
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
                            <label className={labelClasses}>Nº Quarto (Opcional)</label>
                            <input
                                name="roomNumber"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                placeholder="101"
                                className={inputClasses}
                            />
                        </div>
                    </div>
                     <div>
                        <label className={labelClasses}>E-mail</label>
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
                            <Car className="text-gold-500" size={20} />
                            Vai usar o estabelecimento?
                        </h2>
                        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wide cursor-pointer select-none" htmlFor="hasVehicle">
                                 POSSUI VEÍCULO?
                             </label>
                             <input 
                                id="hasVehicle"
                                type="checkbox"
                                checked={formData.hasVehicle}
                                onChange={(e) => setFormData(prev => ({ ...prev, hasVehicle: e.target.checked }))}
                                className="w-4 h-4 text-gold-500 rounded bg-white/10 border-white/20 focus:ring-offset-black focus:ring-gold-500 cursor-pointer"
                             />
                        </div>
                    </div>

                    {formData.hasVehicle && (
                        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                            <input
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                placeholder="MODELO"
                                className={inputClasses}
                            />
                            <input
                                name="vehicleColor"
                                value={formData.vehicleColor}
                                onChange={handleChange}
                                placeholder="COR"
                                className={inputClasses}
                            />
                            <input
                                name="vehiclePlate"
                                value={formData.vehiclePlate}
                                onChange={handleChange}
                                placeholder="PLACA"
                                className={inputClasses}
                            />
                             <IMaskInput
                                mask="00:00"
                                name="vehicleExitTime"
                                value={formData.vehicleExitTime}
                                onChange={handleChange}
                                placeholder="SAÍDA (HH:MM)"
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
                            ? 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transform hover:-translate-y-0.5' 
                            : 'bg-white/10 text-gray-500 cursor-not-allowed border-white/5'}
                    `}
                >
                    VALIDAR ACESSO
                </button>

                <div className="mt-6 text-center">
                    <Link to="/termos" className="text-xs text-gold-500/80 hover:text-gold-400 hover:underline tracking-wide transition-colors">
                        Ver Termos de Uso Completos
                    </Link>
                </div>

            </div>

            <LegalFooter />

            {/* Admin Color Picker Modal */}
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
        </div>
    );
};
