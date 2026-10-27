import React, { useState } from 'react';
import { 
  Building2, 
  Users2, 
  UserPlus, 
  ShieldCheck, 
  Webhook, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { TeamMember, UserRole, WebhookAlertConfig, UserAccount } from '../types';
import { notificationService } from '../services/notificationService';

interface TeamGovViewProps {
  user: UserAccount;
  members: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onRemoveMember: (id: string) => void;
  webhooks: WebhookAlertConfig[];
  onAddWebhook: (webhook: WebhookAlertConfig) => void;
  onToggleWebhook: (id: string) => void;
}

export const TeamGovView: React.FC<TeamGovViewProps> = ({
  user,
  members,
  onAddMember,
  onRemoveMember,
  webhooks,
  onAddWebhook,
  onToggleWebhook,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Operador');

  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Ativo',
      joinedDate: 'Hoje',
      lastActive: 'Agora',
    };

    onAddMember(newMember);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleAddWebhookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookName.trim() || !webhookUrl.trim()) return;

    const newWb: WebhookAlertConfig = {
      id: Date.now().toString(),
      name: webhookName,
      endpointUrl: webhookUrl,
      events: ['rotina_executada', 'limiar_calculo_atingido'],
      enabled: true,
      lastTriggered: 'Nunca',
    };

    onAddWebhook(newWb);
    setShowWebhookModal(false);
    setWebhookName('');
    setWebhookUrl('');
  };

  const handleTestWebhook = async (wb: WebhookAlertConfig) => {
    setDispatchStatus(`Enviando disparo teste para ${wb.name}...`);
    const res = await notificationService.triggerWebhook(wb, 'teste_manual_aoda', {
      empresa: user.companyName,
      cnpj: user.identifier,
      autor: user.name,
      mensagem: 'Teste de conectividade de alertas em tempo real AODA',
    });
    setDispatchStatus(res.message);
    setTimeout(() => setDispatchStatus(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            Gestão Corporativa CNPJ & Governança de Equipe
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empresa: <strong className="text-white">{user.companyName || 'Sua Organização'}</strong> (CNPJ {user.identifier}). Controle de acessos e alertas automatizados.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Convidar Membro
        </button>
      </div>

      {/* Grid: Membros e Permissões */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Membros da Equipe e Níveis de Acesso
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {members.length} colaboradores
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Colaborador</th>
                <th className="pb-3 font-semibold">Nível de Acesso</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Última Atividade</th>
                <th className="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3">
                    <p className="font-semibold text-slate-200">{member.name}</p>
                    <p className="text-[11px] text-slate-500">{member.email}</p>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        member.role === 'Admin'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : member.role === 'Operador'
                          ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">{member.lastActive}</td>
                  <td className="py-3 text-right">
                    {member.role !== 'Admin' && (
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remover acesso"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks & Alertas em Tempo Real */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4 text-cyanic-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Webhooks Personalizados & Notificações Externas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Envie alertas automáticos para Slack, Discord, Zapier ou ERPs quando rotinas e cálculos forem concluídos.
            </p>
          </div>

          <button
            onClick={() => setShowWebhookModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Webhook className="w-3.5 h-3.5 text-cyanic-400" />
            Adicionar Webhook
          </button>
        </div>

        {dispatchStatus && (
          <div className="p-3 rounded-xl bg-brand-950/60 border border-brand-500/40 text-xs text-brand-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>{dispatchStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {webhooks.map((wb) => (
            <div
              key={wb.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-slate-200">{wb.name}</span>
                  <button
                    onClick={() => onToggleWebhook(wb.id)}
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      wb.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {wb.enabled ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate bg-slate-900 p-2 rounded-lg border border-slate-800 mb-3">
                  {wb.endpointUrl}
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {wb.events.map((ev) => (
                    <span key={ev} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500">Último disparo: {wb.lastTriggered}</span>
                <button
                  onClick={() => handleTestWebhook(wb)}
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-medium"
                >
                  <Send className="w-3 h-3" />
                  Testar Disparo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Convidar Membro */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              Convidar Novo Colaborador
            </h3>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="beatriz@suaempresa.com.br"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Nível de Acesso (RBAC)</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Operador">Operador (Executa rotinas, cálculos e chat)</option>
                  <option value="Visualizador">Visualizador (Somente leitura de briefings e relatórios)</option>
                  <option value="Admin">Admin (Controle total de membros, CNPJ e webhooks)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Novo Webhook */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-cyanic-400" />
              Configurar Webhook em Tempo Real
            </h3>

            <form onSubmit={handleAddWebhookSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Nome de Identificação</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Canal Alertas Discord / Slack Ops"
                  value={webhookName}
                  onChange={(e) => setWebhookName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyanic-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">URL de Destino (HTTPS)</label>
                <input
                  type="url"
                  required
                  placeholder="https://discord.com/api/webhooks/... ou https://hooks.zapier.com/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyanic-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyanic-600 hover:bg-cyanic-500 text-white text-xs font-semibold"
                >
                  Salvar Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
