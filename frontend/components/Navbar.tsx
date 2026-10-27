import React, { useState } from 'react';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bell, 
  ShieldCheck, 
  Building2, 
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserAccount, AppNotification } from '../types';

interface NavbarProps {
  user: UserAccount;
  onSwitchAccountType: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  notifications: AppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSwitchAccountType,
  voiceEnabled,
  onToggleVoice,
  isListening,
  onStartListening,
  onStopListening,
  notifications,
  onMarkNotificationAsRead
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-cyanic-500 to-indigo-600 shadow-lg shadow-brand-500/20">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
                AODA
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/30 tracking-wide uppercase">
                IA 2.5 Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Assistente Operacional e Decisório Autônomo
            </p>
          </div>
        </div>

        {/* Global Controls: Audio, Speech, Alerts, User Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Voice Dictation Toggle */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/50 shadow-lg shadow-rose-500/25'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={isListening ? 'Parar escuta de voz' : 'Iniciar ditado por voz (Web Speech)'}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-white" />
                <span className="hidden md:inline">Ouvindo...</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden md:inline">Ditar Voz</span>
              </>
            )}
          </button>

          {/* Assistant Voice Output Audio Mute/Unmute */}
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-lg text-xs border transition-colors ${
              voiceEnabled
                ? 'bg-brand-500/10 text-brand-400 border-brand-500/30 hover:bg-brand-500/20'
                : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
            }`}
            title={voiceEnabled ? 'Áudio de voz ativado (clique para silenciar síntese)' : 'Áudio de voz desativado (clique para ativar síntese)'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Alertas e Webhooks em tempo real"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Tray */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notificações & Alertas</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                      {notifications.length}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-400 cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>
                    Fechar
                  </span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Nenhum alerta recente.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationAsRead(notif.id)}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors border ${
                          notif.read
                            ? 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                            : 'bg-slate-800/80 border-brand-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-medium text-slate-200 flex items-center gap-1.5">
                            {notif.type === 'alert' && <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            {notif.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{notif.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-400">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Profile and Switcher (PF vs PJ) */}
          <button
            onClick={onSwitchAccountType}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
              user.type === 'PJ'
                ? 'bg-indigo-950/40 border-indigo-500/40 hover:bg-indigo-900/40 text-indigo-200'
                : 'bg-emerald-950/40 border-emerald-500/40 hover:bg-emerald-900/40 text-emerald-200'
            }`}
            title="Alternar entre Pessoa Física e Corporativo CNPJ"
          >
            {user.type === 'PJ' ? (
              <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
            ) : (
              <UserIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div className="text-left hidden lg:block">
              <p className="font-semibold leading-tight text-white">{user.name}</p>
              <div className="flex items-center gap-1 text-[10px] opacity-80">
                <ShieldCheck className="w-3 h-3" />
                <span>{user.type === 'PJ' ? `CNPJ: ${user.identifier}` : `CPF: ${user.identifier}`}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
