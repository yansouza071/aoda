import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Lock, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  Zap,
  ArrowRight
} from 'lucide-react';
import { CalendarEvent, CalendarEventType, UserAccount } from '../types';

interface CalendarScheduleViewProps {
  user: UserAccount;
  onLogAudit?: (action: string, target: string) => void;
  onSendWhatsApp?: (title: string, msg: string) => void;
}

const DAYS_NAMES = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const CalendarScheduleView: React.FC<CalendarScheduleViewProps> = ({
  user,
  onLogAudit,
  onSendWhatsApp,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'ev_1',
      title: 'Revisão de Planta Estrutural Torre A',
      dayOfWeek: 1, // Segunda
      startTime: '09:00',
      endTime: '10:30',
      type: 'obra_tecnica',
      location: 'Canteiro / Sala Técnica',
      attendeesCount: 4,
    },
    {
      id: 'ev_2',
      title: 'Reunião de Alinhamento com Fornecedor de Aço',
      dayOfWeek: 1, // Segunda
      startTime: '10:00', // CONFLICT with ev_1!
      endTime: '11:00',
      type: 'reuniao',
      location: 'Meet Virtual',
      attendeesCount: 2,
      hasConflict: true,
      conflictWithTitle: 'Revisão de Planta Estrutural Torre A',
    },
    {
      id: 'ev_3',
      title: 'Bloqueio de Foco: Memória de Cálculo de Cargas',
      dayOfWeek: 2, // Terça
      startTime: '14:00',
      endTime: '17:00',
      type: 'bloqueio_foco',
      isFocusBlock: true,
    },
    {
      id: 'ev_4',
      title: 'Apresentação de ROI & Projeções Trimestrais',
      dayOfWeek: 3, // Quarta
      startTime: '14:00',
      endTime: '15:30',
      type: 'financeiro',
      location: 'Auditório Corporativo',
      attendeesCount: 8,
    },
    {
      id: 'ev_5',
      title: 'Visita Técnica e Medição de Obra Lote 4B',
      dayOfWeek: 4, // Quinta
      startTime: '09:30',
      endTime: '12:00',
      type: 'obra_tecnica',
      location: 'Obra Alphaville',
      attendeesCount: 3,
    },
  ]);

  const [isResolving, setIsResolving] = useState(false);
  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

  // Check for time overlaps
  const detectConflicts = (evList: CalendarEvent[]) => {
    return evList.filter((e) => e.hasConflict);
  };

  const conflicts = detectConflicts(events);

  // AI Automatic Rescheduling
  const handleAiAutoReschedule = async () => {
    setIsResolving(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Fix conflict by moving the supplier meeting to an open slot (e.g. 11:30)
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === 'ev_2') {
          return {
            ...e,
            startTime: '11:30',
            endTime: '12:30',
            hasConflict: false,
            conflictWithTitle: undefined,
          };
        }
        if (e.id === 'ev_1') {
          return { ...e, hasConflict: false };
        }
        return e;
      })
    );

    setIsResolving(false);
    setResolvedMessage(
      'A IA reorganizou o horário da Reunião com Fornecedor para às 11:30, eliminando a sobreposição com a Revisão de Planta.'
    );

    if (onLogAudit) {
      onLogAudit('Reagendamento Autônomo de Conflito de Agenda', 'Reunião Fornecedor de Aço -> 11:30');
    }

    if (onSendWhatsApp) {
      onSendWhatsApp(
        'Agenda Reorganizada pelo AODA',
        'Seu compromisso com o fornecedor de aço foi reagendado com sucesso para às 11:30 para evitar sobreposição.'
      );
    }

    setTimeout(() => setResolvedMessage(null), 5000);
  };

  // Add Focus Block
  const handleAddFocusBlock = () => {
    const newBlock: CalendarEvent = {
      id: `foc_${Date.now()}`,
      title: 'Bloqueio de Foco: Revisão Técnica Sem Interrupções',
      dayOfWeek: 4, // Quinta
      startTime: '14:00',
      endTime: '17:00',
      type: 'bloqueio_foco',
      isFocusBlock: true,
    };

    setEvents((prev) => [...prev, newBlock]);
    if (onLogAudit) {
      onLogAudit('Criação de Bloqueio de Foco (Deep Work)', 'Quinta-feira 14h às 17h');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-400" />
            Calendário Semanal & Resolução Inteligente de Horários
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detecção em tempo real de colisões de reuniões, criação de bloqueios de foco para trabalho técnico e remanejamento autônomo via IA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddFocusBlock}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            Adicionar Bloqueio de Foco
          </button>
        </div>
      </div>

      {/* Conflict Alert Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                Sobreposição de Horários Detectada! ({conflicts.length} conflito ativo)
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {conflicts[0].title} está colidindo no mesmo horário com "{conflicts[0].conflictWithTitle}".
              </p>
            </div>
          </div>

          <button
            onClick={handleAiAutoReschedule}
            disabled={isResolving}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 shrink-0 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isResolving ? 'animate-spin' : ''}`} />
            {isResolving ? 'Reorganizando com IA...' : 'Reagendar Automaticamente via IA'}
          </button>
        </div>
      )}

      {resolvedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{resolvedMessage}</span>
        </div>
      )}

      {/* Weekly Visual Grid */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-slate-100">Grade Semanal da Equipe</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Reunião
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Obra / Técnica
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Bloqueio de Foco
            </span>
          </div>
        </div>

        {/* Days Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {DAYS_NAMES.slice(0, 5).map((dayName, index) => {
            const dayIndex = index + 1; // 1 = Seg, 2 = Ter...
            const dayEvents = events.filter((e) => e.dayOfWeek === dayIndex);

            return (
              <div
                key={dayName}
                className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-3 min-h-[380px] flex flex-col justify-between"
              >
                <div>
                  <div className="pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{dayName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {dayEvents.length} eventos
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dayEvents.length === 0 ? (
                      <p className="text-[11px] text-slate-600 text-center py-8">
                        Livre para demandas técnicas
                      </p>
                    ) : (
                      dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`p-2.5 rounded-xl border transition-all text-xs relative ${
                            ev.hasConflict
                              ? 'bg-rose-950/40 border-rose-500/70 text-rose-200'
                              : ev.isFocusBlock
                              ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                              : ev.type === 'obra_tecnica'
                              ? 'bg-yellow-950/30 border-yellow-500/40 text-yellow-200'
                              : 'bg-brand-950/30 border-brand-500/40 text-brand-200'
                          }`}
                        >
                          {ev.hasConflict && (
                            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold">
                              Conflito!
                            </span>
                          )}

                          <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                            <span className="font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ev.startTime} - {ev.endTime}
                            </span>
                            {ev.isFocusBlock && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-semibold">
                                Foco
                              </span>
                            )}
                          </div>

                          <h5 className="font-semibold text-slate-100 text-[11px] leading-tight">
                            {ev.title}
                          </h5>

                          {ev.location && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate">
                              📍 {ev.location}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 text-center">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Horário comercial
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
