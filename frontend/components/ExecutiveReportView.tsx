import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckSquare, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  ShieldCheck,
  Building2,
  Sliders,
  Eye
} from 'lucide-react';
import { 
  DailyBriefing, 
  UserAccount, 
  ExecutiveReportConfig, 
  AuditLogEntry 
} from '../types';

interface ExecutiveReportViewProps {
  user: UserAccount;
  briefing: DailyBriefing;
  auditLogs: AuditLogEntry[];
  onLogAuditAction?: (action: string, target: string) => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  user,
  briefing,
  auditLogs,
  onLogAuditAction,
}) => {
  const [config, setConfig] = useState<ExecutiveReportConfig>({
    title: 'Relatório Executivo de Inteligência & Operações',
    subtitle: 'Consolidação de Produtividade, Cálculos Brutos e Compliance AODA',
    period: 'Ciclo Vigente — Maio / 2025',
    companyName: user.companyName || 'Organização Pessoal',
    authorName: `${user.name} (${user.role})`,
    includeBriefing: true,
    includeFinancialProjections: true,
    includeDashboardMetrics: true,
    includeAuditTrail: true,
    includeReceiptsSummary: true,
    notes: 'Documento gerado automaticamente pelo motor cognitivo AODA em conformidade com as diretrizes de governança e segurança corporativa.',
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handlePrint = () => {
    if (onLogAuditAction) {
      onLogAuditAction('Exportação de Relatório Executivo PDF', 'Relatorio_Executivo_AODA.pdf');
    }
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Configuration Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Gerador de Relatórios Executivos em PDF
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compile briefings, projeções financeiras, métricas e auditorias em um documento oficial formatado para impressão ou exportação em PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-cyanic-400" />
            {previewMode ? 'Modo Edição' : 'Visualizar Folha A4'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* Customizer Panel (Hidden on Print) */}
      {!previewMode && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 print:hidden">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-slate-200">Personalizar Cabeçalho e Seções do Relatório</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Título do Relatório</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Subtítulo / Escopo</label>
              <input
                type="text"
                value={config.subtitle}
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Período de Referência</label>
              <input
                type="text"
                value={config.period}
                onChange={(e) => setConfig({ ...config, period: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Section Toggles */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Seções a incluir na compilação
            </span>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeBriefing}
                  onChange={(e) => setConfig({ ...config, includeBriefing: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                Briefing Matinal & Compromissos
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeFinancialProjections}
                  onChange={(e) => setConfig({ ...config, includeFinancialProjections: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                Cálculos Brutos & Projeções
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeDashboardMetrics}
                  onChange={(e) => setConfig({ ...config, includeDashboardMetrics: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                Métricas de Produtividade
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeAuditTrail}
                  onChange={(e) => setConfig({ ...config, includeAuditTrail: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                Trilha de Auditoria LGPD
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Printable Sheet View (A4 Paper emulation in UI and pure print styles) */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto border border-slate-300 print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700 mb-1">
              <Building2 className="w-4 h-4" />
              <span>{config.companyName}</span>
              <span>•</span>
              <span>{user.type === 'PJ' ? `CNPJ: ${user.identifier}` : `CPF: ${user.identifier}`}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              {config.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1">{config.subtitle}</p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5 shrink-0">
            <p><strong>Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Período:</strong> {config.period}</p>
            <p><strong>Responsável:</strong> {config.authorName}</p>
          </div>
        </div>

        {/* Section 1: Briefing & Prazos Críticos */}
        {config.includeBriefing && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-700" />
              1. Resumo Executivo & Agenda Operacional
            </h2>
            <p className="text-xs text-slate-700 mb-3 leading-relaxed">
              Consolidação matinal de compromissos técnicos e tarefas prioritárias registradas no AODA:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-bold text-slate-800 uppercase block mb-1">
                  Compromissos Agendados ({briefing.appointments.length})
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {briefing.appointments.map((a) => (
                    <li key={a.id} className="flex justify-between">
                      <span>• {a.title}</span>
                      <strong className="text-slate-800">{a.time}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-bold text-slate-800 uppercase block mb-1">
                  Tarefas Críticas Pendentes ({briefing.pendingTasks.filter((t) => !t.done).length})
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {briefing.pendingTasks.map((t) => (
                    <li key={t.id} className="flex justify-between">
                      <span>{t.done ? '✓' : '○'} {t.title}</span>
                      <span className="text-[11px] text-slate-500">{t.deadline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Cálculos Brutos & Projeções */}
        {config.includeFinancialProjections && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              2. Projeções Financeiras & Análise de Custos
            </h2>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Aporte Mensal Simulado</span>
                  <span className="font-bold text-slate-800 text-sm">R$ 1.500,00</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Taxa Referencial</span>
                  <span className="font-bold text-slate-800 text-sm">11.5% a.a.</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-100">
                  <span className="text-slate-500 block text-[10px]">Horizonte Projetado</span>
                  <span className="font-bold text-slate-800 text-sm">24 Meses</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                A estimativa matemática gerada pelo motor do AODA indica estabilidade nos desembolsos de capital operacional com TIR estimada em 14.2% ao ano e reserva de segurança para notas fiscais técnicas.
              </p>
            </div>
          </section>
        )}

        {/* Section 3: Métricas de Desempenho */}
        {config.includeDashboardMetrics && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-700" />
              3. Telemetria Operacional & Eficiência
            </h2>

            <div className="grid grid-cols-4 gap-3 text-xs mb-3">
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Horas em Reuniões</span>
                <span className="text-lg font-bold text-slate-900">44.2h</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Cálculos Executados</span>
                <span className="text-lg font-bold text-slate-900">324</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Conclusão no Prazo</span>
                <span className="text-lg font-bold text-slate-900">89%</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[10px] block">Consultas Neurais</span>
                <span className="text-lg font-bold text-slate-900">178</span>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Auditoria LGPD */}
        {config.includeAuditTrail && (
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-700" />
              4. Parecer de Conformidade & Trilha LGPD
            </h2>

            <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="p-2">Data/Hora</th>
                  <th className="p-2">Operador</th>
                  <th className="p-2">Recurso</th>
                  <th className="p-2">IP Registrado</th>
                  <th className="p-2">Status LGPD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {auditLogs.slice(0, 4).map((log) => (
                  <tr key={log.id}>
                    <td className="p-2 font-mono">{log.timestamp}</td>
                    <td className="p-2 font-medium text-slate-800">{log.actorName}</td>
                    <td className="p-2 truncate max-w-[150px]">{log.targetResource}</td>
                    <td className="p-2 font-mono">{log.ipAddress}</td>
                    <td className="p-2 font-bold text-emerald-700">Auditado</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Signatures & Corporate Footer */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
              {config.authorName}
            </div>
            <span>Responsável Operacional</span>
          </div>

          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
              Núcleo Neural AODA Pro v2.5
            </div>
            <span>Assinatura Digital Criptografada</span>
          </div>
        </div>
      </div>
    </div>
  );
};
