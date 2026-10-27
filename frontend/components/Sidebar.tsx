import React from 'react';
import { 
  SunMedium, 
  MessageSquare, 
  Calculator, 
  HardHat,
  CalendarDays,
  MessageCircle,
  Code2, 
  Workflow, 
  BarChart3, 
  Users2, 
  ShieldAlert,
  FileCheck2,
  FileText,
  Cloud,
  ShoppingBag
} from 'lucide-react';
import { UserAccount } from '../types';

export type NavTab = 
  | 'briefing' 
  | 'chat' 
  | 'fashion_retail'
  | 'bdi_budget'
  | 'calendar'
  | 'messaging'
  | 'calculations' 
  | 'devhub' 
  | 'routines' 
  | 'dashboard' 
  | 'reports' 
  | 'cloud' 
  | 'audit' 
  | 'team';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  user: UserAccount;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, user }) => {
  const isPJ = user.type === 'PJ';

  const menuItems = [
    {
      id: 'briefing' as NavTab,
      label: 'Briefing Diário',
      icon: SunMedium,
      badge: 'Matinal',
      color: 'text-amber-400',
    },
    {
      id: 'chat' as NavTab,
      label: 'Chat Multimodal & Voz',
      icon: MessageSquare,
      badge: 'IA 2.5',
      color: 'text-brand-400',
    },
    {
      id: 'fashion_retail' as NavTab,
      label: 'Vestuário Feminino',
      icon: ShoppingBag,
      badge: 'Moda & Margens',
      color: 'text-pink-400',
    },
    {
      id: 'bdi_budget' as NavTab,
      label: 'Orçamentos & BDI',
      icon: HardHat,
      badge: 'Obras',
      color: 'text-yellow-400',
    },
    {
      id: 'calendar' as NavTab,
      label: 'Agenda & Calendário',
      icon: CalendarDays,
      badge: 'Conflitos IA',
      color: 'text-emerald-400',
    },
    {
      id: 'messaging' as NavTab,
      label: 'WhatsApp & SMS',
      icon: MessageCircle,
      badge: 'API Auto',
      color: 'text-green-400',
    },
    {
      id: 'calculations' as NavTab,
      label: 'Cálculos & Gráficos',
      icon: Calculator,
      color: 'text-emerald-400',
    },
    {
      id: 'devhub' as NavTab,
      label: 'Sandbox de Código',
      icon: Code2,
      badge: 'Dev',
      color: 'text-cyanic-400',
    },
    {
      id: 'routines' as NavTab,
      label: 'Rotinas Inteligentes',
      icon: Workflow,
      color: 'text-purple-400',
    },
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard Analítico',
      icon: BarChart3,
      color: 'text-indigo-400',
    },
    {
      id: 'reports' as NavTab,
      label: 'Relatórios Executivos',
      icon: FileText,
      badge: 'PDF',
      color: 'text-blue-400',
    },
    {
      id: 'cloud' as NavTab,
      label: 'Nuvem & Conexões',
      icon: Cloud,
      badge: 'Drive',
      color: 'text-teal-400',
    },
    {
      id: 'audit' as NavTab,
      label: 'Logs & LGPD',
      icon: FileCheck2,
      badge: 'Audit',
      color: 'text-rose-400',
    },
    ...(isPJ
      ? [
          {
            id: 'team' as NavTab,
            label: 'Equipe & CNPJ',
            icon: Users2,
            badge: 'Admin',
            color: 'text-indigo-400',
          },
        ]
      : []),
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 p-3 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-between">
          <span>Módulos Operacionais</span>
          <span className="text-[10px] text-brand-400 font-mono">v2.5 Pro</span>
        </div>
        <nav className="space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-brand-600/25 to-pink-600/15 text-white border border-brand-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-400' : item.color}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ${
                      active
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security & Vault Status */}
      <div className="pt-3 border-t border-slate-800/80 mt-2">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              Segurança
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              {isPJ ? 'CNPJ Protegido' : 'LGPD Blindada'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            Criptografia nos balanços de estoque, margens e planilhas comerciais.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
            <span>Cofres Ativos:</span>
            <span className="text-slate-300 font-mono">{user.encryptedVaultCount} arquivos</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
