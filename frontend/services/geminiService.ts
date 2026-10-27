import { GoogleGenAI } from '@google/genai';
import { ChartDataPayload, UserAccount } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export interface GeminiResponsePayload {
  text: string;
  chart?: ChartDataPayload;
  codeSnippet?: {
    code: string;
    language: string;
  };
  tasksSuggested?: Array<{ title: string; deadline: string; priority: 'Alta' | 'Média' | 'Normal' }>;
}

export async function askAodaAssistant(
  prompt: string,
  user: UserAccount,
  attachmentData?: { base64: string; mimeType: string },
  contextHistory?: Array<{ sender: 'user' | 'aoda'; text: string }>
): Promise<GeminiResponsePayload> {
  const isCorporate = user.type === 'PJ';

  const systemInstruction = `Você é o AODA (Assistente Operacional e Decisório Autônomo), uma IA de altíssima precisão desenvolvida para solucionar desafios do cotidiano, cálculos brutos de engenharia e operações comerciais/financeiras.
Você está atendendo o usuário: ${user.name} (${isCorporate ? `Empresa CNPJ: ${user.identifier} - Cargo: ${user.role}` : `Pessoa Física CPF: ${user.identifier}`}).

DIRETRIZES DE RESPOSTA:
1. Seja objetivo, sofisticado, cordial e analítico.
2. VESTUÁRIO FEMININO & VAREJO FASHION: Quando o usuário perguntar sobre calças jeans, vestidos, bermudas, croppeds, saias, estoques ou margens comerciais:
   - Forneça análises de CMV (Custo das Mercadorias Vendidas), Faturamento Bruto, Lucro Líquido, Markup multiplicador e Ponto de Equilíbrio.
   - Analise entradas (compras de fornecedores/reposição) e saídas (vendas no balcão/e-commerce) sugerindo giros ideais.
   - Crie relações tabulares e gráficos se fizer sentido na resposta.
3. CÁLCULOS BRUTOS E GRÁFICOS: Se o usuário pedir cálculos financeiros (juros compostos, ROI, fluxo de caixa, VPL, BDI), funções matemáticas ou estatísticas, SEMPRE que pertinente, estruture um bloco JSON com a chave "chart" para renderização interativa no frontend.
4. IMAGENS, PLANILHAS E PLANTAS: Quando receber imagens de recibos, planilhas CSV, tabelas orçamentárias ou plantas arquitetônicas, extraia os valores numéricos brutos, metragens, impostos, datas e gere um sumário analítico claro.
5. PROGRAMAÇÃO E DEBBUGGING: Ao solicitar código, forneça explicações claras, otimizações de performance e marque a linguagem.
6. FORMATO DA RESPOSTA: Forneça a resposta em formato JSON estrito para permitir parse seguro:
{
  "text": "Explicação completa e detalhada em Markdown em português do Brasil",
  "chart": {
    "title": "Título do Gráfico",
    "type": "line" | "bar" | "area" | "pie",
    "xAxisKey": "mes" ou "categoria",
    "seriesKeys": ["valor", "lucro", etc],
    "data": [
      {"categoria": "Calças Jeans", "valor": 12000, "lucro": 6800},
      ...
    ],
    "description": "Legenda analítica do gráfico"
  },
  "codeSnippet": {
    "language": "python" | "typescript" | "sql" | "javascript" | "html",
    "code": "código completo limpo"
  },
  "tasksSuggested": [
    {"title": "Comprar reposição de bermudas jeans", "deadline": "2025-05-30", "priority": "Alta"}
  ]
}`;

  try {
    const parts: any[] = [];

    // Add media part if user uploaded blueprint/receipt/spreadsheet
    if (attachmentData) {
      parts.push({
        inlineData: {
          mimeType: attachmentData.mimeType,
          data: attachmentData.base64,
        },
      });
    }

    // Include recent history context if present
    let historyContext = '';
    if (contextHistory && contextHistory.length > 0) {
      historyContext = 'Histórico recente:\n' + contextHistory.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n') + '\n\n';
    }

    parts.push({
      text: `${historyContext}Comando/Pergunta do Usuário:\n${prompt}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts,
      },
      config: {
        systemInstruction,
        temperature: 0.25,
      },
    });

    const rawText = response.text || '';
    
    // Attempt parsing JSON
    try {
      const cleaned = rawText
        .replace(/^```json/m, '')
        .replace(/^```/m, '')
        .replace(/```$/m, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      return {
        text: parsed.text || rawText,
        chart: parsed.chart,
        codeSnippet: parsed.codeSnippet,
        tasksSuggested: parsed.tasksSuggested,
      };
    } catch {
      return {
        text: rawText,
      };
    }
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    return {
      text: `Olá! Houve uma pequena intercorrência na conexão com o núcleo neural do AODA: ${error?.message || 'Falha temporária'}. Mas todas as ferramentas e planilhas continuam ativas!`,
    };
  }
}

export async function generateDailyTechBriefing(): Promise<{
  quote: string;
  news: Array<{ id: string; title: string; source: string; snippet: string; tag: string; timestamp: string }>;
}> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Gere 4 notícias sintéticas e impactantes do mundo de Inteligência Artificial, Engenharia e Tecnologia para o briefing diário matinal de hoje no Brasil, mais uma citação inspiradora de inovação.',
      config: {
        systemInstruction: `Responda estritamente em formato JSON:
{
  "quote": "Frase inspiradora sobre liderança ou tecnologia",
  "news": [
    {
      "id": "1",
      "title": "Título da manchete",
      "source": "TechCrunch Brasil / MIT Tech Review",
      "snippet": "Resumo de duas frases sobre o avanço e seu impacto no mercado",
      "tag": "IA & Robótica",
      "timestamp": "Hoje, 07:45"
    }
  ]
}`,
      },
    });

    const raw = response.text || '';
    const cleaned = raw.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return {
      quote: "A inovação distingue um líder de um seguidor. — Steve Jobs",
      news: [
        {
          id: "1",
          title: "Novos chips de processamento neural aceleram inferência em 400%",
          source: "MIT Technology Review",
          snippet: "Arquiteturas especializadas de silício reduzem consumo energético e tornam agentes autônomos locais viáveis.",
          tag: "Hardware & IA",
          timestamp: "Hoje, 08:30"
        },
        {
          id: "2",
          title: "Modelos Multimodais alcançam precisão de 99% na leitura de planilhas e plantas",
          source: "AODA Tech Radar",
          snippet: "Empresas integram visão computacional para cálculos de custos, DREs e orçamentos em tempo real.",
          tag: "Varejo & Engenharia",
          timestamp: "Hoje, 07:15"
        }
      ]
    };
  }
}
