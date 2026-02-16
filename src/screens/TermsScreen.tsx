import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { DEFAULT_HOTEL } from '../data/hotel_config';

export const TermsScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md shadow-sm border-b border-white/5 px-4 py-4 flex items-center justify-between">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors group"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-gold-500/10 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium text-sm tracking-wide">VOLTAR</span>
                </button>
                <span className="font-bold text-gray-200 text-sm tracking-[0.2em] uppercase">TERMOS DE USO</span>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </header>

            <div className="flex-1 p-6 max-w-3xl mx-auto w-full relative z-10">
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-center mb-8">
                        <ShieldCheck size={48} className="text-gold-500 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
                    </div>

                    <h1 className="text-2xl font-bold text-center mb-2 text-white">Termos de Privacidade e Uso</h1>
                    <p className="text-center text-gray-400 text-sm mb-10">{DEFAULT_HOTEL.name}</p>

                    <div className="space-y-8 text-gray-300">
                        <section>
                            <h3 className="font-bold text-gold-500 mb-3 text-sm uppercase tracking-wide">1. Natureza do Serviço</h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                Esta plataforma atua exclusivamente como uma interface digital facilitadora ("middleware") para formatação e envio de dados via WhatsApp. 
                                Não operamos como banco de dados e não retemos informações pessoais em nossos servidores (Tecnologia Stateless).
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-gold-500 mb-3 text-sm uppercase tracking-wide">2. Responsabilidade Legal (FNRH)</h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                O preenchimento da Ficha Nacional de Registro de Hóspedes (FNRH) e sua submissão aos órgãos competentes (MTur) é de responsabilidade exclusiva da gestão do estabelecimento hoteleiro, 
                                conforme Lei nº 11.771/2008 e Decreto nº 7.381/2010.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-gold-500 mb-3 text-sm uppercase tracking-wide">3. Tratamento de Dados (LGPD)</h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                Ao utilizar este sistema, o usuário consente com o processamento temporário de seus dados exclusivamente para a geração do link de check-in. 
                                Nenhum dado é vendido, compartilhado ou armazenado pela Marketelli Software Solutions.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-gold-500 mb-3 text-sm uppercase tracking-wide">4. Disposições Gerais</h3>
                            <p className="text-sm leading-relaxed text-gray-400">
                                O uso desta ferramenta implica na aceitação integral destes termos. Em caso de dúvidas sobre o tratamento de seus dados pelo hotel, 
                                solicite a Política de Privacidade interna diretamente na recepção física.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
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
