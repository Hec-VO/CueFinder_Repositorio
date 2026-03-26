import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Lock, 
  HelpCircle, 
  Wrench, 
  FileText, 
  Clock, 
  Activity, 
  CheckCircle2, 
  Plus,
  Trash2,
  ChevronRight,
  Settings,
  Wind,
  ListChecks
} from 'lucide-react';
import { AppState } from '../types';
import HelpModal from './HelpModal';

interface Props {
  appState: AppState;
  onUpdateState: (newState: Partial<AppState>) => void;
  onBack: () => void;
}

const ALL_TOOLS = [
  { id: 'respiracion', title: 'Respiración 4-7-8' },
  { id: 'urge_surfing', title: 'Urge Surfing' },
  { id: 'tecnica_54321', title: 'Técnica 5-4-3-2-1' },
  { id: 'postergacion', title: 'Postergación Consciente' },
  { id: 'razones', title: 'Lista de Razones' },
  { id: 'reestructuracion', title: 'Reestructuración' },
  { id: 'afirmaciones', title: 'Afirmaciones' },
  { id: 'caminata', title: 'Caminata Consciente' },
  { id: 'visualizacion', title: 'Visualización' },
  { id: 'sustitucion', title: 'Sustitución Oral' },
];

export default function ReportScreen({ appState, onUpdateState, onBack }: Props) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [view, setView] = useState<'main' | 'tools' | 'breathing' | 'reasons'>('main');

  const handleLogin = () => {
    if (password === '012345') {
      setIsAuthorized(true);
    } else {
      alert('Código incorrecto');
    }
  };

  if (!isAuthorized) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-8 bg-stone-900 text-white"
      >
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
          <Lock className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4 text-center">Apartado Psicológico</h1>
        <p className="text-stone-400 font-bold text-center mb-10 max-w-xs leading-relaxed uppercase tracking-widest text-xs">
          Ingrese el código de acceso para continuar.
        </p>
        
        <div className="w-full max-w-xs space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Código de acceso"
              className="w-full bg-stone-800 border-2 border-stone-700 rounded-3xl py-6 px-8 text-center font-black text-2xl tracking-[0.5em] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-stone-600 placeholder:tracking-normal placeholder:text-sm"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-3xl transition-all shadow-xl shadow-blue-900 active:scale-95 uppercase tracking-widest"
          >
            Verificar Identidad
          </button>
          <button
            onClick={onBack}
            className="w-full text-stone-500 font-black py-4 hover:bg-stone-800 rounded-2xl transition-all uppercase tracking-widest text-xs"
          >
            Regresar al inicio
          </button>
        </div>
      </motion.div>
    );
  }

  // Stats calculations
  const triggerCounts: Record<string, number> = {};
  appState.cravingLogs.forEach(log => {
    log.triggers.forEach(t => {
      const normalized = t.toLowerCase().trim();
      triggerCounts[normalized] = (triggerCounts[normalized] || 0) + 1;
    });
  });
  const sortedTriggers = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1]);

  const hourCounts: Record<number, number> = {};
  appState.cravingLogs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  const topHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const renderContent = () => {
    switch (view) {
      case 'main':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Ganas registradas" value={appState.cravingLogs.length} icon={FileText} color="bg-blue-50 text-blue-600" />
              <StatCard title="Tareas completadas" value={appState.toolLogs.length} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* Triggers Section */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
              <h3 className="font-black text-stone-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                <Activity className="w-6 h-6 text-red-600" />
                Triggers Predominantes
              </h3>
              <div className="space-y-3">
                {sortedTriggers.length === 0 ? (
                  <p className="text-stone-400 font-bold text-sm italic">Sin registros aún.</p>
                ) : (
                  sortedTriggers.slice(0, 5).map(([trigger, count], i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="font-black text-stone-700 uppercase tracking-widest text-[10px]">{trigger}</span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-black text-[10px]">{count} veces</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
              <h3 className="font-black text-stone-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                Tareas Realizadas
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {appState.toolLogs.length === 0 ? (
                  <p className="text-stone-400 font-bold text-sm italic">Sin tareas aún.</p>
                ) : (
                  appState.toolLogs.slice().reverse().map((log, i) => (
                    <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex justify-between items-center">
                      <div>
                        <p className="font-black text-stone-800 uppercase tracking-widest text-[10px]">{log.toolName}</p>
                        <p className="text-[10px] text-stone-400 font-bold">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                      <span className="text-[10px] font-black text-stone-500 bg-white px-2 py-1 rounded-lg shadow-sm border border-stone-100">
                        {log.timeOfDay}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Usage Patterns */}
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100">
              <h3 className="font-black text-stone-900 uppercase tracking-tight mb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-600" />
                Horarios de Mayor Uso
              </h3>
              <div className="space-y-3">
                {topHours.length === 0 ? (
                  <p className="text-stone-400 font-bold text-sm italic">Sin datos de uso aún.</p>
                ) : (
                  topHours.map(([hour, count], i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <span className="font-black text-stone-700 uppercase tracking-widest text-[10px]">{hour}:00 - {parseInt(hour) + 1}:00</span>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black text-[10px]">{count} usos</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setView('tools')}
              className="w-full bg-stone-900 text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"
            >
              <Wrench className="w-6 h-6" />
              Modificar herramientas
            </button>
          </div>
        );
      case 'tools':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setView('main')} className="p-3 bg-white rounded-xl shadow-sm border border-stone-100">
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">Habilitar Herramientas</h2>
            </div>
            <div className="space-y-3">
              {ALL_TOOLS.map(tool => (
                <div key={tool.id} className="flex gap-2">
                  <button
                    onClick={() => {
                      const newTools = appState.enabledTools.includes(tool.id)
                        ? appState.enabledTools.filter(t => t !== tool.id)
                        : [...appState.enabledTools, tool.id];
                      onUpdateState({ enabledTools: newTools });
                    }}
                    className={`flex-1 flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      appState.enabledTools.includes(tool.id) 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                        : 'bg-stone-50 border-stone-100 text-stone-400'
                    }`}
                  >
                    <span className="font-black uppercase tracking-widest text-xs">{tool.title}</span>
                    {appState.enabledTools.includes(tool.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-stone-200"></div>
                    )}
                  </button>
                  {tool.id === 'respiracion' && (
                    <button onClick={() => setView('breathing')} className="p-5 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                  {tool.id === 'razones' && (
                    <button onClick={() => setView('reasons')} className="p-5 bg-blue-50 text-blue-600 rounded-2xl border-2 border-blue-100">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'breathing':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setView('tools')} className="p-3 bg-white rounded-xl shadow-sm border border-stone-100">
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">Tiempos Respiración</h2>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-stone-100 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Wind className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-black text-stone-800 uppercase tracking-widest text-xs">Ajustar Ciclo 4-7-8</p>
              </div>
              
              <div className="space-y-6">
                <TimeInput 
                  label="Inhalar" 
                  value={appState.breathingTimes.inhale} 
                  onChange={(v) => onUpdateState({ breathingTimes: { ...appState.breathingTimes, inhale: v } })} 
                />
                <TimeInput 
                  label="Mantener" 
                  value={appState.breathingTimes.hold} 
                  onChange={(v) => onUpdateState({ breathingTimes: { ...appState.breathingTimes, hold: v } })} 
                />
                <TimeInput 
                  label="Exhalar" 
                  value={appState.breathingTimes.exhale} 
                  onChange={(v) => onUpdateState({ breathingTimes: { ...appState.breathingTimes, exhale: v } })} 
                />
              </div>
            </div>
          </div>
        );
      case 'reasons':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => setView('tools')} className="p-3 bg-white rounded-xl shadow-sm border border-stone-100">
                <ArrowLeft className="w-5 h-5 text-stone-600" />
              </button>
              <h2 className="text-xl font-black text-stone-900 uppercase tracking-tight">Razones para no fumar</h2>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-stone-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <ListChecks className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="font-black text-stone-800 uppercase tracking-widest text-xs">Gestionar Lista</p>
              </div>

              <div className="space-y-3">
                {appState.reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={reason}
                      onChange={(e) => {
                        const newReasons = [...appState.reasons];
                        newReasons[i] = e.target.value;
                        onUpdateState({ reasons: newReasons });
                      }}
                      className="flex-1 bg-stone-50 border-2 border-stone-100 rounded-xl px-4 py-3 font-bold text-stone-700 focus:border-blue-500 outline-none"
                    />
                    <button 
                      onClick={() => {
                        const newReasons = appState.reasons.filter((_, idx) => idx !== i);
                        onUpdateState({ reasons: newReasons });
                      }}
                      className="p-3 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => onUpdateState({ reasons: [...appState.reasons, 'Nueva razón'] })}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 font-black uppercase tracking-widest text-[10px] hover:bg-stone-100 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Razón
                </button>
              </div>
            </div>
          </div>
        );
    }
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

      <div className="p-8 pt-12 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-4 bg-white rounded-2xl shadow-md text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Apartado Psicológico</h1>
          <p className="text-stone-500 font-bold text-sm">Panel de supervisión</p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-12 overflow-y-auto">
        {renderContent()}
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Panel Psicológico"
        content="Esta sección permite al profesional monitorear el progreso del paciente. Se muestran estadísticas de consumo, disparadores detectados y el uso de herramientas. También permite personalizar qué técnicas están disponibles y ajustar los parámetros de las mismas."
      />
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-xl border-2 border-stone-100 flex flex-col gap-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-stone-900">{value}</p>
      </div>
    </div>
  );
}

function TimeInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-black text-stone-600 uppercase tracking-widest text-[10px]">{label} (segundos)</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(1, value - 1))} className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center font-black text-stone-600">-</button>
        <span className="w-12 text-center font-black text-xl text-stone-900">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center font-black text-stone-600">+</button>
      </div>
    </div>
  );
}
