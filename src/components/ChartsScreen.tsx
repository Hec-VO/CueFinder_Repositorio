import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppState } from '../types';
import HelpModal from './HelpModal';

interface Props {
  appState: AppState;
  onBack: () => void;
}

export default function ChartsScreen({ appState, onBack }: Props) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const daysCount = view === 'week' ? 7 : 30;
  const data = Array.from({ length: daysCount }).map((_, i) => {
    const date = subDays(new Date(), daysCount - 1 - i);
    const count = appState.cravingLogs.filter(log => 
      isWithinInterval(new Date(log.timestamp), {
        start: startOfDay(date),
        end: endOfDay(date)
      })
    ).length;

    return {
      name: format(date, view === 'week' ? 'EEE' : 'd', { locale: es }),
      count,
      fullDate: format(date, 'PPP', { locale: es })
    };
  });

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
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Tus Gráficas</h1>
          <p className="text-stone-500 font-bold text-sm">Visualiza tu progreso</p>
        </div>
      </div>

      <div className="px-8 flex gap-3 mb-8">
        <button
          onClick={() => setView('week')}
          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
            view === 'week' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-white text-stone-400'
          }`}
        >
          Últimos 7 días
        </button>
        <button
          onClick={() => setView('month')}
          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
            view === 'month' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-white text-stone-400'
          }`}
        >
          Últimos 30 días
        </button>
      </div>

      <div className="flex-1 px-8 pb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-stone-200 border-2 border-stone-100 h-[400px] flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-black text-stone-800 uppercase tracking-tight">Frecuencia de ganas</h3>
          </div>
          
          <div className="flex-1 -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xl border border-stone-800">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{payload[0].payload.fullDate}</p>
                          <p className="text-lg font-black">{payload[0].value} <span className="text-xs opacity-80">Ganas</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 8, 8]} barSize={view === 'week' ? 32 : 12}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#2563eb' : '#f1f5f9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-[2rem] border-2 border-blue-100 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-blue-900 font-black uppercase tracking-widest text-[10px] mb-1">Resumen del periodo</p>
            <p className="text-blue-700 font-bold text-sm leading-tight">
              Has registrado <span className="font-black text-blue-900">{data.reduce((acc, curr) => acc + curr.count, 0)}</span> ocasiones en los últimos {daysCount} días.
            </p>
          </div>
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Tus Gráficas"
        content="Aquí puedes ver visualmente cómo han variado tus ganas de fumar en la última semana o mes. Verás barras que indican cuántas veces registraste ganas cada día. Esto te ayuda a identificar patrones y a celebrar los días con menos registros."
      />
    </motion.div>
  );
}
