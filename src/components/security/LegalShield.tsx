import React from 'react';

interface LegalShieldProps {
    isChecked: boolean;
    onChange: (checked: boolean) => void;
}

export const LegalShield: React.FC<LegalShieldProps> = ({ isChecked, onChange }) => {
    return (
        <div className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/10 mt-8 transition-colors hover:bg-white/[0.07]">
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    id="legal-check"
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer w-5 h-5 appearance-none rounded border border-white/30 bg-black/20 checked:bg-gold-500 checked:border-gold-500 focus:ring-2 focus:ring-gold-500/30 cursor-pointer transition-all"
                />
                <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <label htmlFor="legal-check" className="text-xs text-gray-400 cursor-pointer leading-relaxed select-none">
                Concordo que esta interface é uma ferramenta facilitadora de envio. Reconheço que a 
                <span className="font-bold text-gold-500"> Marketelli </span> 
                não possui vínculo governamental e não armazena meus dados.
            </label>
        </div>
    );
};

export const LegalFooter: React.FC = () => {
    return (
        <div className="mt-12 text-center opacity-60 hover:opacity-100 transition-opacity duration-300 relative z-10">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Tecnologia Stateless (Sem Armazenamento)
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
                A responsabilidade pelo envio à FNRH (Lei 11.771/2008) é exclusiva do Estabelecimento.
            </p>
            <a 
                href="mailto:atendimento@marketelli.com" 
                className="text-[10px] text-gold-500/80 hover:text-gold-400 mt-2 block font-medium transition-colors"
            >
                Suporte: atendimento@marketelli.com
            </a>
        </div>
    );
};
