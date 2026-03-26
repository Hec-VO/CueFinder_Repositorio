import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Activity, 
  FlameKindling, 
  Brain, 
  BarChart3, 
  FileText, 
  Phone, 
  Trash2, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { AppState } from '../types';
import HelpModal from './HelpModal';

interface Props {
  appState: AppState;
  onNavigate: (screen: any) => void;
  onWithdrawConsent: () => void;
}

export default function DashboardScreen({ appState, onNavigate, onWithdrawConsent }: Props) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleEmergency = () => {
    window.location.href = 'tel:8009112000';
  };

  const triggerCounts: Record<string, number> = {};
  appState.cravingLogs.forEach(log => {
    log.triggers.forEach(t => {
      const normalized = t.toLowerCase().trim();
      triggerCounts[normalized] = (triggerCounts[normalized] || 0) + 1;
    });
  });

  const topTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col bg-stone-50 relative"
    >
      <button 
        onClick={() => setIsHelpOpen(true)}
        className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors z-10"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      <div className="p-8 pt-12">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase mb-2">
          ¡Hola, {appState.user?.name}!
        </h1>
        <p className="text-stone-500 font-bold text-lg">Un día a la vez.</p>
      </div>

      <div className="px-8 space-y-8 pb-12">
        {/* Racha */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-[2.5rem] shadow-xl shadow-orange-200 flex items-center justify-between text-white overflow-hidden relative group">
          <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
            <Flame className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Tu racha de actividad</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{appState.streak}</span>
              <span className="text-xl font-bold">Días</span>
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md">
            <Flame className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Pizarra de Triggers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-stone-800 uppercase tracking-tight flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              Tus Disparadores
            </h2>
          </div>
          <div className="bg-[#d2b48c] rounded-[2rem] p-6 shadow-xl border-[8px] border-[#8b4513] relative overflow-hidden min-h-[180px]">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '4px 4px' }}></div>
            
            {topTriggers.length === 0 ? (
              <div className="relative z-10 flex flex-col items-center justify-center h-full py-8">
                <p className="text-[#5d2e0d] text-center font-black italic text-lg leading-tight uppercase tracking-widest">
                  Aún no has registrado ningún evento
                </p>
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {topTriggers.map(([trigger, count], idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ scale: 0, rotate: idx % 2 === 0 ? -2 : 2 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-yellow-50 p-3 rounded-lg shadow-md border-l-4 border-red-400 transform hover:rotate-0 transition-transform"
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full shadow-sm"></div>
                    <p className="text-xs font-black text-stone-800 capitalize line-clamp-1">{trigger}</p>
                    <p className="text-[10px] text-stone-500 font-black mt-1 uppercase tracking-widest">{count} {count === 1 ? 'vez' : 'veces'}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-4">
          <MenuButton 
            onClick={() => onNavigate('logCraving')}
            icon={FlameKindling}
            label="Registrar ganas"
            color="bg-red-100 text-red-600"
          />
          <MenuButton 
            onClick={() => onNavigate('tools')}
            icon={Brain}
            label="Entrenar herramientas"
            color="bg-blue-100 text-blue-600"
          />
          <MenuButton 
            onClick={() => onNavigate('charts')}
            icon={BarChart3}
            label="Mostrar gráficas"
            color="bg-purple-100 text-purple-600"
          />
          <MenuButton 
            onClick={() => onNavigate('report')}
            icon={FileText}
            label="Apartado psicológico"
            color="bg-stone-100 text-stone-600"
          />
          
          <button 
            onClick={handleEmergency}
            className="col-span-2 flex items-center justify-center gap-4 bg-orange-50 p-6 rounded-[2rem] shadow-lg border-2 border-orange-100 hover:bg-orange-100 transition-all active:scale-95 group"
          >
            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xl shadow-orange-200">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-black text-orange-700 uppercase tracking-widest">
              EMERGENCIAS
            </span>
          </button>
        </div>

        <div className="pt-8 border-t border-stone-200">
          <button
            onClick={onWithdrawConsent}
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-black py-5 px-6 rounded-3xl transition-all shadow-xl shadow-red-100 active:scale-95 uppercase tracking-widest text-xs"
          >
            <Trash2 className="w-5 h-5" />
            Retiro mi consentimiento y deseo que se eliminen mis registros
          </button>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Tu Tablero"
        content="Este es tu centro de control. Aquí puedes ver tu racha de días activos y tus disparadores (situaciones que te dan ganas de fumar). Usa los botones para registrar tus momentos difíciles o practicar técnicas de calma. El botón de emergencias te conecta directamente con ayuda profesional."
      />
    </motion.div>
  );
}

function MenuButton({ onClick, icon: Icon, label, color }: { onClick: () => void; icon: any; label: string; color: string }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-4 bg-white p-6 rounded-[2rem] shadow-lg border-2 border-stone-100 hover:bg-stone-50 transition-all active:scale-95 group"
    >
      <div className={`w-16 h-16 ${color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="text-xs font-black text-stone-700 text-center leading-tight uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
}
