import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Percent, 
  Layers, 
  PieChart as PieIcon, 
  Play, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export const CalculationsView: React.FC = () => {
  // Financial Projection State
  const [initialCapital, setInitialCapital] = useState<number>(25000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1500);
  const [annualRate, setAnnualRate] = useState<number>(11.5);
  const [months, setMonths] = useState<number>(24);

  // Generate Compound Interest Curve
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const financialData: any[] = [];
  let currentTotal = initialCapital;
  let totalInvested = initialCapital;

  for (let m = 1; m <= months; m++) {
    currentTotal = currentTotal * (1 + monthlyRate) + monthlyContribution;
    totalInvested += monthlyContribution;
    if (m % 2 === 0 || m === months) {
      financialData.push({
        mes: `Mês ${m}`,
        totalAcumulado: Math.round(currentTotal),
        totalInvestido: Math.round(totalInvested),
        rendimento: Math.round(currentTotal - totalInvested),
      });
    }
  }

  // Statistical Normal Distribution Simulation
  const [mean, setMean] = useState<number>(100);
  const [stdDev, setStdDev] = useState<number>(15);
  const distributionData: any[] = [];

  for (let x = mean - 3 * stdDev; x <= mean + 3 * stdDev; x += stdDev / 2) {
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    const density = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    distributionData.push({
      ponto: x.toFixed(0),
      densidade: parseFloat((density * 1000).toFixed(2)),
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-emerald-400" />
            Cálculos Brutos & Visualizador Gráfico Interativo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulador de projeções financeiras, funções matemáticas e distribuições estatísticas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Motor Matemático AODA
          </span>
        </div>
      </div>

      {/* Simulator 1: Projeção Financeira e Juros Compostos */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Projeção Financeira: Juros Compostos & Aporte Recorrente
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Total Final: R$ {currentTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </span>
        </div>

        {/* Input sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Capital Inicial (R$)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Aporte Mensal (R$)</label>
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Taxa Anual (% a.a.)</label>
            <input
              type="number"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Período (Meses)</label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="totalAcumulado" name="Total Acumulado" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="totalInvestido" name="Total Investido" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} />
              <Line type="monotone" dataKey="rendimento" name="Juros Gerados" stroke="#34d399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Simulator 2: Distribuição Estatística Gaussiana */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Curva de Distribuição Normal (Gaussiana de Riscos e Desempenho)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Média: {mean} | Desvio Padrão: {stdDev}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Média (μ)</label>
            <input
              type="number"
              value={mean}
              onChange={(e) => setMean(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Desvio Padrão (σ)</label>
            <input
              type="number"
              value={stdDev}
              onChange={(e) => setStdDev(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="ponto" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
              <Bar dataKey="densidade" name="Densidade de Probabilidade" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
