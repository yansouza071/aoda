import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Bug, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  RotateCcw,
  FileCode,
  Cpu
} from 'lucide-react';
import { askAodaAssistant } from '../services/geminiService';
import { UserAccount } from '../types';

interface DevHubViewProps {
  user: UserAccount;
}

const SAMPLE_CODES: Record<string, string> = {
  python: `# AODA Script: Processador de Cálculos Brutos de Obras
import math

def calcular_metragem_e_concreto(area_m2: float, espessura_laje_m: float = 0.12):
    """Calcula volume de concreto e taxa de armadura estimada"""
    volume_concreto = area_m2 * espessura_laje_m
    aco_kg_estimado = volume_concreto * 85.0 # ~85kg de aço por m3
    custo_estimado = (volume_concreto * 420.0) + (aco_kg_estimado * 7.5)
    
    return {
        "volume_m3": round(volume_concreto, 2),
        "aco_kg": round(aco_kg_estimado, 2),
        "custo_total_br": round(custo_estimado, 2)
    }

resultado = calcular_metragem_e_concreto(145.0)
print(f"[AODA AUDIT] Resultado da Obra: {resultado}")
`,
  typescript: `// AODA Service: Tokenizador e Sanitizador de Dados LGPD
interface SecureRecord {
  cpf: string;
  name: string;
  valorTransacao: number;
}

export function sanitizeClientData(record: SecureRecord): Record<string, string> {
  const maskedCpf = record.cpf.replace(/(\\d{3})(\\d{3})(\\d{3})(\\d{2})/, "$1.***.***-$4");
  return {
    clientToken: btoa(record.name).slice(0, 12),
    cpfAudit: maskedCpf,
    status: "CONFORME_LGPD_2025"
  };
}

console.log(sanitizeClientData({ cpf: "12345678901", name: "Carlos Mendes", valorTransacao: 4500 }));
`,
  sql: `-- Auditoria Fiscal de Faturamento e Tributos CNPJ
SELECT 
    e.cnpj,
    e.razao_social,
    COUNT(n.id) as total_notas_emitidas,
    SUM(n.valor_bruto) as volume_bruto_total,
    ROUND(SUM(n.valor_bruto * 0.05), 2) as iss_estimado
FROM empresas e
JOIN notas_fiscais n ON n.empresa_id = e.id
WHERE n.data_emissao >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.cnpj, e.razao_social
HAVING SUM(n.valor_bruto) > 50000
ORDER BY volume_bruto_total DESC;
`,
};

export const DevHubView: React.FC<DevHubViewProps> = ({ user }) => {
  const [language, setLanguage] = useState<'python' | 'typescript' | 'sql'>('python');
  const [code, setCode] = useState<string>(SAMPLE_CODES.python);
  const [consoleOutput, setConsoleOutput] = useState<string>('Console pronto para execução.');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (lang: 'python' | 'typescript' | 'sql') => {
    setLanguage(lang);
    setCode(SAMPLE_CODES[lang]);
    setConsoleOutput(`Trocou linguagem para: ${lang.toUpperCase()}`);
    setAiAnalysis(null);
  };

  const handleRunMock = () => {
    if (language === 'python') {
      setConsoleOutput(
        `> Executando interpretador Python 3.12 (AODA Sandbox Sandbox Environment)\n[AODA AUDIT] Resultado da Obra: {'volume_m3': 17.4, 'aco_kg': 1479.0, 'custo_total_br': 18400.5}\nProcesso concluído com código 0 (tempo: 28ms)`
      );
    } else if (language === 'typescript') {
      setConsoleOutput(
        `> Compilando TypeScript v5.5 via esbuild...\n{ clientToken: 'Q2FybG9zIE1l', cpfAudit: '123.***.***-01', status: 'CONFORME_LGPD_2025' }\nSandbox verificado.`
      );
    } else {
      setConsoleOutput(
        `> Executando Query SQL no banco analítico...\nRetornadas 4 linhas em 12ms. Volume total de transações auditadas: R$ 389.450,00`
      );
    }
  };

  const handleAiDebug = async () => {
    setIsProcessingAi(true);
    setAiAnalysis(null);
    try {
      const response = await askAodaAssistant(
        `Atue como Engenheiro de Software Sênior. Analise o código a seguir em ${language}, aponte eventuais bugs, melhorias de arquitetura, segurança e complexidade assintótica (Big O):\n\n\`\`\`${language}\n${code}\n\`\`\``,
        user
      );
      setAiAnalysis(response.text);
    } catch (err: any) {
      setAiAnalysis('Erro ao consultar módulo de IA.');
    } finally {
      setIsProcessingAi(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Code2 className="w-6 h-6 text-cyanic-400" />
            Módulo Especializado de Programação & Dev Sandbox
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Editor com depuração neural, análise estática, explicações técnicas e execução assistida por IA.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['python', 'typescript', 'sql'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                language === lang
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Area (8 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </span>
              <span className="text-xs font-mono text-slate-400 ml-2">
                script_aoda.{language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'sql'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 border border-slate-700 text-xs flex items-center gap-1"
                title="Copiar código"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleRunMock}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Executar
              </button>

              <button
                onClick={handleAiDebug}
                disabled={isProcessingAi}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isProcessingAi ? 'animate-spin' : ''}`} />
                {isProcessingAi ? 'Analisando...' : 'Depurar IA'}
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
            className="w-full bg-slate-950/90 text-slate-100 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-none leading-relaxed border-b border-slate-800"
            spellCheck={false}
          />

          {/* Console Output */}
          <div className="bg-slate-950 p-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pb-2 border-b border-slate-900">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saída do Terminal AODA:</span>
            </div>
            <pre className="mt-2 text-xs font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {consoleOutput}
            </pre>
          </div>
        </div>

        {/* AI Inspector / Debug Column (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
              <Bug className="w-4 h-4 text-brand-400" />
              <h3 className="font-bold text-sm text-slate-100">Auditoria Neural de Código</h3>
            </div>

            {isProcessingAi ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Cpu className="w-8 h-8 text-brand-400 animate-pulse" />
                <p className="text-xs text-slate-400">
                  O AODA está inspecionando sintaxe, segurança e sugerindo melhorias...
                </p>
              </div>
            ) : aiAnalysis ? (
              <div className="text-xs text-slate-300 leading-relaxed max-h-[420px] overflow-y-auto pr-1 whitespace-pre-wrap space-y-2">
                {aiAnalysis}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <FileCode className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-xs font-semibold text-slate-300">Nenhuma inspeção ativa</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Clique em &quot;Depurar IA&quot; para que o AODA analise bugs, segurança corporativa e refatoração.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Motor: Gemini 2.5 Code Assist</span>
            <span className="text-cyanic-400">Linguagem Ativa: {language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
