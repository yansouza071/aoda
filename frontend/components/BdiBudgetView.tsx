import React, { useState } from 'react';
import { 
  HardHat, 
  Calculator, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Building,
  Percent
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { CostCategoryItem, BdiParameters, UserAccount } from '../types';

interface BdiBudgetViewProps {
  user: UserAccount;
  onLogAudit?: (action: string, target: string) => void;
  onSendAlertWhatsApp?: (title: string, msg: string) => void;
}

export const BdiBudgetView: React.FC<BdiBudgetViewProps> = ({
  user,
  onLogAudit,
  onSendAlertWhatsApp
}) => {
  // Extracted floor plan metrics
  const [builtAreaM2, setBuiltAreaM2] = useState<number>(240);
  const [ceilingHeightM, setCeilingHeightM] = useState<number>(2.9);
  const [concreteSlabThicknessM, setConcreteSlabThicknessM] = useState<number>(0.14);

  // Initial Itemized Costs
  const [costItems, setCostItems] = useState<CostCategoryItem[]>([
    {
      id: 'c1',
      name: 'Mão de Obra de Alvenaria e Estrutura (Pedreiros + Ajudantes)',
      category: 'mao_de_obra',
      quantity: 240,
      unit: 'm²',
      unitPrice: 195.0,
      totalCost: 46800.0,
    },
    {
      id: 'c2',
      name: 'Concreto Usinado FCK 30 MPa c/ Bomba',
      category: 'materiais',
      quantity: Math.round(240 * 0.14 * 1.15), // slab volume with losses
      unit: 'm³',
      unitPrice: 480.0,
      totalCost: Math.round(240 * 0.14 * 1.15) * 480.0,
    },
    {
      id: 'c3',
      name: 'Aço CA-50 Cortado e Dobrado (Armadura)',
      category: 'materiais',
      quantity: Math.round(240 * 0.14 * 1.15 * 85), // kg of steel
      unit: 'kg',
      unitPrice: 7.8,
      totalCost: Math.round(240 * 0.14 * 1.15 * 85) * 7.8,
    },
    {
      id: 'c4',
      name: 'Locação de Andaimes e Escoramento Metálico',
      category: 'equipamentos',
      quantity: 3,
      unit: 'meses',
      unitPrice: 3800.0,
      totalCost: 11400.0,
    },
    {
      id: 'c5',
      name: 'Instalações Hidráulicas e Elétricas Especializadas',
      category: 'servicos',
      quantity: 240,
      unit: 'm²',
      unitPrice: 135.0,
      totalCost: 32400.0,
    },
  ]);

  // BDI Parameters (Instituto Brasileiro de Engenharia de Custos / Acórdão 2622/2013 TCU)
  const [bdi, setBdi] = useState<BdiParameters>({
    administrationFeePct: 4.5,
    financialCostPct: 1.2,
    risksContingencyPct: 2.8,
    insuranceWarrantyPct: 0.9,
    profitMarginPct: 8.5,
    taxesTributosPct: 13.65, // PIS, COFINS, ISS, etc.
  });

  // Calculate Direct Cost
  const directCostTotal = costItems.reduce((acc, curr) => acc + curr.totalCost, 0);

  // Standard Formula for BDI:
  // BDI = [ ((1 + AC + S + R + G) * (1 + DF) * (1 + L)) / (1 - I) ] - 1
  const AC = bdi.administrationFeePct / 100;
  const S_R_G = (bdi.insuranceWarrantyPct + bdi.risksContingencyPct) / 100;
  const DF = bdi.financialCostPct / 100;
  const L = bdi.profitMarginPct / 100;
  const I = bdi.taxesTributosPct / 100;

  const calculatedBdiFactor =
    ((1 + AC + S_R_G) * (1 + DF) * (1 + L)) / (1 - I) - 1;
  const calculatedBdiPct = Math.max(0, calculatedBdiFactor * 100);

  // Total Selling Price
  const finalPriceWithBdi = directCostTotal * (1 + calculatedBdiFactor);
  const totalBdiValue = finalPriceWithBdi - directCostTotal;
  const estimatedNetProfit = finalPriceWithBdi * L;
  const taxesTotalValue = finalPriceWithBdi * I;

  // Recalculate costs based on floor plan metrics
  const handleRecalculateFromPlan = () => {
    const updated = costItems.map((item) => {
      if (item.id === 'c1' || item.id === 'c5') {
        const qty = builtAreaM2;
        return { ...item, quantity: qty, totalCost: qty * item.unitPrice };
      }
      if (item.id === 'c2') {
        const slabVolume = Math.round(builtAreaM2 * concreteSlabThicknessM * 1.15);
        return { ...item, quantity: slabVolume, totalCost: slabVolume * item.unitPrice };
      }
      if (item.id === 'c3') {
        const slabVolume = Math.round(builtAreaM2 * concreteSlabThicknessM * 1.15);
        const steelKg = Math.round(slabVolume * 85);
        return { ...item, quantity: steelKg, totalCost: steelKg * item.unitPrice };
      }
      return item;
    });

    setCostItems(updated);
    if (onLogAudit) {
      onLogAudit('Recálculo de Orçamento via Planta Baixa', `${builtAreaM2}m² área`);
    }
  };

  // Generate Sensitivity Curve (Variation of Profit Margin / BDI from 15% to 40%)
  const sensitivityData = [];
  for (let bdiStep = 15; bdiStep <= 38; bdiStep += 2.5) {
    const factor = bdiStep / 100;
    const salePrice = directCostTotal * (1 + factor);
    const profit = salePrice * (bdi.profitMarginPct / 100);
    const taxes = salePrice * (bdi.taxesTributosPct / 100);
    sensitivityData.push({
      bdiTaxa: `${bdiStep.toFixed(1)}%`,
      precoVenda: Math.round(salePrice),
      lucroLiquido: Math.round(profit),
      impostos: Math.round(taxes),
    });
  }

  // Cost breakdown for bar chart
  const breakdownData = [
    {
      categoria: 'Mão de Obra',
      valor: costItems.filter((c) => c.category === 'mao_de_obra').reduce((a, b) => a + b.totalCost, 0),
    },
    {
      categoria: 'Materiais & Insumos',
      valor: costItems.filter((c) => c.category === 'materiais').reduce((a, b) => a + b.totalCost, 0),
    },
    {
      categoria: 'Equipamentos',
      valor: costItems.filter((c) => c.category === 'equipamentos').reduce((a, b) => a + b.totalCost, 0),
    },
    {
      categoria: 'BDI & Margem',
      valor: Math.round(totalBdiValue),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HardHat className="w-6 h-6 text-yellow-400" />
            Simulador de Orçamentos & BDI (Construção Civil e Serviços)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cálculo de custos diretos, insumos, encargos, BDI segundo critérios do IBEC/TCU e curvas de sensibilidade.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onSendAlertWhatsApp) {
                onSendAlertWhatsApp(
                  'Orçamento Finalizado',
                  `O orçamento da obra de ${builtAreaM2}m² foi consolidado em R$ ${finalPriceWithBdi.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} com BDI de ${calculatedBdiPct.toFixed(2)}%.`
                );
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-green-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Notificar Gestor via WhatsApp
          </button>
        </div>
      </div>

      {/* Metric Cards Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Custo Direto Total</span>
          <div className="text-2xl font-bold text-white mt-1">
            R$ {directCostTotal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-slate-500">
            R$ {(directCostTotal / builtAreaM2).toFixed(0)} / m² de obra
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Taxa de BDI Calculada</span>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {calculatedBdiPct.toFixed(2)}%
          </div>
          <span className="text-[11px] text-yellow-500/90">
            Fator Multiplicador: {(1 + calculatedBdiFactor).toFixed(4)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Preço de Venda / Proposta</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            R$ {finalPriceWithBdi.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-emerald-500">
            R$ {(finalPriceWithBdi / builtAreaM2).toFixed(0)} / m² final
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs text-slate-400">Lucro Líquido Estimado</span>
          <div className="text-2xl font-bold text-brand-400 mt-1">
            R$ {estimatedNetProfit.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[11px] text-brand-500">
            Margem Bruta configurada: {bdi.profitMarginPct}%
          </span>
        </div>
      </div>

      {/* Extraction of Plant Measurements */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Parâmetros Extraídos de Planta Arquitetônica
            </h3>
          </div>
          <button
            onClick={handleRecalculateFromPlan}
            className="px-3 py-1.5 rounded-lg bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Aplicar Metragens nos Itens
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Área Construída (m²)</label>
            <input
              type="number"
              value={builtAreaM2}
              onChange={(e) => setBuiltAreaM2(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Pé-Direito Médio (m)</label>
            <input
              type="number"
              step="0.1"
              value={ceilingHeightM}
              onChange={(e) => setCeilingHeightM(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <label className="text-[11px] text-slate-400 block mb-1">Espessura Média de Laje (m)</label>
            <input
              type="number"
              step="0.01"
              value={concreteSlabThicknessM}
              onChange={(e) => setConcreteSlabThicknessM(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* Grid: Tabela de Custos Diretos e Configuração do BDI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost items table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Planilha de Custos Diretos & Insumos
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {costItems.length} itens orçados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="pb-2 font-semibold">Descrição do Insumo/Serviço</th>
                  <th className="pb-2 font-semibold text-right">Qtd</th>
                  <th className="pb-2 font-semibold text-right">Unitário</th>
                  <th className="pb-2 font-semibold text-right">Total (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {costItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20">
                    <td className="py-2.5">
                      <p className="font-medium text-slate-200">{item.name}</p>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-300">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 text-right font-mono text-slate-400">
                      R$ {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      R$ {item.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BDI Parameters Form (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-yellow-400" />
              <h3 className="font-bold text-sm text-slate-100">
                Componentes do BDI (Fórmula Oficial)
              </h3>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-mono">
              TCU 2622
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Administração Central (AC):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={bdi.administrationFeePct}
                  onChange={(e) => setBdi({ ...bdi, administrationFeePct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Despesas Financeiras (DF):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={bdi.financialCostPct}
                  onChange={(e) => setBdi({ ...bdi, financialCostPct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Riscos e Contingência (R):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={bdi.risksContingencyPct}
                  onChange={(e) => setBdi({ ...bdi, risksContingencyPct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Seguros e Garantias (S+G):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={bdi.insuranceWarrantyPct}
                  onChange={(e) => setBdi({ ...bdi, insuranceWarrantyPct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-white font-mono"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Margem de Lucro Bruto (L):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.5"
                  value={bdi.profitMarginPct}
                  onChange={(e) => setBdi({ ...bdi, profitMarginPct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-emerald-400 font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-400">Tributos / Impostos (I):</span>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={bdi.taxesTributosPct}
                  onChange={(e) => setBdi({ ...bdi, taxesTributosPct: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right text-rose-400 font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-snug">
            Tributos incidentes no preço de venda: PIS (0.65%), COFINS (3.0%), ISS (5.0%) e Contribuição Previdenciária.
          </div>
        </div>
      </div>

      {/* Curva de Sensibilidade Interativa */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Curva de Sensibilidade: Impacto da Variação do BDI no Preço e no Lucro
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Simulação de 15% a 38% de BDI
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sensitivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="bdiTaxa" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="precoVenda"
                name="Preço de Venda Proposto"
                stroke="#facc15"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="lucroLiquido"
                name="Lucro Líquido Real"
                stroke="#34d399"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="impostos"
                name="Carga Tributária (I)"
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
