import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import HelpModal from './HelpModal';

interface Props {
  onSave: (description: string, triggers: string[]) => void;
  onBack: () => void;
}

export default function LogCravingScreen({ onSave, onBack }: Props) {
  const [description, setDescription] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSave = async () => {
    if (!description.trim()) return;
    
    setIsAnalyzing(true);
    let triggers: string[] = [];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analiza este texto de una persona que tiene ganas de fumar y extrae una lista de 1 a 3 "disparadores" (situaciones, emociones o lugares específicos) en formato JSON: ["trigger1", "trigger2"]. Texto: "${description}"`,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text || "[]");
      triggers = Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback simple si falla la IA
      const commonTriggers = ['estrés', 'café', 'alcohol', 'fiesta', 'aburrimiento', 'enojo'];
      triggers = commonTriggers.filter(t => description.toLowerCase().includes(t));
      if (triggers.length === 0) triggers = ['desconocido'];
    } finally {
      setIsAnalyzing(false);
      onSave(description, triggers);
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
          <h1 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Registrar Ganas</h1>
          <p className="text-stone-500 font-bold text-sm">¿Qué está pasando ahora?</p>
        </div>
      </div>

      <div className="flex-1 px-8 pb-12 flex flex-col">
        <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200 p-8 border-2 border-stone-100 relative overflow-hidden flex flex-col">
          {/* Notebook lines */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }}></div>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe aquí cómo te sientes, dónde estás o qué estabas haciendo..."
            className="flex-1 w-full bg-transparent border-none focus:ring-0 text-stone-800 font-bold text-lg leading-[2.5rem] resize-none relative z-10 placeholder:text-stone-300"
          />
          
          <div className="mt-6 flex items-center gap-3 text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <Sparkles className="w-4 h-4" />
            Nuestra IA analizará tus disparadores automáticamente
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!description.trim() || isAnalyzing}
          className={`mt-8 w-full font-black py-6 rounded-3xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl ${
            description.trim() && !isAnalyzing
              ? 'bg-blue-600 text-white shadow-blue-100 active:scale-95' 
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Guardar ocasión
            </>
          )}
        </button>
      </div>

      <HelpModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Registrar Ganas"
        content="Escribe con detalle qué sientes y qué estás haciendo. No te preocupes por la ortografía, lo importante es desahogarte. Nuestra inteligencia artificial detectará qué situaciones te ponen en riesgo para que podamos trabajar en ellas."
      />
    </motion.div>
  );
}
