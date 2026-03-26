import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function HelpModal({ isOpen, onClose, title, content }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight uppercase">{title}</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-stone-100 rounded-2xl transition-colors text-stone-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-stone-600 font-bold text-lg leading-relaxed">
                  {content}
                </p>
                
                <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                  <p className="text-emerald-800 font-black uppercase tracking-widest text-[10px] leading-relaxed">
                    Recuerda que este es un espacio seguro diseñado para tu bienestar.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-10 w-full bg-stone-900 text-white font-black py-6 rounded-3xl shadow-xl shadow-stone-200 hover:bg-stone-800 transition-all uppercase tracking-widest active:scale-95"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
