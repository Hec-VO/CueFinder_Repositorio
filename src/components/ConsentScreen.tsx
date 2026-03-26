import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';
import HelpModal from './HelpModal';

interface Props {
  onAccept: () => void;
  onReject: () => void;
}

export default function ConsentScreen({ onAccept, onReject }: Props) {
  const [checks, setChecks] = useState({
    informed: false,
    privacy: false,
    arco: false,
    terms: false,
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const allChecked = Object.values(checks).every(Boolean);

  const handleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-stone-50 relative"
    >
      <button 
        onClick={() => setIsHelpOpen(true)}
        className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors z-10"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <div className="flex-1 p-8 pt-12 overflow-y-auto">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-50 rotate-3">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2 uppercase">Tu Privacidad</h1>
          <p className="text-stone-500 font-bold text-lg">Es lo más importante para nosotros</p>
        </div>

        <div className="space-y-6 mb-12">
          <ConsentItem 
            checked={checks.informed}
            onChange={() => handleCheck('informed')}
            title="Consentimiento Informado"
            desc="Entiendo que esta aplicación es un apoyo terapéutico. Mi información se usará para ayudarme a dejar de fumar bajo supervisión profesional (Norma APA 3.10)."
          />
          <ConsentItem 
            checked={checks.privacy}
            onChange={() => handleCheck('privacy')}
            title="Aviso de Privacidad"
            desc="Acepto que mis datos personales sean tratados con total secreto. Seguimos las reglas éticas de la APA (Normas 4.01 y 4.02)."
          />
          <ConsentItem 
            checked={checks.arco}
            onChange={() => handleCheck('arco')}
            title="Tus Derechos (ARCO)"
            desc="Sé que puedo ver, corregir, borrar o pedir que no usen mis datos. Esto es según la Ley Federal de Protección de Datos en México."
          />
          <ConsentItem 
            checked={checks.terms}
            onChange={() => handleCheck('terms')}
            title="Términos y Condiciones"
            desc="He leído y acepto las reglas de uso de CueFinder para mi bienestar y seguridad."
          />
        </div>

        <div className="space-y-4 pb-12">
          <a
            href="https://github.com/X1me-Gar/CueFinder/blob/b4c1fdfd942aa4f25df54efa6f023b3cf1ff677b/T%C3%A9rminos%20y%20Condiciones/T%C3%A9rminos_y_Condiciones_CueFinder.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 bg-white text-stone-600 font-black py-5 rounded-3xl shadow-lg border-2 border-stone-100 hover:bg-stone-50 transition-all uppercase tracking-widest text-xs"
          >
            Términos y Condiciones Completos
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onAccept}
            disabled={!allChecked}
            className={`w-full font-black py-6 rounded-3xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl ${
              allChecked 
                ? 'bg-blue-600 text-white shadow-blue-100 active:scale-95' 
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            Continuar
            <ArrowRight className="w-6 h-6" />
          </button>

          <button
            onClick={onReject}
            className="w-full flex items-center justify-center gap-3 text-red-500 font-black py-4 hover:bg-red-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
          >
            <AlertCircle className="w-4 h-4" />
            Rechazo estos términos y condiciones
          </button>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Consentimiento"
        content="Para protegerte, necesitamos que aceptes cómo manejamos tus datos. Esto incluye tu derecho a saber qué información guardamos y a pedir que la borremos en cualquier momento. Lee cada punto y marca la casilla si estás de acuerdo."
      />
    </motion.div>
  );
}

function ConsentItem({ checked, onChange, title, desc }: { checked: boolean; onChange: () => void; title: string; desc: string }) {
  return (
    <button 
      onClick={onChange}
      className={`w-full p-6 rounded-[2rem] border-2 transition-all text-left flex gap-5 items-start ${
        checked ? 'bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-50' : 'bg-white border-stone-100'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
        checked ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-300'
      }`}>
        {checked && <ShieldCheck className="w-5 h-5" />}
      </div>
      <div>
        <h3 className={`font-black uppercase tracking-widest text-xs mb-2 ${checked ? 'text-emerald-900' : 'text-stone-400'}`}>
          {title}
        </h3>
        <p className={`text-sm font-bold leading-relaxed ${checked ? 'text-emerald-700' : 'text-stone-500'}`}>
          {desc}
        </p>
      </div>
    </button>
  );
}
