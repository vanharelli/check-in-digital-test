import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, ServerOff } from 'lucide-react';

const TermsScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Robust Back Logic:
    // 1. Try browser history if available (preserves form state in previous page)
    // 2. Fallback to default check-in route if opened directly or in new tab
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pt-24 flex flex-col items-center font-sans relative">
      {/* Sticky Header Back Button */}
      <div className="fixed top-0 left-0 w-full p-6 z-50 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
        <button 
          onClick={handleBack}
          className="pointer-events-auto flex items-center gap-3 text-[var(--primary)] hover:text-white transition-colors uppercase tracking-widest text-xs font-bold group bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <div className="p-1 rounded-full border border-[var(--primary)]/30 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-black transition-all">
            <ArrowLeft size={14} />
          </div>
          <span>Voltar para Ficha</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <ShieldCheck size={48} className="text-[var(--primary)] mb-4 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
          <h1 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">
            Termos de Uso & Privacidade
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-wider">
            Protocolo de Segurança e Isenção de Responsabilidade
          </p>
        </div>
        
        <div className="space-y-8 text-gray-300 leading-relaxed text-sm text-justify relative z-10">
          
          {/* CLÁUSULA DE BLOQUEIO (HIGHLIGHT) */}
          <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border-l-4 border-[var(--primary)] rounded-r-lg">
            <div className="flex items-center gap-2 mb-3">
              <ServerOff size={18} className="text-[var(--primary)]" />
              <h2 className="text-[var(--primary)] font-bold uppercase tracking-wider text-xs">
                1. Arquitetura "Stateless" (Sem Armazenamento)
              </h2>
            </div>
            <p className="font-medium text-white/90 italic">
              "Esta plataforma opera sob a arquitetura de Processamento Volátil. A desenvolvedora fornece exclusivamente a infraestrutura de interface (Front-End) para padronização de dados. O usuário reconhece e aceita que <strong>nenhum dado inserido é armazenado, arquivado ou processado em servidores da desenvolvedora</strong>. O sistema funciona como um túnel de passagem segura, formatando as informações para envio direto."
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock size={16} className="text-gray-400" />
              <h3 className="text-white font-bold uppercase text-xs tracking-wide">
                2. Transmissão e Criptografia
              </h3>
            </div>
            <p>
              A transmissão dos dados ocorre através do protocolo de redirecionamento direto para o aplicativo WhatsApp®. A partir do momento em que o usuário clica em "VALIDAR ACESSO", a segurança, criptografia (Ponta-a-Ponta) e a guarda das informações passam a ser regidas pelos Termos de Uso da Meta Platforms, Inc. e do Estabelecimento Hoteleiro destinatário.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-wide mb-2">
              3. Conformidade LGPD (Lei 13.709/2018)
            </h3>
            <p className="mb-2">
              Em estrita conformidade com a Lei Geral de Proteção de Dados, declaramos:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-400">
              <li><strong>Não-Coleta:</strong> A desenvolvedora não atua como "Controladora" nem "Operadora" de dados.</li>
              <li><strong>Não-Rastreamento:</strong> Não utilizamos cookies de rastreamento persistente ou análise comportamental.</li>
              <li><strong>Direito de Esquecimento:</strong> Como não há banco de dados, o "esquecimento" é nativo e imediato após o fechamento da aba.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-wide mb-2">
              4. Responsabilidade e Veracidade
            </h3>
            <p>
              A responsabilidade pela veracidade, atualização e precisão dos dados (incluindo documentos e placas de veículos) é exclusiva do usuário declarante. A Marketelli isenta-se de qualquer responsabilidade civil ou criminal referente ao uso indevido desta ferramenta para falsidade ideológica ou envio de dados a terceiros não autorizados.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Marketelli Tecnologia & Inteligência © 2026 - Todos os direitos reservados.
              <br />
              Este software não possui vínculo com órgãos governamentais.
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default TermsScreen;