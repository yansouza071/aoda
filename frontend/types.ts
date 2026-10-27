export type UserType = 'PF' | 'PJ';

export type UserRole = 'Admin' | 'Operador' | 'Visualizador';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  type: UserType;
  identifier: string; // CPF or CNPJ
  companyName?: string;
  role: UserRole;
  avatarUrl?: string;
  securityLevel: 'Alta Proteção LGPD' | 'Segurança Corporativa ISO/IEC 27001';
  encryptedVaultCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Ativo' | 'Pendente' | 'Inativo';
  joinedDate: string;
  lastActive: string;
}

export interface ChartDataPayload {
  title: string;
  type: 'line' | 'bar' | 'area' | 'pie';
  xAxisKey: string;
  data: Array<Record<string, any>>;
  seriesKeys: string[];
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'aoda';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: 'image' | 'document';
    previewUrl: string;
    extractedSummary?: string;
  };
  chart?: ChartDataPayload;
  codeSnippet?: {
    code: string;
    language: string;
  };
  actionTags?: string[];
}

export interface DailyBriefing {
  date: string;
  greeting: string;
  weather: {
    temp: number;
    condition: string;
    city: string;
  };
  quote: string;
  appointments: Array<{
    id: string;
    time: string;
    title: string;
    category: 'Reunião' | 'Técnica' | 'Financeiro' | 'Cliente';
    priority: 'Alta' | 'Média' | 'Normal';
    completed: boolean;
  }>;
  pendingTasks: Array<{
    id: string;
    title: string;
    deadline: string;
    priority: 'Alta' | 'Média' | 'Baixa';
    done: boolean;
  }>;
  techNews: Array<{
    id: string;
    title: string;
    source: string;
    snippet: string;
    tag: string;
    timestamp: string;
  }>;
}

export interface RoutineAction {
  id: string;
  type: 'calc_financial' | 'schedule_calendar' | 'generate_tech_digest' | 'trigger_webhook' | 'ocr_extract';
  title: string;
  params: Record<string, any>;
}

export interface IntelligentRoutine {
  id: string;
  title: string;
  description: string;
  triggerPrompt: string;
  isShared: boolean;
  actions: RoutineAction[];
  lastRun?: string;
  status: 'idle' | 'running' | 'success';
}

export interface WebhookAlertConfig {
  id: string;
  name: string;
  endpointUrl: string;
  events: ('tarefa_concluida' | 'limiar_calculo_atingido' | 'rotina_executada' | 'alerta_seguranca')[];
  enabled: boolean;
  lastTriggered?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
}

// ---- AUDIT & LGPD CONFORMANCE ----
export type AuditActionCategory = 
  | 'acesso_documento' 
  | 'alteracao_permissao' 
  | 'execucao_rotina' 
  | 'exportacao_dados' 
  | 'login_autenticacao' 
  | 'webhook_disparo'
  | 'disparo_whatsapp_sms'
  | 'calculo_bdi'
  | 'gestao_varejo_moda';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorIdentifier: string; // CPF or CNPJ
  category: AuditActionCategory;
  description: string;
  targetResource: string;
  ipAddress: string;
  riskLevel: 'Baixo' | 'Médio' | 'Crítico';
  lgpdCompliant: boolean;
  details?: Record<string, any>;
}

// ---- EXECUTIVE REPORT (PDF) ----
export interface ExecutiveReportConfig {
  title: string;
  subtitle: string;
  period: string;
  companyName: string;
  authorName: string;
  includeBriefing: boolean;
  includeFinancialProjections: boolean;
  includeDashboardMetrics: boolean;
  includeAuditTrail: boolean;
  includeReceiptsSummary: boolean;
  notes: string;
}

// ---- CLOUD STORAGE INTEGRATION ----
export type CloudProviderId = 'google_drive' | 'onedrive' | 'dropbox';

export interface CloudStorageConnection {
  provider: CloudProviderId;
  name: string;
  connected: boolean;
  accountEmail?: string;
  storageUsedGb: number;
  storageTotalGb: number;
  autoSyncUploads: boolean;
  syncFolder: string;
  lastSyncedAt?: string;
}

export interface SyncedCloudFile {
  id: string;
  provider: CloudProviderId;
  fileName: string;
  fileSize: string;
  folderPath: string;
  uploadedAt: string;
  mimeType: string;
  type: 'planta' | 'recibo' | 'calculo' | 'relatorio';
}

// ---- BDI & CONSTRUCTION ESTIMATES ----
export interface CostCategoryItem {
  id: string;
  name: string;
  category: 'mao_de_obra' | 'materiais' | 'equipamentos' | 'servicos';
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
}

export interface BdiParameters {
  administrationFeePct: number;
  financialCostPct: number;
  risksContingencyPct: number;
  insuranceWarrantyPct: number;
  profitMarginPct: number;
  taxesTributosPct: number;
}

// ---- CALENDAR & TIME BLOCKING ----
export type CalendarEventType = 'reuniao' | 'obra_tecnica' | 'bloqueio_foco' | 'cliente' | 'financeiro';

export interface CalendarEvent {
  id: string;
  title: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  location?: string;
  attendeesCount?: number;
  isFocusBlock?: boolean;
  hasConflict?: boolean;
  conflictWithTitle?: string;
}

// ---- WHATSAPP & SMS BUSINESS MESSAGING ----
export type MessageChannel = 'whatsapp' | 'sms';

export interface MessagingTriggerRule {
  id: string;
  name: string;
  event: 'prazo_obra_vencimento' | 'anomalia_orcamento' | 'rotina_concluida' | 'alerta_seguranca';
  channel: MessageChannel;
  targetRecipient: string;
  templateMessage: string;
  active: boolean;
}

export interface DispatchedMessageLog {
  id: string;
  timestamp: string;
  channel: MessageChannel;
  recipient: string;
  title: string;
  content: string;
  status: 'entregue' | 'enviado' | 'lido' | 'falha';
  triggerEvent: string;
}

// ---- VESTUÁRIO FEMININO & VAREJO FASHION ----
export type FashionCategory = 
  | 'Calças Jeans' 
  | 'Vestidos' 
  | 'Croppeds' 
  | 'Saias' 
  | 'Bermudas & Shorts' 
  | 'Blusas & Camisas' 
  | 'Conjuntos';

export interface FashionProductItem {
  id: string;
  sku: string;
  name: string;
  category: FashionCategory;
  costPrice: number;       // Custo de compra/fabricação (CMV)
  salePrice: number;       // Preço de venda praticado
  stockCurrent: number;    // Saldo em estoque atual
  minStockAlert: number;   // Estoque de segurança
  unitsInMonth: number;    // Entradas do mês (compras/reposições)
  unitsOutMonth: number;   // Saídas do mês (vendas)
  sizeGrid: string;        // Ex: "36 ao 44" ou "P, M, G, GG"
  supplier: string;        // Nome da confecção/importador
}

export interface FashionStoreFinancials {
  grossRevenue: number;         // Faturamento bruto
  totalCostOfGoods: number;     // CMV (Custo das mercadorias vendidas)
  grossProfit: number;          // Lucro bruto
  operationalExpenses: number;  // Gastos fixos (aluguel, equipe, marketing, taxa cartão)
  taxesEstimated: number;       // Simples Nacional / ICMS
  netProfit: number;            // Lucro líquido real
  netMarginPct: number;         // Margem líquida (%)
  markupAverage: number;        // Markup médio aplicado (ex: 2.3x)
  totalInventoryValue: number;  // Valor do estoque a preço de custo
}
