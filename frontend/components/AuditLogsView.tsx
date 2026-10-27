import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  Lock, 
  Globe, 
  Clock, 
  UserCheck, 
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry, AuditActionCategory, UserAccount } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  user: UserAccount;
  onRefreshLogs?: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, user, onRefreshLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);

    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || log.riskLevel === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const handleExportCSV = () => {
    const headers = 'ID,Data/Hora,Responsavel,CPF_CNPJ,Categoria,Recurso,IP,Risco,Conforme_LGPD,Descricao\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorIdentifier}","${l.category}","${l.targetResource}","${l.ipAddress}","${l.riskLevel}","${l.lgpdCompliant ? 'SIM' : 'NAO'}","${l.description.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aoda_audit_lgpd_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const criticalCount = logs.filter((l) => l.riskLevel === 'Crítico').length;
  const compliantCount = logs.filter((l) => l.lgpdCompliant).length;
  const complianceRate = logs.length > 0 ? Math.round((compliantCount / logs.length) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-rose-400" />
            Trilhas de Auditoria & Conformidade LGPD (Art. 37)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registro imutável de acessos a dados sensíveis, alterações cadastrais, transferências de arquivos e comandos neurais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            Exportar CSV Audit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total de Eventos Auditados</span>
            <div className="text-2xl font-bold text-white mt-1">{logs.length}</div>
            <span className="text-[11px] text-brand-400">Armazenamento Criptografado</span>
          </div>
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Índice de Conformidade LGPD</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{complianceRate}%</div>
            <span className="text-[11px] text-emerald-500">Sem vazamentos ou infrações</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Eventos de Atenção</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{criticalCount}</div>
            <span className="text-[11px] text-slate-400">Elevações de privilégio</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Isolamento Ativo</span>
            <div className="text-xs font-bold text-white mt-2 truncate max-w-[150px]">
              {user.type === 'PJ' ? `CNPJ ${user.identifier}` : `CPF ${user.identifier}`}
            </div>
            <span className="text-[10px] text-indigo-400">{user.securityLevel}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por operador, documento, IP ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="all">Todas as Categorias</option>
            <option value="acesso_documento">Acesso a Documentos / Plantas</option>
            <option value="alteracao_permissao">Alteração de Permissões</option>
            <option value="execucao_rotina">Execução de Rotinas</option>
            <option value="exportacao_dados">Exportação de Relatórios</option>
            <option value="login_autenticacao">Autenticações / Sessões</option>
            <option value="webhook_disparo">Disparo de Webhooks</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="all">Todos os Riscos</option>
            <option value="Baixo">Risco Baixo</option>
            <option value="Médio">Risco Médio</option>
            <option value="Crítico">Risco Crítico</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Data / Hora</th>
                <th className="py-3 px-4 font-semibold">Operador / Autor</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold">Recurso / Alvo</th>
                <th className="py-3 px-4 font-semibold">IP Origem</th>
                <th className="py-3 px-4 font-semibold">Risco</th>
                <th className="py-3 px-4 font-semibold">LGPD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    Nenhum registro de auditoria corresponde aos filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{log.actorName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{log.actorIdentifier}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-300 font-medium">
                        {log.category === 'acesso_documento' && '📄 Acesso a Arquivo'}
                        {log.category === 'alteracao_permissao' && '🔑 Permissão'}
                        {log.category === 'execucao_rotina' && '⚡ Rotina IA'}
                        {log.category === 'exportacao_dados' && '📥 Exportação'}
                        {log.category === 'login_autenticacao' && '🛡️ Sessão'}
                        {log.category === 'webhook_disparo' && '🌐 Webhook'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-brand-300 truncate max-w-[200px] block" title={log.targetResource}>
                        {log.targetResource}
                      </span>
                      <span className="text-[10px] text-slate-500">{log.description}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-slate-600" />
                        <span>{log.ipAddress}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          log.riskLevel === 'Crítico'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : log.riskLevel === 'Médio'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.lgpdCompliant ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" /> Conforme
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" /> Revisar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
