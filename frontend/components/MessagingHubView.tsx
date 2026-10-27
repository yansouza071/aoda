import React, { useState } from 'react';
import { 
  MessageCircle, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Settings2, 
  Clock, 
  PhoneCall, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MessagingTriggerRule, DispatchedMessageLog, UserAccount } from '../types';

interface MessagingHubViewProps {
  user: UserAccount;
  rules: MessagingTriggerRule[];
  onToggleRule: (ruleId: string) => void;
  dispatches: DispatchedMessageLog[];
  onManualDispatch: (channel: 'whatsapp' | 'sms', recipient: string, title: string, text: string) => void;
}

export const MessagingHubView: React.FC<MessagingHubViewProps> = ({
  user,
  rules,
  onToggleRule,
  dispatches,
  onManualDispatch,
}) => {
  const [recipientNumber, setRecipientNumber] = useState('+55 (11) 98765-4321');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [messageText, setMessageText] = useState(
    'Olá! Este é um aviso automático do AODA: O prazo de cura do concreto da Torre A vence hoje às 18:00.'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<string | null>(null);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    await new Promise((r) => setTimeout(r, 900));

    onManualDispatch(
      selectedChannel,
      recipientNumber,
      'Disparo de Teste Manual',
      messageText
    );

    setIsSending(false);
    setSendFeedback(
      `Mensagem transmitida com sucesso via ${selectedChannel === 'whatsapp' ? 'WhatsApp Cloud API' : 'Gateway SMS'} para ${recipientNumber}.`
    );
    setTimeout(() => setSendFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-green-400" />
            Notificações Automáticas: WhatsApp Business API & SMS
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gatilhos em tempo real para avisos de vencimento de prazos de obras, cobranças e alertas de anomalias financeiras.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-green-500/15 text-green-300 border border-green-500/30 font-medium">
            WhatsApp Meta Cloud Verified
          </span>
        </div>
      </div>

      {sendFeedback && (
        <div className="p-3.5 rounded-xl bg-green-950/60 border border-green-500/40 text-xs text-green-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>{sendFeedback}</span>
        </div>
      )}

      {/* Grid: Regras Ativas & Simulador */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Regras de Automação (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Gatilhos de Disparo Automático Ativos
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {rules.filter((r) => r.active).length} ativos
            </span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        rule.channel === 'whatsapp'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {rule.channel}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-200">{rule.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Destinatário padrão: <strong className="text-slate-300">{rule.targetRecipient}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    "{rule.templateMessage}"
                  </p>
                </div>

                <button
                  onClick={() => onToggleRule(rule.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors shrink-0 ${
                    rule.active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rule.active ? 'Ativo' : 'Pausado'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Simulador de Envio Imediato (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Smartphone className="w-4 h-4 text-green-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Simulador de Disparo Direto
            </h3>
          </div>

          <form onSubmit={handleSendTest} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">Canal de Comunicação</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('whatsapp')}
                  className={`py-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    selectedChannel === 'whatsapp'
                      ? 'bg-green-600 text-white border-green-500 shadow-md shadow-green-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('sms')}
                  className={`py-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    selectedChannel === 'sms'
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  SMS Gateway
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Número com DDD (E.164)</label>
              <input
                type="text"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Mensagem Instantânea</label>
              <textarea
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 transition-all disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              {isSending ? 'Transmitindo...' : 'Disparar Notificação'}
            </button>
          </form>
        </div>
      </div>

      {/* Histórico de Disparos em Tempo Real */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Histórico de Mensagens Disparadas
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Últimos registros
          </span>
        </div>

        <div className="space-y-2">
          {dispatches.map((disp) => (
            <div
              key={disp.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    disp.status === 'entregue' ? 'bg-emerald-400' : 'bg-brand-400'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{disp.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{disp.recipient}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-xl">{disp.content}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-emerald-400 font-semibold block capitalize">
                  {disp.status}
                </span>
                <span className="text-[10px] text-slate-500">{disp.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
