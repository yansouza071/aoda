import React, { useState } from 'react';
import { 
  Building2, 
  User as UserIcon, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  X,
  Lock
} from 'lucide-react';
import { UserAccount, UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [selectedType, setSelectedType] = useState<UserType>(currentUser.type);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [identifier, setIdentifier] = useState(currentUser.identifier);
  const [companyName, setCompanyName] = useState(currentUser.companyName || 'AODA Engenharia e Inovação Ltda');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      type: selectedType,
      name,
      email,
      identifier,
      companyName: selectedType === 'PJ' ? companyName : undefined,
      securityLevel:
        selectedType === 'PJ'
          ? 'Segurança Corporativa ISO/IEC 27001'
          : 'Alta Proteção LGPD',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-400" />
              Ambiente de Acesso & Dados de Segurança
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha seu perfil operacional. Cada área possui cofre e compliance específicos.
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Switcher selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedType('PF');
              if (identifier.length > 14) setIdentifier('412.890.123-45');
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedType === 'PF'
                ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <UserIcon className={`w-6 h-6 mb-2 ${selectedType === 'PF' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <h4 className="font-bold text-xs text-white">Pessoa Física (CPF)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Privacidade LGPD, dados pessoais e rotinas do dia a dia.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('PJ');
              if (identifier.length <= 14) setIdentifier('45.890.123/0001-90');
            }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedType === 'PJ'
                ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Building2 className={`w-6 h-6 mb-2 ${selectedType === 'PJ' ? 'text-indigo-400' : 'text-slate-500'}`} />
            <h4 className="font-bold text-xs text-white">Corporativo (CNPJ)</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Gestão de equipe, webhooks, rotinas compartilhadas e auditoria.
            </p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Nome Completo / Representante</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">E-mail Cadastrado</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                {selectedType === 'PJ' ? 'CNPJ' : 'CPF'}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
              />
            </div>

            {selectedType === 'PJ' && (
              <div>
                <label className="text-xs text-slate-300 block mb-1">Razão Social / Fantasia</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Certificado de conformidade:{' '}
              <strong className="text-slate-200">
                {selectedType === 'PJ' ? 'ISO/IEC 27001 Multi-tenant' : 'LGPD Criptografia Ponta-a-Ponta'}
              </strong>
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20"
            >
              Confirmar & Salvar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
