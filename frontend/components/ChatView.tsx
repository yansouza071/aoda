import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  Volume2, 
  X, 
  Code2, 
  BarChart3,
  CheckCircle2,
  CalendarPlus
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ChatMessage, UserAccount, ChartDataPayload } from '../types';
import { askAodaAssistant } from '../services/geminiService';
import { speechService } from '../services/speechService';

const CHART_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

interface ChatViewProps {
  user: UserAccount;
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  voiceActive: boolean;
  onAddScheduledTask?: (title: string, deadline: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  user,
  messages,
  onSendMessage,
  voiceActive,
  onAddScheduledTask
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    name: string;
    type: 'image' | 'document';
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  const [isDictating, setIsDictating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice recognition handling
  const handleStartVoice = () => {
    if (!speechService.isSupported()) {
      alert('Seu navegador não possui suporte à Web Speech API.');
      return;
    }

    setIsDictating(true);
    speechService.startListening(
      (text, isFinal) => {
        setInputText(text);
        if (isFinal) {
          setIsDictating(false);
        }
      },
      (err) => {
        console.error('Speech error:', err);
        setIsDictating(false);
      },
      () => {
        setIsDictating(false);
      }
    );
  };

  const handleStopVoice = () => {
    speechService.stopListening();
    setIsDictating(false);
  };

  // File upload handling (Blueprints, Invoices, Receipts)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      const isImg = file.type.startsWith('image/');

      setSelectedAttachment({
        name: file.name,
        type: isImg ? 'image' : 'document',
        previewUrl: result,
        base64: base64Data,
        mimeType: file.type || 'application/octet-stream',
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit message to Gemini
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && !selectedAttachment) || isLoading) return;

    const userText = inputText.trim();
    const currentAttachment = selectedAttachment;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText || (currentAttachment ? `Analise este arquivo anexo: ${currentAttachment.name}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: currentAttachment
        ? {
            name: currentAttachment.name,
            type: currentAttachment.type,
            previewUrl: currentAttachment.previewUrl,
          }
        : undefined,
    };

    onSendMessage(userMsg);
    setInputText('');
    setSelectedAttachment(null);
    setIsLoading(true);

    try {
      const historyContext = messages.map(m => ({ sender: m.sender, text: m.text }));
      const attachmentPayload = currentAttachment
        ? { base64: currentAttachment.base64, mimeType: currentAttachment.mimeType }
        : undefined;

      const aiResponse = await askAodaAssistant(
        userText || 'Analise esta imagem/documento e execute cálculos brutos e prazos.',
        user,
        attachmentPayload,
        historyContext
      );

      const aodaMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'aoda',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chart: aiResponse.chart,
        codeSnippet: aiResponse.codeSnippet,
      };

      onSendMessage(aodaMsg);

      // Auto read if voice output is active
      if (voiceActive) {
        speechService.speak(aiResponse.text);
      }

      // If tasks were identified in doc/chat
      if (aiResponse.tasksSuggested && onAddScheduledTask) {
        aiResponse.tasksSuggested.forEach(t => {
          onAddScheduledTask(t.title, t.deadline);
        });
      }
    } catch (err: any) {
      console.error(err);
      onSendMessage({
        id: (Date.now() + 1).toString(),
        sender: 'aoda',
        text: 'Desculpe, ocorreu uma instabilidade momentânea na resposta do assistente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    speechService.speak(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  isUser
                    ? 'bg-gradient-to-tr from-brand-600 to-cyanic-500'
                    : 'bg-gradient-to-tr from-indigo-600 via-brand-600 to-purple-600 shadow-md shadow-brand-500/20'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-3.5 text-xs sm:text-sm leading-relaxed border ${
                  isUser
                    ? 'bg-brand-600/90 text-white border-brand-500/50 shadow-md shadow-brand-600/10'
                    : 'bg-slate-800/80 text-slate-100 border-slate-700/80 shadow-md'
                }`}
              >
                {/* Text Content */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Attached Image / Document Preview */}
                {msg.attachment && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                    {msg.attachment.type === 'image' ? (
                      <div className="space-y-1">
                        <img
                          src={msg.attachment.previewUrl}
                          alt={msg.attachment.name}
                          className="max-h-60 rounded-lg object-contain border border-slate-700/80"
                        />
                        <span className="text-[10px] text-slate-400 block truncate">
                          {msg.attachment.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <FileText className="w-4 h-4 text-brand-400" />
                        <span className="truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Render Interactive Chart if AI created one */}
                {msg.chart && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-700/80">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-cyanic-400" />
                        <h4 className="text-xs font-bold text-slate-200">{msg.chart.title}</h4>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 uppercase">
                        Cálculo Bruto
                      </span>
                    </div>

                    <div className="h-60 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        {msg.chart.type === 'bar' ? (
                          <BarChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                            {msg.chart.seriesKeys.map((key, idx) => (
                              <Bar key={key} dataKey={key} fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                            ))}
                          </BarChart>
                        ) : msg.chart.type === 'area' ? (
                          <AreaChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            {msg.chart.seriesKeys.map((key, idx) => (
                              <Area key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[idx % CHART_COLORS.length]} fill={CHART_COLORS[idx % CHART_COLORS.length]} fillOpacity={0.25} />
                            ))}
                          </AreaChart>
                        ) : msg.chart.type === 'pie' ? (
                          <PieChart>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Pie data={msg.chart.data} dataKey={msg.chart.seriesKeys[0] || 'valor'} nameKey={msg.chart.xAxisKey} cx="50%" cy="50%" outerRadius={70} fill="#8884d8">
                              {msg.chart.data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        ) : (
                          <LineChart data={msg.chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                            <XAxis dataKey={msg.chart.xAxisKey} stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                            {msg.chart.seriesKeys.map((key, idx) => (
                              <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[idx % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                            ))}
                          </LineChart>
                        )}
                      </ResponsiveContainer>
                    </div>

                    {msg.chart.description && (
                      <p className="text-[11px] text-slate-400 mt-2 italic">{msg.chart.description}</p>
                    )}
                  </div>
                )}

                {/* Render Code Snippet if present */}
                {msg.codeSnippet && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                    <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                      <span className="font-mono text-cyanic-400">{msg.codeSnippet.language}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.codeSnippet!.code)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Copiar código
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Footer bar with timestamp and voice speech trigger */}
                <div className="flex items-center justify-between gap-3 mt-2 text-[10px] text-slate-400/80">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="hover:text-brand-300 flex items-center gap-1 transition-colors"
                      title="Ouvir esta resposta por voz"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Ouvir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-brand-600 to-purple-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-3">
              <span className="flex space-x-1">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span>Processando raciocínio, dados brutos e cálculos...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Chip preview */}
      {selectedAttachment && (
        <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            {selectedAttachment.type === 'image' ? (
              <ImageIcon className="w-4 h-4 text-brand-400" />
            ) : (
              <FileText className="w-4 h-4 text-emerald-400" />
            )}
            <span className="font-medium truncate max-w-xs">{selectedAttachment.name}</span>
            <span className="text-[10px] text-slate-500">Pronto para OCR / análise</span>
          </div>
          <button
            onClick={() => setSelectedAttachment(null)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* File upload hidden input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf,text/plain"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Anexar planta, recibo, planilha ou imagem"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Input with Web Speech API */}
          <button
            type="button"
            onClick={isDictating ? handleStopVoice : handleStartVoice}
            className={`p-2.5 rounded-xl transition-all border ${
              isDictating
                ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                : 'bg-slate-800 hover:bg-slate-700 text-brand-400 border-slate-700'
            }`}
            title={isDictating ? 'Parar escuta' : 'Ditar comando de voz'}
          >
            {isDictating ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isDictating
                ? 'Ouvindo sua voz...'
                : 'Pergunte, solicite cálculos brutos, gráficos, análise de plantas ou código...'
            }
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />

          <button
            type="submit"
            disabled={isLoading || (!inputText.trim() && !selectedAttachment)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-brand-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick prompt suggestions */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
          <span className="shrink-0 text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-400" /> Sugestões:
          </span>
          <button
            type="button"
            onClick={() => setInputText('Simule uma projeção financeira de investimento de R$ 50.000 em 12 meses com taxa de 1,1% a.m. e gere o gráfico.')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700/60"
          >
            📈 Projeção Financeira R$ 50k
          </button>
          <button
            type="button"
            onClick={() => setInputText('Como calcular a carga estrutural e metragem bruta em uma planta baixa residencial?')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700/60"
          >
            📐 Cálculo de Carga em Planta
          </button>
          <button
            type="button"
            onClick={() => setInputText('Crie um script em Python para conciliação bancária automática com geração de logs de auditoria.')}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0 border border-slate-700/60"
          >
            🐍 Script de Conciliação
          </button>
        </div>
      </div>
    </div>
  );
};
