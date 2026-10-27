import React, { useState } from 'react';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  Share2, 
  Trash2,
  Calendar,
  Calculator,
  Newspaper,
  SendHorizontal
} from 'lucide-react';
import { IntelligentRoutine, RoutineAction } from '../types';
import { notificationService } from '../services/notificationService';

interface RoutinesViewProps {
  routines: IntelligentRoutine[];
  onExecuteRoutine: (routineId: string) => Promise<void>;
  onCreateRoutine: (routine: IntelligentRoutine) => void;
  isCorporate: boolean;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  onExecuteRoutine,
  onCreateRoutine,
  isCorporate
}) => {
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [isShared, setIsShared] = useState(isCorporate);

  const handleRun = async (id: string) => {
    setExecutingId(id);
    try {
      await onExecuteRoutine(id);
      notificationService.notify(
        'Rotina Inteligente Concluída',
        'As ações combinadas foram finalizadas com sucesso no AODA.'
      );
    } finally {
      setExecutingId(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRoutine: IntelligentRoutine = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription || 'Fluxo automatizado com comando único no AODA.',
      triggerPrompt: newPrompt || newTitle,
      isShared: isShared,
      status: 'idle',
      actions: [
        {
          id: '1',
          type: 'calc_financial',
          title: 'Executar Projeção de Faturamento e Custos',
          params: {},
        },
        {
          id: '2',
          type: 'schedule_calendar',
          title: 'Agendar Auditoria Técnica no Calendário',
          params: { time: '17:00' },
        },
        {
          id: '3',
          type: 'generate_tech_digest',
          title: 'Disparar Resumo Executivo para a Equipe',
          params: {},
        },
      ],
    };

    onCreateRoutine(newRoutine);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewPrompt('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Workflow className="w-6 h-6 text-purple-400" />
            Módulo de Rotinas Inteligentes & Ações Combinadas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Execute fluxos encadeados complexos com apenas 1 clique ou comando de voz.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Nova Rotina Inteligente
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {routines.map((routine) => {
          const isRunning = executingId === routine.id;
          return (
            <div
              key={routine.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 p-5 flex flex-col justify-between transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Macro Autônomo
                  </span>
                  {routine.isShared && (
                    <span className="text-[10px] font-medium text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      Compartilhada PJ
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                  {routine.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {routine.description}
                </p>

                {/* Steps visual pipeline */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider block">
                    Ações Combinadas ({routine.actions.length})
                  </span>
                  {routine.actions.map((action, idx) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-mono text-purple-400 flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {action.type === 'calc_financial' && <Calculator className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      {action.type === 'schedule_calendar' && <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                      {action.type === 'generate_tech_digest' && <Newspaper className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {action.type === 'trigger_webhook' && <SendHorizontal className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      <span className="text-[11px] truncate">{action.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {routine.lastRun ? `Última: ${routine.lastRun}` : 'Nunca executada'}
                </span>

                <button
                  onClick={() => handleRun(routine.id)}
                  disabled={isRunning}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                    isRunning
                      ? 'bg-purple-800 text-purple-200 animate-pulse'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
                  }`}
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                  {isRunning ? 'Executando...' : 'Disparar Rotina'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova Rotina */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-400" />
              Criar Nova Rotina Inteligente
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nome do Fluxo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fechamento Fiscal + Agenda de Alinhamento"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="O que este conjunto de ações faz em um único clique..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Comando de Ativação por Voz/Texto</label>
                <input
                  type="text"
                  placeholder="Ex: Executar auditoria de fechamento matinal"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {isCorporate && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="shareRoutine"
                    checked={isShared}
                    onChange={(e) => setIsShared(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="shareRoutine" className="text-xs text-slate-300 cursor-pointer">
                    Compartilhar com toda a equipe do CNPJ
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  Salvar Rotina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
