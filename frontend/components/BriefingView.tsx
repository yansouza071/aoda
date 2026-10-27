import React, { useState } from 'react';
import { 
  SunMedium, 
  Calendar, 
  CheckSquare, 
  Newspaper, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  AlertTriangle,
  CloudSun,
  Flame,
  ArrowRight
} from 'lucide-react';
import { DailyBriefing, UserAccount } from '../types';
import { generateDailyTechBriefing } from '../services/geminiService';

interface BriefingViewProps {
  user: UserAccount;
  briefing: DailyBriefing;
  onToggleTask: (taskId: string) => void;
  onToggleAppointment: (appId: string) => void;
  onNavigateToChat: (prompt: string) => void;
}

export const BriefingView: React.FC<BriefingViewProps> = ({
  user,
  briefing,
  onToggleTask,
  onToggleAppointment,
  onNavigateToChat
}) => {
  const [currentBriefing, setCurrentBriefing] = useState<DailyBriefing>(briefing);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      const generated = await generateDailyTechBriefing();
      setCurrentBriefing(prev => ({
        ...prev,
        quote: generated.quote,
        techNews: generated.news
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  const pendingCount = currentBriefing.pendingTasks.filter(t => !t.done).length;
  const appointmentCount = currentBriefing.appointments.filter(a => !a.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/20 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2">
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              Briefing Matinal Automático
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Bom dia, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Hoje é {currentBriefing.date}. O AODA organizou sua jornada: você tem{' '}
              <strong className="text-brand-300">{appointmentCount} compromissos</strong> e{' '}
              <strong className="text-amber-300">{pendingCount} tarefas críticas</strong> pendentes.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-800 shrink-0">
            <CloudSun className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-lg font-bold text-white leading-none">
                {currentBriefing.weather.temp}°C
              </div>
              <div className="text-xs text-slate-400">
                {currentBriefing.weather.condition} • {currentBriefing.weather.city}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 italic">
          <span>&ldquo;{currentBriefing.quote}&rdquo;</span>
          <button
            onClick={handleRefreshNews}
            disabled={isRefreshing}
            className="not-italic flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-all"
            title="Atualizar manchetes com IA"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
            Sincronizar IA
          </button>
        </div>
      </div>

      {/* Grid: Compromissos & Tarefas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agenda / Compromissos */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                <h3 className="font-semibold text-slate-200 text-sm">Compromissos do Dia</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {currentBriefing.appointments.length} agendados
              </span>
            </div>

            <div className="space-y-2.5">
              {currentBriefing.appointments.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onToggleAppointment(app.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    app.completed
                      ? 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        app.completed ? 'bg-slate-600' : 'bg-brand-400 animate-pulse'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          app.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {app.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{app.time}</span>
                        <span>•</span>
                        <span className="text-brand-400">{app.category}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      app.priority === 'Alta'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {app.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToChat('Agende uma nova reunião técnica de alinhamento para hoje às 16h')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Pedir ao AODA para agendar ou reagendar
          </button>
        </div>

        {/* Tarefas Pendentes */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-slate-200 text-sm">Tarefas & Prazos Críticos</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {pendingCount} pendentes
              </span>
            </div>

            <div className="space-y-2.5">
              {currentBriefing.pendingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    task.done
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      readOnly
                      className="rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-brand-500 pointer-events-none"
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          task.done ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[11px] text-slate-400">Prazo: {task.deadline}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      task.priority === 'Alta'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToChat('Crie uma rotina para priorizar e auditar minhas tarefas pendentes')}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Otimizar prioridades com IA
          </button>
        </div>
      </div>

      {/* Radar de Notícias Tecnológicas */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyanic-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Radar Tecnológico & Inovação</h3>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Atualizado via Gemini
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentBriefing.techNews.map((news) => (
            <div
              key={news.id}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-brand-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    {news.tag}
                  </span>
                  <span className="text-[11px] text-slate-500">{news.timestamp}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 hover:text-brand-300 transition-colors">
                  {news.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {news.snippet}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">{news.source}</span>
                <button
                  onClick={() => onNavigateToChat(`Explique com detalhes técnicos o impacto desta notícia: "${news.title}"`)}
                  className="text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                >
                  Analisar no AODA
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
