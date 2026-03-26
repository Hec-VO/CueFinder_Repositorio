import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Lock, ArrowRight, HelpCircle } from 'lucide-react';
import HelpModal from './HelpModal';

interface Props {
  onRegister: (user: { name: string; age: number; registeredAt: string }) => void;
}

export default function RegistrationScreen({ onRegister }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '012345') {
      setError('Código incorrecto');
      return;
    }
    if (!name || !age) {
      setError('Por favor completa todos los campos');
      return;
    }
    onRegister({
      name,
      age: parseInt(age),
      registeredAt: new Date().toISOString(),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col bg-stone-50 p-6 relative"
    >
      <button 
        onClick={() => setIsHelpOpen(true)}
        className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors z-10"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200 rotate-3">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2 uppercase">CueFinder</h1>
          <p className="text-stone-500 font-bold text-lg">Tu acompañamiento terapéutico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-stone-400 uppercase tracking-widest ml-1">Nombre</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-stone-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:outline-none transition-all font-bold text-stone-800"
                placeholder="Tu nombre completo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-stone-400 uppercase tracking-widest ml-1">Edad</label>
            <div className="relative">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-white border-2 border-stone-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:outline-none transition-all font-bold text-stone-800"
                placeholder="Tu edad"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-stone-400 uppercase tracking-widest ml-1">Código del Psicólogo</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="password"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                className="w-full bg-white border-2 border-stone-100 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 focus:outline-none transition-all font-bold text-stone-800 tracking-widest"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center font-black uppercase text-xs tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            Siguiente
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Registro Inicial"
        content="¡Hola! Para comenzar, necesitamos conocerte un poco. Ingresa tu nombre, tu edad y el código que te proporcionó tu psicólogo. Esto nos ayuda a personalizar tu experiencia y asegurar que estás bajo supervisión profesional."
      />
    </motion.div>
  );
}

function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
