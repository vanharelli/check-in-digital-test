import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DEFAULT_HOTEL } from '../data/hotel_config';
import { useLanguage } from '../context/LanguageContext';

export const TermsScreen: React.FC = () => {
    const { language } = useLanguage();
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col bg-transparent pt-[env(safe-area-inset-top,1rem)] pb-[env(safe-area-inset-bottom,1rem)]">
            <div className="flex-1 p-6 max-w-3xl mx-auto w-full relative z-10">
                <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-orange-500 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                    <div className="mb-6">
                        <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors group"
                        >
                            <div className="p-2 rounded-full bg-white/5 group-hover:bg-orange-500/10 transition-colors">
                                <ArrowLeft size={20} />
                            </div>
                            <span className="font-medium text-sm tracking-wide">VOLTAR</span>
                        </button>
                    </div>
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/30 blur-xl animate-ping" />
                            <img
                                src="/marketellilogo.png"
                                alt="Marketelli"
                                className="relative h-12 w-auto drop-shadow-[0_0_24px_rgba(0,0,0,0.9)]"
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-2 text-white">
                        {language === 'PT' && 'Termos de Privacidade e Uso'}
                        {language === 'EN' && 'Privacy and Usage Terms'}
                        {language === 'ES' && 'Términos de Privacidad y Uso'}
                    </h1>
                    <p className="text-center text-gray-400 text-sm mb-10">{DEFAULT_HOTEL.name}</p>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h3 className="font-bold text-orange-500 mb-3 text-sm uppercase tracking-wide">
                                {language === 'PT' && '1. Natureza do Serviço'}
                                {language === 'EN' && '1. Nature of the Service'}
                                {language === 'ES' && '1. Naturaleza del Servicio'}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                {language === 'PT' &&
                                    'Esta plataforma atua exclusivamente como uma interface digital facilitadora ("middleware") para formatação e envio de dados via WhatsApp. Não operamos como banco de dados e não retemos informações pessoais em nossos servidores (Tecnologia Stateless).'}
                                {language === 'EN' &&
                                    'This platform acts exclusively as a digital facilitating interface ("middleware") for formatting and sending data via WhatsApp. We do not operate as a database and we do not retain personal information on our servers (Stateless Technology).'}
                                {language === 'ES' &&
                                    'Esta plataforma actúa exclusivamente como una interfaz digital facilitadora ("middleware") para formatear y enviar datos vía WhatsApp. No operamos como base de datos y no retenemos información personal en nuestros servidores (Tecnología Stateless).'}
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-orange-500 mb-3 text-sm uppercase tracking-wide">
                                {language === 'PT' && '2. Responsabilidade Legal (FNRH)'}
                                {language === 'EN' && '2. Legal Responsibility (FNRH)'}
                                {language === 'ES' && '2. Responsabilidad Legal (FNRH)'}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                {language === 'PT' &&
                                    'O preenchimento da Ficha Nacional de Registro de Hóspedes (FNRH) e sua submissão aos órgãos competentes (MTur) é de responsabilidade exclusiva da gestão do estabelecimento hoteleiro, conforme Lei nº 11.771/2008 e Decreto nº 7.381/2010.'}
                                {language === 'EN' &&
                                    'Completing the National Guest Registration Form (FNRH) and submitting it to the competent authorities (MTur) is the exclusive responsibility of the hotel management, in accordance with Law No. 11.771/2008 and Decree No. 7.381/2010.'}
                                {language === 'ES' &&
                                    'El llenado de la Ficha Nacional de Registro de Huéspedes (FNRH) y su envío a los órganos competentes (MTur) es responsabilidad exclusiva de la administración del establecimiento hotelero, conforme a la Ley Nº 11.771/2008 y el Decreto Nº 7.381/2010.'}
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-orange-500 mb-3 text-sm uppercase tracking-wide">
                                {language === 'PT' && '3. Tratamento de Dados (LGPD)'}
                                {language === 'EN' && '3. Data Processing (LGPD)'}
                                {language === 'ES' && '3. Tratamiento de Datos (LGPD)'}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                {language === 'PT' &&
                                    'Ao utilizar este sistema, o usuário consente com o processamento temporário de seus dados exclusivamente para a geração do link de check-in. Nenhum dado é vendido, compartilhado ou armazenado pela Marketelli Software Solutions.'}
                                {language === 'EN' &&
                                    'By using this system, the user consents to the temporary processing of their data exclusively for generating the check-in link. No data is sold, shared, or stored by Marketelli Software Solutions.'}
                                {language === 'ES' &&
                                    'Al utilizar este sistema, el usuario consiente el procesamiento temporal de sus datos exclusivamente para la generación del enlace de check-in. Ningún dato es vendido, compartido o almacenado por Marketelli Software Solutions.'}
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-orange-500 mb-3 text-sm uppercase tracking-wide">
                                {language === 'PT' && '4. Disposições Gerais'}
                                {language === 'EN' && '4. General Provisions'}
                                {language === 'ES' && '4. Disposiciones Generales'}
                            </h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                {language === 'PT' &&
                                    'O uso desta ferramenta implica na aceitação integral destes termos. Em caso de dúvidas sobre o tratamento de seus dados pelo hotel, solicite a Política de Privacidade interna diretamente na recepção física.'}
                                {language === 'EN' &&
                                    'Use of this tool implies full acceptance of these terms. In case of questions about how your data is handled by the hotel, request the internal Privacy Policy directly at the physical reception.'}
                                {language === 'ES' &&
                                    'El uso de esta herramienta implica la aceptación total de estos términos. En caso de dudas sobre el tratamiento de sus datos por parte del hotel, solicite la Política de Privacidad interna directamente en la recepción física.'}
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-orange-500/70 text-center">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                            Atualizado em: Fevereiro de 2026<br/>
                            Marketelli Software Solutions
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
