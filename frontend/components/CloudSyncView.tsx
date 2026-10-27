import React, { useState } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  UploadCloud, 
  FolderSync, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileText, 
  ExternalLink,
  HardDrive,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { CloudStorageConnection, SyncedCloudFile, CloudProviderId } from '../types';

interface CloudSyncViewProps {
  connections: CloudStorageConnection[];
  syncedFiles: SyncedCloudFile[];
  onToggleConnection: (provider: CloudProviderId) => void;
  onImportFileToChat: (file: SyncedCloudFile) => void;
  onUploadFileToCloud: (file: SyncedCloudFile) => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  connections,
  syncedFiles,
  onToggleConnection,
  onImportFileToChat,
  onUploadFileToCloud,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<CloudProviderId | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const filteredFiles = syncedFiles.filter(
    (f) => selectedProvider === 'all' || f.provider === selectedProvider
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cloud className="w-6 h-6 text-teal-400" />
            Gerenciador de Conexões Externas & Nuvem
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sincronização contínua de plantas de projetos, tabelas de cálculo bruto e recibos com Google Drive, Microsoft OneDrive e Dropbox.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Todas as Pastas'}
        </button>
      </div>

      {/* Cloud Providers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {connections.map((conn) => {
          const usedPct = Math.round((conn.storageUsedGb / conn.storageTotalGb) * 100);
          return (
            <div
              key={conn.provider}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                conn.connected
                  ? 'bg-slate-900/80 border-teal-500/40 shadow-lg shadow-teal-500/5'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">
                      {conn.provider === 'google_drive' ? 'GD' : conn.provider === 'onedrive' ? 'OD' : 'DB'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{conn.name}</h3>
                      <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                        {conn.connected ? conn.accountEmail : 'Não conectado'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleConnection(conn.provider)}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors ${
                      conn.connected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {conn.connected ? 'Conectado' : 'Conectar'}
                  </button>
                </div>

                {/* Storage meter */}
                {conn.connected && (
                  <div className="space-y-1.5 my-3 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Espaço em Nuvem</span>
                      <span className="font-mono">{conn.storageUsedGb} GB de {conn.storageTotalGb} GB</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-400 h-full rounded-full transition-all"
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                  <p>Pasta: <strong className="text-slate-300 font-mono">{conn.syncFolder}</strong></p>
                  <p>Auto-sync anexos: <strong className={conn.autoSyncUploads ? 'text-teal-400' : 'text-slate-500'}>{conn.autoSyncUploads ? 'Ativo' : 'Manual'}</strong></p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>{conn.lastSyncedAt ? `Sync: ${conn.lastSyncedAt}` : 'Aguardando sincronismo'}</span>
                <span className="text-teal-400 flex items-center gap-1 font-medium">
                  {conn.connected && <CheckCircle2 className="w-3 h-3 text-teal-400" />}
                  {conn.connected ? 'Pronto' : 'Pausado'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Synced Files Repository */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FolderSync className="w-4 h-4 text-teal-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Arquivos Sincronizados na Nuvem
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Plantas arquitetônicas, tabelas orçamentárias e recibos prontos para análise direta no chat do AODA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProvider('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedProvider === 'all'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedProvider('google_drive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedProvider === 'google_drive'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Google Drive
            </button>
            <button
              onClick={() => setSelectedProvider('onedrive')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedProvider === 'onedrive'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              OneDrive
            </button>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-teal-500/40 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {file.type === 'planta' && <ImageIcon className="w-4 h-4 text-brand-400" />}
                    {file.type === 'calculo' && <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                    {file.type === 'recibo' && <FileText className="w-4 h-4 text-amber-400" />}
                    {file.type === 'relatorio' && <FileText className="w-4 h-4 text-blue-400" />}
                    <span className="font-semibold text-xs text-slate-200 truncate max-w-[160px]">
                      {file.fileName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{file.fileSize}</span>
                </div>

                <p className="text-[11px] text-slate-400 truncate font-mono bg-slate-900/80 p-1.5 rounded border border-slate-800">
                  {file.folderPath}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {file.provider === 'google_drive' ? 'G-Drive' : file.provider === 'onedrive' ? 'OneDrive' : 'Dropbox'}
                </span>

                <button
                  onClick={() => onImportFileToChat(file)}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Analisar no Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
