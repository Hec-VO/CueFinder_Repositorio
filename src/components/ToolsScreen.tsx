import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Wind, 
  ListChecks, 
  Waves, 
  Ear, 
  Eye, 
  Hand, 
  Smile, 
  Heart, 
  Coffee, 
  Timer,
  Sparkles,
  ChevronRight,
  Brain,
  Activity,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState } from '../types';
import HelpModal from './HelpModal';

interface Props {
  appState: AppState;
  onComplete: (toolId: string) => void;
  onBack: () => void;
}

function CountdownTimer({ initialSeconds, onComplete }: { initialSeconds: number; onComplete?: () => void }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      onComplete?.();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-stone-100 p-6 rounded-[2rem] border-2 border-stone-200">
      <div className="text-5xl font-black text-stone-800 font-mono">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isActive ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={() => { setSeconds(initialSeconds); setIsActive(false); }}
          className="p-4 bg-white text-stone-400 rounded-2xl shadow-md border-2 border-stone-100 active:scale-95"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

const TOOLS = [
  { 
    id: 'respiracion', 
    title: 'Respiración 4-7-8', 
    icon: Wind, 
    color: 'bg-blue-100 text-blue-600', 
    desc: 'Calma tu sistema nervioso.', 
    phrase: 'Tu respiración es tu ancla.',
    instructions: (state: AppState) => `Si puedes, cierra los ojos. Inhala por la nariz contando despacio hasta ${state.breathingTimes.inhale}. Mantén el aire contando hasta ${state.breathingTimes.hold}. Suelta el aire por la boca contando hasta ${state.breathingTimes.exhale}. Repite esto 3 veces. Fíjate cómo cambia tu cuerpo: te empiezas a destensar y respiras más relajado.`
  },
  { 
    id: 'urge_surfing', 
    title: 'Urge Surfing', 
    icon: Waves, 
    color: 'bg-emerald-100 text-emerald-600', 
    desc: 'Surfea la ola del deseo.', 
    phrase: 'El deseo es una ola que pasa.',
    instructions: () => "Detente donde estés. Di mentalmente: ‘Esto es una urgencia’. Localiza la sensación en tu cuerpo (¿pecho, garganta, manos?). Nómbrala: ‘esto es ansiedad’ o ‘esto es deseo’. Obsérvala sin hacer nada—solo mira cómo sube y baja. Respira de forma lenta y observa: la sensación es como una ola que llega, alcanza un pico y luego baja. Espera a que baje."
  },
  { 
    id: 'tecnica_54321', 
    title: 'Técnica 5-4-3-2-1', 
    icon: Brain, 
    color: 'bg-purple-100 text-purple-600', 
    desc: 'Vuelve al presente.', 
    phrase: 'Aquí y ahora.',
    instructions: () => "Mira a tu alrededor y di en voz baja: 5 cosas que veo; ahora toca 4 cosas cerca de ti y nómbralas; escucha 3 sonidos; encuentra 2 olores (o imagina 2); y finalmente nombra 1 sabor (real o imaginado). Hazlo despacio. Esto trae tu atención al presente y calma el impulso."
  },
  { 
    id: 'postergacion', 
    title: 'Postergación Consciente', 
    icon: Timer, 
    color: 'bg-orange-100 text-orange-600', 
    desc: 'Espera un momento.', 
    phrase: 'Solo 5 minutos más.',
    instructions: () => "Dite en voz baja: ‘Esperaré 5 minutos’. Ajusta el temporizador en tu teléfono o cuenta mentalmente. Durante esos 5 minutos haz algo más: respira o da una caminata breve. Si al pasar los 5 minutos la urgencia sigue, vuelve a esperar 5 minutos."
  },
  { 
    id: 'razones', 
    title: 'Lista de Razones', 
    icon: ListChecks, 
    color: 'bg-indigo-100 text-indigo-600', 
    desc: 'Recuerda tu por qué.', 
    phrase: 'Tu salud es tu mayor riqueza.',
    instructions: (state: AppState) => `Detente donde estés. ¿Recuerdas tus razones para dejar de fumar? Aquí están para que las leas y recuerdes porque estás haciendo este esfuerzo: ${state.reasons.join(', ')}.`
  },
  { 
    id: 'reestructuracion', 
    title: 'Reestructuración', 
    icon: Smile, 
    color: 'bg-rose-100 text-rose-600', 
    desc: 'Cambia tu pensamiento.', 
    phrase: 'Tus pensamientos no son hechos.',
    instructions: () => "Identifica el pensamiento que está impulsando la ganas, por ejemplo: ‘solo un cigarro me calma’. Pregúntate: ‘¿es verdad siempre?’ Busca una alternativa realista: ‘Puedo esperar 5 minutos, esto pasará y no necesito fumar para calmarme’. Repite la frase alternativa 2 veces y respira."
  },
  { 
    id: 'afirmaciones', 
    title: 'Afirmaciones', 
    icon: Heart, 
    color: 'bg-yellow-100 text-yellow-600', 
    desc: 'Palabras de poder.', 
    phrase: 'Soy capaz y soy libre.',
    instructions: () => "Elige una frase corta que te motive (ej.: ‘Soy capaz de dejar de fumar’ o ‘Cuido mi salud por mi familia’). Repite la frase 3 veces con una respiración profunda entre cada repetición."
  },
  { 
    id: 'caminata', 
    title: 'Caminata Consciente', 
    icon: Activity, 
    color: 'bg-pink-100 text-pink-600', 
    desc: 'Mueve tu cuerpo.', 
    phrase: 'Siente cada paso.',
    instructions: () => "Levántate y camina despacio durante 2–5 minutos. Siente los pies en el suelo, el movimiento de tus piernas y tu respiración. Si la mente se va, tráela con suavidad al cuerpo y a los pasos. Concéntrate en el presente."
  },
  { 
    id: 'visualizacion', 
    title: 'Visualización', 
    icon: Eye, 
    color: 'bg-amber-100 text-amber-600', 
    desc: 'Imagina tu futuro.', 
    phrase: 'Lo que crees, creas.',
    instructions: () => "Cierra los ojos 1–2 minutos. Imagina la situación de fumar, y luego cambia la imagen: hazla poco atractiva, ve todo lo que te deja, el mal olor, los dientes amarillos, tu ropa desgastada y maltratada, y después imagina a tu ‘yo futuro’ sano y contento después de haber dejado de fumar. Mantén la imagen positiva 30–60 segundos. Abre los ojos y respira."
  },
  { 
    id: 'sustitucion', 
    title: 'Sustitución Oral', 
    icon: Coffee, 
    color: 'bg-cyan-100 text-cyan-600', 
    desc: 'Ocupa tu boca.', 
    phrase: 'Un nuevo hábito saludable.',
    instructions: () => "Toma un chicle sin azúcar, una goma, un palillo o una pastilla. Mantén algo en la boca y mastica despacio o sostenlo. Combínalo con respiraciones conscientes."
  },
];

export default function ToolsScreen({ appState, onComplete, onBack }: Props) {
  const [selectedTool, setSelectedTool] = useState<typeof TOOLS[0] | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const enabledTools = TOOLS.filter(t => appState.enabledTools.includes(t.id));

  const handleComplete = () => {
    if (selectedTool) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444']
      });
      onComplete(selectedTool.id);
      setSelectedTool(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col bg-stone-50 relative"
    >
      <AnimatePresence mode="wait">
        {!selectedTool ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
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
                <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Herramientas</h1>
                <p className="text-stone-500 font-bold text-sm">Entrena tu mente</p>
              </div>
            </div>

            <div className="flex-1 px-8 pb-12 overflow-y-auto space-y-4">
              {enabledTools.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] text-center shadow-xl border-2 border-stone-100">
                  <Sparkles className="w-16 h-16 text-stone-200 mx-auto mb-6" />
                  <p className="text-stone-400 font-black uppercase tracking-widest text-sm leading-relaxed">
                    Tu psicólogo habilitará las herramientas adecuadas para tu proceso pronto.
                  </p>
                </div>
              ) : (
                enabledTools.map((tool, idx) => (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedTool(tool)}
                    className="w-full bg-white p-6 rounded-[2rem] shadow-lg border-2 border-stone-100 hover:bg-stone-50 transition-all flex items-center gap-6 group active:scale-95"
                  >
                    <div className={`w-16 h-16 ${tool.color} rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-black text-stone-800 uppercase tracking-tight">{tool.title}</h3>
                      <p className="text-stone-500 font-bold text-xs line-clamp-1">{tool.desc}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-stone-300 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tool"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col bg-white"
          >
            <div className="p-8 pt-12 flex items-center gap-4">
              <button 
                onClick={() => setSelectedTool(null)}
                className="p-4 bg-stone-50 rounded-2xl shadow-sm text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">{selectedTool.title}</h1>
                <p className="text-stone-500 font-bold text-sm">Práctica guiada</p>
              </div>
            </div>

            <div className="flex-1 px-8 pb-12 overflow-y-auto">
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 ${selectedTool.color} rounded-[2rem] flex items-center justify-center mb-8 shadow-xl`}>
                  <selectedTool.icon className="w-12 h-12" />
                </div>
                
                <div className="w-full text-stone-500 font-bold text-lg leading-relaxed mb-8 text-left space-y-4">
                  {selectedTool.id === 'razones' ? (
                    <div className="bg-[#fdfcf0] p-8 rounded-lg border-l-4 border-amber-200 shadow-md relative overflow-hidden min-h-[200px]">
                      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}></div>
                      <p className="mb-6 font-serif italic text-amber-900 relative z-10">{selectedTool.instructions(appState).split(':')[0]}:</p>
                      <ul className="space-y-4 relative z-10">
                        {appState.reasons.map((reason, i) => (
                          <li key={i} className="text-stone-800 font-serif border-b border-stone-200 pb-1 flex gap-3">
                            <span className="text-amber-400 font-black">★</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : selectedTool.id === 'postergacion' ? (
                    <div className="space-y-6">
                      <p>{selectedTool.instructions(appState)}</p>
                      <CountdownTimer initialSeconds={300} />
                    </div>
                  ) : (
                    <p>{selectedTool.instructions(appState)}</p>
                  )}
                </div>
                
                <div className="w-full bg-stone-50 p-6 rounded-3xl border-2 border-stone-100 italic font-black text-blue-600 uppercase tracking-widest text-xs mb-10">
                  "{selectedTool.phrase}"
                </div>

                <div className="w-full space-y-4">
                  <button
                    onClick={handleComplete}
                    className="w-full bg-emerald-500 text-white font-black py-6 rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    Marcar como completado
                  </button>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="w-full text-stone-400 font-black py-4 hover:bg-stone-50 rounded-2xl transition-all uppercase tracking-widest text-xs"
                  >
                    Regresar al listado
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Herramientas de Afrontamiento"
        content="Aquí encontrarás técnicas basadas en psicología para manejar el impulso de fumar. Cada una tiene un propósito: calmar tu mente, distraerte o recordarte tus metas. Practícalas incluso cuando no tengas ganas de fumar para que tu cerebro aprenda a usarlas automáticamente en momentos difíciles."
      />
    </motion.div>
  );
}
