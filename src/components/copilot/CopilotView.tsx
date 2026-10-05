import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, NavSection, UserProfile } from '../../types';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  Shield,
  Lightbulb,
  Gamepad2,
  RefreshCw,
} from 'lucide-react';

interface CopilotViewProps {
  user: UserProfile;
  onNavigate: (section: NavSection) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content:
        'Hola Juan, soy AIDEX 0.7, tu copiloto inteligente de inducción y productividad comercial. Puedo resolver dudas, consultar procesos, explicar ofertas vigentes, recomendar capacitaciones y guiar tus actividades en campo.',
      timestamp: '09:00 AM',
    },
    {
      id: 'm-2',
      role: 'user',
      content: '¿Cómo registro una visita a un PDV?',
      timestamp: '09:02 AM',
    },
    {
      id: 'm-3',
      role: 'assistant',
      content:
        'Para registrar tu visita en campo:\n\n1. Ve a **Ejecución en Campo → Visitas PDV**.\n2. Presiona el botón **+ Crear Visita**.\n3. Completa la auditoría rápida de 5 checks (oferta visible, material POP, conocimiento del asesor, indicadores y hallazgos).\n4. Carga las 4 fotografías de evidencia.\n5. Pulsa **Enviar Visita**. Si detectas algún hallazgo, se creará automáticamente una acción en **Cierre de Brechas**.',
      timestamp: '09:02 AM',
      actionTarget: {
        section: 'field',
        label: 'Abrir pantalla de Visitas PDV →',
      },
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [roleplayMode, setRoleplayMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    '¿Qué oferta está vigente este mes?',
    '¿Qué curso de formación sigue en mi ruta?',
    '¿Cómo cierro una brecha de objeciones?',
    'Simular roleplay de venta frente a objeción de precio',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          roleplayMode,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Entendido. ¿En qué más puedo apoyarte en tu inducción?';

      let actionTarget: ChatMessage['actionTarget'];
      const lower = replyText.toLowerCase();
      if (lower.includes('campo') || lower.includes('visita') || lower.includes('pdv')) {
        actionTarget = { section: 'field', label: 'Ir a Ejecución en Campo →' };
      } else if (lower.includes('formacion') || lower.includes('cvs') || lower.includes('curso')) {
        actionTarget = { section: 'training', label: 'Ir a Formación y Cursos →' };
      } else if (lower.includes('brecha') || lower.includes('mejora')) {
        actionTarget = { section: 'gaps', label: 'Ir a Cierre de Brechas →' };
      } else if (lower.includes('sharepoint') || lower.includes('tarifario') || lower.includes('politica')) {
        actionTarget = { section: 'admin', label: 'Abrir SharePoint Comercial →' };
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTarget,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error in chat request:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content:
          'He procesado tu consulta con el motor local AIDEX. Recuerda que puedes consultar los manuales oficiales en el módulo de SharePoint o revisar tus 3 brechas activas para seguir sumando XP.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Copilot Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#0F3D66] to-[#1F5E99] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
            <Sparkles className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-wide">Asistente IA AIDEX 0.7</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider text-blue-100">
                Copilot Comercial
              </span>
            </div>
            <p className="text-xs text-blue-100/80">
              Impulsado por Google Gemini · Contexto de Juan Pérez ({user.region})
            </p>
          </div>
        </div>

        <button
          onClick={() => setRoleplayMode(!roleplayMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            roleplayMode
              ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title="El asistente simula un cliente difícil para entrenar objeciones"
        >
          <Gamepad2 className="w-4 h-4" />
          <span className="hidden sm:inline">
            {roleplayMode ? 'Modo Roleplay: ACTIVO' : 'Activar Modo Roleplay'}
          </span>
        </button>
      </div>

      {/* Roleplay Mode Banner if active */}
      {roleplayMode && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            Modo Roleplay de Ventas: AIDEX actuará como un tomador de decisiones exigente para que practiques tu argumentario.
          </span>
          <button
            onClick={() => setRoleplayMode(false)}
            className="text-[11px] underline font-bold hover:text-amber-950 dark:hover:text-white"
          >
            Desactivar
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ${
                  isUser
                    ? 'bg-[#1F5E99] text-white'
                    : 'bg-gradient-to-tr from-[#0F3D66] to-[#4A90E2] text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble (Matching Screen 10 reference mockup: M1 / M2 styles) */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#1F5E99] text-white rounded-tr-none shadow-sm'
                    : 'bg-[#EEF2F6] dark:bg-[#1E293B] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Direct Action Link in response (Screen 10: 'Abrir pantalla') */}
                {m.actionTarget && !isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => onNavigate(m.actionTarget!.section)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-sm"
                    >
                      <span>{m.actionTarget.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-blue-100/70' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-[#1F5E99] animate-bounce" />
            <span>AIDEX 0.7 está analizando la mejor respuesta comercial...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (Screen 10 Reference Mockup) */}
      <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#1F5E99] hover:text-[#1F5E99] dark:hover:text-[#38BDF8] text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form (Screen 10: 'Escribe tu pregunta… ➤') */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            roleplayMode
              ? 'Responde como ejecutivo frente al cliente escéptico...'
              : 'Escribe tu pregunta a AIDEX 0.7…'
          }
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#4A90E2] transition"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isTyping}
          className="p-3 rounded-2xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white disabled:opacity-50 transition active:scale-95 shadow-md shadow-blue-900/20"
          title="Enviar pregunta"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
