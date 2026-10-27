import React from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Calculator, 
  Cpu, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export const DashboardView: React.FC = () => {
  // Metric: Horas em Reuniões por Categoria
  const meetingCategoryData = [
    { categoria: 'Técnica & Eng.', horas: 14.5 },
    { categoria: 'Financeiro', horas: 8.0 },
    { categoria: 'Alinhamento', horas: 6.5 },
    { categoria: 'Clientes', horas: 11.2 },
    { categoria: 'Governança', horas: 4.0 },
  ];

  // Metric: Volume de Cálculos Brutos Realizados por Semana
  const calculationVolumeData = [
    { semana: 'Sem 1', financas: 24, engenharia: 18, estatistica: 9 },
    { semana: 'Sem 2', financas: 32, engenharia: 29, estatistica: 14 },
    { semana: 'Sem 3', financas: 45, engenharia: 38, estatistica: 21 },
    { semana: 'Sem 4', financas: 58, engenharia: 42, estatistica: 28 },
  ];

  // Metric: Distribuição de Prioridades na Agenda
  const priorityDistribution = [
    { name: 'Crítica / Alta', value: 35 },
    { name: 'Média Importância', value: 45 },
    { name: 'Normal / Baixa', value: 20 },
  ];

  // Metric: Tópicos Tecnológicos mais Consultados no AODA
  const topTechTopics = [
    { topico: 'Agentes Multimodais', consultas: 142 },
    { topico: 'Cálculo de Obras & Plantas', consultas: 98 },
    { topico: 'Scripts Python & Conciliação', consultas: 87 },
    { topico: 'Otimização Fiscal CNPJ', consultas: 76 },
    { topico: 'Segurança LGPD / ISO', consultas: 64 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pink-400" />
            Dashboard Analítico de Uso & Inteligência Operacional
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Métricas de produtividade, reuniões, cálculos brutos processados e temas mais requisitados.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-medium self-start sm:self-auto">
          Telemetria em Tempo Real
        </span>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Horas Reunião</span>
            <div className="text-2xl font-bold text-white mt-1">44.2h</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +12% vs mês anterior
            </span>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Cálculos Processados</span>
            <div className="text-2xl font-bold text-white mt-1">324</div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> 99.8% precisão auditada
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Prazos Concluídos</span>
            <div className="text-2xl font-bold text-white mt-1">89%</div>
            <span className="text-[11px] text-brand-400 flex items-center gap-1 mt-1">
              No prazo estipulado
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyanic-500/10 text-cyanic-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Interações de Voz</span>
            <div className="text-2xl font-bold text-white mt-1">178</div>
            <span className="text-[11px] text-purple-400 flex items-center gap-1 mt-1">
              Web Speech API
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horas em Reuniões por Categoria */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              Horas Dedicadas a Reuniões por Categoria
            </h3>
            <span className="text-xs text-slate-500 font-mono">Total 44.2h</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={meetingCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="categoria" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="horas" fill="#38bdf8" radius={[6, 6, 0, 0]} name="Horas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume de Cálculos Brutos */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Volume de Cálculos Brutos por Semana
            </h3>
            <span className="text-xs text-slate-500">Últimos 30 dias</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calculationVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="semana" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="financas" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.3} name="Finanças" />
                <Area type="monotone" dataKey="engenharia" stackId="1" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.3} name="Engenharia" />
                <Area type="monotone" dataKey="estatistica" stackId="1" stroke="#c084fc" fill="#c084fc" fillOpacity={0.3} name="Estatística" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição de Prioridades */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Distribuição de Prioridades na Agenda
            </h3>
            <span className="text-xs text-slate-500">Tarefas & Compromissos</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie data={priorityDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                  {priorityDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tópicos Tecnológicos mais Consultados */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyanic-400" />
              Tópicos Tecnológicos Mais Consultados
            </h3>
            <span className="text-xs text-slate-500">Ranking IA</span>
          </div>
          <div className="space-y-3 pt-2">
            {topTechTopics.map((item, idx) => (
              <div key={item.topico} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">
                    {idx + 1}. {item.topico}
                  </span>
                  <span className="text-slate-400 font-mono">{item.consultas} consultas</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-brand-500 to-cyanic-400 h-full rounded-full"
                    style={{ width: `${(item.consultas / 150) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
