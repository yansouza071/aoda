import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { BriefingView } from './components/BriefingView';
import { ChatView } from './components/ChatView';
import { FashionRetailView } from './components/FashionRetailView';
import { CalculationsView } from './components/CalculationsView';
import { DevHubView } from './components/DevHubView';
import { RoutinesView } from './components/RoutinesView';
import { DashboardView } from './components/DashboardView';
import { TeamGovView } from './components/TeamGovView';
import { AuditLogsView } from './components/AuditLogsView';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { CloudSyncView } from './components/CloudSyncView';
import { BdiBudgetView } from './components/BdiBudgetView';
import { CalendarScheduleView } from './components/CalendarScheduleView';
import { MessagingHubView } from './components/MessagingHubView';
import { AuthModal } from './components/AuthModal';

import { 
  UserAccount, 
  DailyBriefing, 
  ChatMessage, 
  IntelligentRoutine, 
  TeamMember, 
  WebhookAlertConfig,
  AppNotification,
  AuditLogEntry,
  CloudStorageConnection,
  SyncedCloudFile,
  MessagingTriggerRule,
  DispatchedMessageLog
} from './types';
import { speechService } from './services/speechService';
import { notificationService } from './services/notificationService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('briefing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState(true);
  const [isDictatingGlobal, setIsDictatingGlobal] = useState(false);

  // User account state
  const [user, setUser] = useState<UserAccount>({
    id: 'usr_1',
    name: 'Rodrigo Albuquerque',
    email: 'rodrigo@aoda.tech',
    type: 'PJ',
    identifier: '34.892.401/0001-72',
    companyName: 'AODA Moda & Gestão Corporativa',
    role: 'Admin',
    securityLevel: 'Segurança Corporativa ISO/IEC 27001',
    encryptedVaultCount: 48,
  });

  // Messaging Rules State (WhatsApp / SMS)
  const [messagingRules, setMessagingRules] = useState<MessagingTriggerRule[]>([
    {
      id: 'rule_1',
      name: 'Vencimento de Prazos de Obra e Concretagem',
      event: 'prazo_obra_vencimento',
      channel: 'whatsapp',
      targetRecipient: '+55 (11) 98765-4321',
      templateMessage: 'Alerta AODA: Prazo crítico de inspeção estrutural expira em menos de 4 horas.',
      active: true,
    },
    {
      id: 'rule_2',
      name: 'Anomalia Orçamentária / Desvio de BDI > 5%',
      event: 'anomalia_orcamento',
      channel: 'whatsapp',
      targetRecipient: '+55 (11) 99123-8899',
      templateMessage: 'Aviso Fiscal: O custo direto de insumos ultrapassou a margem de contingência configurada.',
      active: true,
    },
    {
      id: 'rule_3',
      name: 'Confirmação de Conclusão de Rotina Noturna',
      event: 'rotina_concluida',
      channel: 'sms',
      targetRecipient: '+55 (11) 98765-4321',
      templateMessage: 'AODA: Rotina matinal executada. Sem conflitos na agenda.',
      active: false,
    },
  ]);

  // Message Dispatch Logs
  const [messageDispatches, setMessageDispatches] = useState<DispatchedMessageLog[]>([
    {
      id: 'disp_1',
      timestamp: 'Hoje, 07:35',
      channel: 'whatsapp',
      recipient: '+55 (11) 98765-4321',
      title: 'Aviso de Reposição Calças Jeans e Croppeds',
      content: 'Estoque mínimo atingido para bermudas e croppeds. Sugerido pedido ao fornecedor.',
      status: 'entregue',
      triggerEvent: 'anomalia_orcamento',
    },
  ]);

  // Audit Logs (LGPD compliant trails)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log_1',
      timestamp: '2025-05-24 08:00:15',
      actorName: 'Rodrigo Albuquerque',
      actorIdentifier: '34.892.401/0001-72',
      category: 'login_autenticacao',
      description: 'Autenticação com chave criptográfica e verificação 2FA realizada',
      targetResource: 'Sessão Corporativa AODA',
      ipAddress: '189.40.12.84',
      riskLevel: 'Baixo',
      lgpdCompliant: true,
    },
    {
      id: 'log_2',
      timestamp: '2025-05-24 08:15:32',
      actorName: 'Mariana Duarte',
      actorIdentifier: 'Operador ID #15',
      category: 'gestao_varejo_moda',
      description: 'Consulta da margem financeira de vestuário feminino e exportação de planilha',
      targetResource: 'planilha_vestuario_feminino.csv',
      ipAddress: '177.135.90.11',
      riskLevel: 'Baixo',
      lgpdCompliant: true,
    },
  ]);

  // Cloud Storage Connections
  const [cloudConnections, setCloudConnections] = useState<CloudStorageConnection[]>([
    {
      provider: 'google_drive',
      name: 'Google Drive Corporativo',
      connected: true,
      accountEmail: 'arquivos@aoda.tech',
      storageUsedGb: 14.2,
      storageTotalGb: 100,
      autoSyncUploads: true,
      syncFolder: '/AODA_Moda_e_Planilhas',
      lastSyncedAt: 'Há 5 minutos',
    },
    {
      provider: 'onedrive',
      name: 'Microsoft OneDrive',
      connected: true,
      accountEmail: 'rodrigo.albuquerque@empresa.com.br',
      storageUsedGb: 28.5,
      storageTotalGb: 1000,
      autoSyncUploads: true,
      syncFolder: '/Relatorios_Vendas_AODA',
      lastSyncedAt: 'Há 22 minutos',
    },
  ]);

  // Synced files
  const [syncedFiles, setSyncedFiles] = useState<SyncedCloudFile[]>([
    {
      id: 'f1',
      provider: 'google_drive',
      fileName: 'Planilha_Estoque_Vestuario_Feminino.xlsx',
      fileSize: '2.4 MB',
      folderPath: '/AODA_Moda_e_Planilhas/Estoque',
      uploadedAt: 'Hoje, 07:45',
      mimeType: 'application/vnd.ms-excel',
      type: 'calculo',
    },
  ]);

  // Daily Briefing state
  const [briefing, setBriefing] = useState<DailyBriefing>({
    date: 'Quarta-feira, 24 de Maio de 2025',
    greeting: 'Bom dia',
    weather: {
      temp: 24,
      condition: 'Parcialmente Nublado',
      city: 'São Paulo, SP',
    },
    quote: 'A melhor maneira de prever o futuro é inventá-lo com inteligência e disciplina.',
    appointments: [
      {
        id: 'app_1',
        time: '09:30',
        title: 'Alinhamento com Confecções de Calças Jeans & Vestidos',
        category: 'Cliente',
        priority: 'Alta',
        completed: false,
      },
      {
        id: 'app_2',
        time: '14:00',
        title: 'Apresentação de Margens e DRE da Loja Feminina',
        category: 'Financeiro',
        priority: 'Alta',
        completed: false,
      },
    ],
    pendingTasks: [
      {
        id: 'task_1',
        title: 'Repor lote de Bermudas Ciclista e Croppeds no estoque',
        deadline: 'Hoje, 18h',
        priority: 'Alta',
        done: false,
      },
      {
        id: 'task_2',
        title: 'Conciliar faturas fiscais dos fornecedores têxteis',
        deadline: 'Amanhã',
        priority: 'Média',
        done: false,
      },
    ],
    techNews: [
      {
        id: 'news_1',
        title: 'Inteligência Artificial revoluciona precificação dinâmica no varejo de moda',
        source: 'AODA Tech Radar',
        snippet: 'Algoritmos preditivos ajustam markups de coleções de vestuário e reduzem estoques ociosos.',
        tag: 'Varejo & IA',
        timestamp: 'Hoje, 07:10',
      },
    ],
  });

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'aoda',
      text: 'Olá! Sou o AODA. Agora com o módulo completo de Vestuário Feminino: análise de margens financeiras, faturamento, gastos, custos de aquisição e entradas/saídas de calças jeans, vestidos, croppeds, saias e bermudas.',
      timestamp: '08:00',
    },
  ]);

  // Routines state
  const [routines, setRoutines] = useState<IntelligentRoutine[]>([
    {
      id: 'rout_1',
      title: 'Auditoria Matinal: Finanças + Agenda + Notícias',
      description: 'Executa projeção de fluxo de caixa, valida compromissos pendentes e emite resumo analítico.',
      triggerPrompt: 'Executar auditoria matinal completa',
      isShared: true,
      status: 'idle',
      lastRun: 'Hoje, 07:30',
      actions: [
        { id: 'a1', type: 'calc_financial', title: 'Cálculo de Projeção de Faturamento', params: {} },
        { id: 'a2', type: 'schedule_calendar', title: 'Revisão de Conflitos na Agenda', params: {} },
        { id: 'a3', type: 'generate_tech_digest', title: 'Curadoria de Notícias com IA', params: {} },
      ],
    },
  ]);

  // Team members for CNPJ
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 'tm_1',
      name: 'Rodrigo Albuquerque',
      email: 'rodrigo@aoda.tech',
      role: 'Admin',
      status: 'Ativo',
      joinedDate: '01/01/2024',
      lastActive: 'Agora',
    },
    {
      id: 'tm_2',
      name: 'Mariana Duarte',
      email: 'mariana.duarte@aoda.tech',
      role: 'Operador',
      status: 'Ativo',
      joinedDate: '15/02/2024',
      lastActive: 'Há 12 min',
    },
  ]);

  // Webhooks
  const [webhooks, setWebhooks] = useState<WebhookAlertConfig[]>([
    {
      id: 'wb_1',
      name: 'Canal de Operações Varejo (Slack/Discord)',
      endpointUrl: 'https://hooks.zapier.com/hooks/catch/12345/aoda-ops',
      events: ['rotina_executada', 'limiar_calculo_atingido'],
      enabled: true,
      lastTriggered: 'Hoje, 08:15',
    },
  ]);

  // App notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: 'Briefing Matinal Disponível',
      message: 'Seu resumo do dia e previsão do tempo estão prontos.',
      time: '07:30',
      type: 'info',
      read: false,
    },
  ]);

  useEffect(() => {
    notificationService.requestPermission();
  }, []);

  const recordAudit = (
    category: AuditLogEntry['category'], 
    desc: string, 
    resource: string, 
    risk: 'Baixo' | 'Médio' | 'Crítico' = 'Baixo'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: user.name,
      actorIdentifier: user.identifier,
      category,
      description: desc,
      targetResource: resource,
      ipAddress: '189.40.12.84',
      riskLevel: risk,
      lgpdCompliant: true,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const handleToggleVoice = () => {
    const nextState = !voiceOutputActive;
    setVoiceOutputActive(nextState);
    speechService.toggleVoice(nextState);
  };

  const handleStartGlobalDictation = () => {
    if (!speechService.isSupported()) {
      alert('Reconhecimento de voz Web Speech não suportado neste navegador.');
      return;
    }
    setIsDictatingGlobal(true);
    speechService.startListening(
      (text, isFinal) => {
        if (isFinal && text) {
          setIsDictatingGlobal(false);
          setCurrentTab('chat');
          const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, newMsg]);
          recordAudit('acesso_documento', `Comando de voz processado: "${text.slice(0, 30)}..."`, 'Motor de Voz AODA');
        }
      },
      () => setIsDictatingGlobal(false),
      () => setIsDictatingGlobal(false)
    );
  };

  const handleStopGlobalDictation = () => {
    speechService.stopListening();
    setIsDictatingGlobal(false);
  };

  const handleManualDispatchMessaging = (
    channel: 'whatsapp' | 'sms',
    recipient: string,
    title: string,
    text: string
  ) => {
    const newLog: DispatchedMessageLog = {
      id: `msg_${Date.now()}`,
      timestamp: 'Agora',
      channel,
      recipient,
      title,
      content: text,
      status: 'entregue',
      triggerEvent: 'disparo_manual',
    };

    setMessageDispatches((prev) => [newLog, ...prev]);
    recordAudit('disparo_whatsapp_sms', `Disparo ${channel.toUpperCase()} para ${recipient}: ${title}`, recipient);
  };

  const handleToggleMessagingRule = (ruleId: string) => {
    setMessagingRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const handleSendPromptToAoda = (promptText: string) => {
    setCurrentTab('chat');
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    recordAudit('gestao_varejo_moda', 'Consulta analítica de vestuário feminino disparada ao AODA', 'Chat Neural');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        user={user}
        onSwitchAccountType={() => setIsAuthModalOpen(true)}
        voiceEnabled={voiceOutputActive}
        onToggleVoice={handleToggleVoice}
        isListening={isDictatingGlobal}
        onStartListening={handleStartGlobalDictation}
        onStopListening={handleStopGlobalDictation}
        notifications={notifications}
        onMarkNotificationAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-3 sm:p-4 gap-4">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          user={user}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 min-w-0">
          {currentTab === 'briefing' && (
            <BriefingView
              user={user}
              briefing={briefing}
              onToggleTask={(id) =>
                setBriefing((prev) => ({
                  ...prev,
                  pendingTasks: prev.pendingTasks.map((t) =>
                    t.id === id ? { ...t, done: !t.done } : t
                  ),
                }))
              }
              onToggleAppointment={(id) =>
                setBriefing((prev) => ({
                  ...prev,
                  appointments: prev.appointments.map((a) =>
                    a.id === id ? { ...a, completed: !a.completed } : a
                  ),
                }))
              }
              onNavigateToChat={(prompt) => {
                setCurrentTab('chat');
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    sender: 'user',
                    text: prompt,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
            />
          )}

          {currentTab === 'chat' && (
            <ChatView
              user={user}
              messages={messages}
              onSendMessage={(msg) => {
                setMessages((prev) => [...prev, msg]);
                if (msg.attachment) {
                  recordAudit('acesso_documento', `Upload e OCR do anexo: ${msg.attachment.name}`, msg.attachment.name);
                }
              }}
              voiceActive={voiceOutputActive}
            />
          )}

          {currentTab === 'fashion_retail' && (
            <FashionRetailView
              user={user}
              onSendPromptToAoda={handleSendPromptToAoda}
              onLogAudit={(act, target) => recordAudit('gestao_varejo_moda', act, target)}
              onSendAlertWhatsApp={(title, msg) => {
                handleManualDispatchMessaging('whatsapp', '+55 (11) 98765-4321', title, msg);
              }}
            />
          )}

          {currentTab === 'bdi_budget' && (
            <BdiBudgetView
              user={user}
              onLogAudit={(act, target) => recordAudit('calculo_bdi', act, target)}
              onSendAlertWhatsApp={(title, msg) => {
                handleManualDispatchMessaging('whatsapp', '+55 (11) 98765-4321', title, msg);
              }}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarScheduleView
              user={user}
              onLogAudit={(act, target) => recordAudit('alteracao_permissao', act, target)}
              onSendWhatsApp={(title, msg) => {
                handleManualDispatchMessaging('whatsapp', '+55 (11) 98765-4321', title, msg);
              }}
            />
          )}

          {currentTab === 'messaging' && (
            <MessagingHubView
              user={user}
              rules={messagingRules}
              onToggleRule={handleToggleMessagingRule}
              dispatches={messageDispatches}
              onManualDispatch={handleManualDispatchMessaging}
            />
          )}

          {currentTab === 'calculations' && <CalculationsView />}

          {currentTab === 'devhub' && <DevHubView user={user} />}

          {currentTab === 'routines' && (
            <RoutinesView
              routines={routines}
              onExecuteRoutine={async (id) => {
                await new Promise((r) => setTimeout(r, 1200));
                recordAudit('execucao_rotina', `Rotina ID ${id} disparada`, id);
              }}
              onCreateRoutine={(r) => {
                setRoutines((prev) => [r, ...prev]);
                recordAudit('alteracao_permissao', `Criação da rotina: ${r.title}`, r.title);
              }}
              isCorporate={user.type === 'PJ'}
            />
          )}

          {currentTab === 'dashboard' && <DashboardView />}

          {currentTab === 'reports' && (
            <ExecutiveReportView
              user={user}
              briefing={briefing}
              auditLogs={auditLogs}
              onLogAuditAction={(act, target) => recordAudit('exportacao_dados', act, target)}
            />
          )}

          {currentTab === 'cloud' && (
            <CloudSyncView
              connections={cloudConnections}
              syncedFiles={syncedFiles}
              onToggleConnection={(provider) => {
                setCloudConnections((prev) =>
                  prev.map((c) => (c.provider === provider ? { ...c, connected: !c.connected } : c))
                );
              }}
              onImportFileToChat={(file) => {
                setCurrentTab('chat');
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    sender: 'user',
                    text: `Analise o arquivo da nuvem (${file.fileName}). Calcule metragens para BDI, margens comerciais e orçamentos.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              onUploadFileToCloud={(f) => setSyncedFiles((prev) => [f, ...prev])}
            />
          )}

          {currentTab === 'audit' && (
            <AuditLogsView
              logs={auditLogs}
              user={user}
            />
          )}

          {currentTab === 'team' && user.type === 'PJ' && (
            <TeamGovView
              user={user}
              members={teamMembers}
              onAddMember={(m) => setTeamMembers((prev) => [...prev, m])}
              onRemoveMember={(id) => setTeamMembers((prev) => prev.filter((m) => m.id !== id))}
              webhooks={webhooks}
              onAddWebhook={(w) => setWebhooks((prev) => [...prev, w])}
              onToggleWebhook={(id) => {
                setWebhooks((prev) =>
                  prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
                );
              }}
            />
          )}
        </main>
      </div>

      {/* Account / Vault Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          recordAudit(
            'login_autenticacao',
            `Alternância de perfil operacional para ${updated.type} (${updated.identifier})`,
            updated.identifier
          );
        }}
      />
    </div>
  );
}
