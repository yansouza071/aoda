import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  ArrowDownRight, 
  ArrowUpRight, 
  Package, 
  Sparkles, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Layers, 
  Percent, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, 
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
import { FashionProductItem, FashionCategory, UserAccount } from '../types';

const PIE_COLORS = ['#ec4899', '#38bdf8', '#a855f7', '#fbbf24', '#34d399', '#f97316', '#6366f1'];

interface FashionRetailViewProps {
  user: UserAccount;
  onSendPromptToAoda: (prompt: string) => void;
  onLogAudit?: (action: string, target: string) => void;
  onSendAlertWhatsApp?: (title: string, msg: string) => void;
}

export const FashionRetailView: React.FC<FashionRetailViewProps> = ({
  user,
  onSendPromptToAoda,
  onLogAudit,
  onSendAlertWhatsApp
}) => {
  // Initial catalog of women's apparel items
  const [products, setProducts] = useState<FashionProductItem[]>([
    {
      id: 'f_01',
      sku: 'JNS-WID-01',
      name: 'Calça Jeans Wide Leg Cintura Alta Lavagem Clara',
      category: 'Calças Jeans',
      costPrice: 58.00,
      salePrice: 169.90,
      stockCurrent: 42,
      minStockAlert: 15,
      unitsInMonth: 60,
      unitsOutMonth: 38,
      sizeGrid: '36 ao 44',
      supplier: 'Denim Brasil Têxtil',
    },
    {
      id: 'f_02',
      sku: 'JNS-FLA-02',
      name: 'Calça Jeans Flare Barra Desfiada Modeladora',
      category: 'Calças Jeans',
      costPrice: 65.00,
      salePrice: 189.90,
      stockCurrent: 18,
      minStockAlert: 12,
      unitsInMonth: 40,
      unitsOutMonth: 29,
      sizeGrid: '36 ao 46',
      supplier: 'Denim Brasil Têxtil',
    },
    {
      id: 'f_03',
      sku: 'VES-MID-01',
      name: 'Vestido Midi Canelado c/ Fenda Lateral Premium',
      category: 'Vestidos',
      costPrice: 42.00,
      salePrice: 139.90,
      stockCurrent: 28,
      minStockAlert: 10,
      unitsInMonth: 50,
      unitsOutMonth: 41,
      sizeGrid: 'P, M, G',
      supplier: 'Ateliê Moda Chic',
    },
    {
      id: 'f_04',
      sku: 'VES-FLO-02',
      name: 'Vestido Longo Evasê Estampa Floral Primavera',
      category: 'Vestidos',
      costPrice: 75.00,
      salePrice: 229.00,
      stockCurrent: 9,
      minStockAlert: 10,
      unitsInMonth: 25,
      unitsOutMonth: 22,
      sizeGrid: 'P, M, G, GG',
      supplier: 'Flor de Seda Confecções',
    },
    {
      id: 'f_05',
      sku: 'CRP-ALC-01',
      name: 'Cropped Alcinha Suplex Duplo Estruturado',
      category: 'Croppeds',
      costPrice: 16.50,
      salePrice: 59.90,
      stockCurrent: 65,
      minStockAlert: 25,
      unitsInMonth: 120,
      unitsOutMonth: 94,
      sizeGrid: 'Único (36-42)',
      supplier: 'Malharia Sul Fashion',
    },
    {
      id: 'f_06',
      sku: 'CRP-MAN-02',
      name: 'Cropped Manga Longa Drapeado Tule',
      category: 'Croppeds',
      costPrice: 24.00,
      salePrice: 79.90,
      stockCurrent: 31,
      minStockAlert: 15,
      unitsInMonth: 45,
      unitsOutMonth: 33,
      sizeGrid: 'P, M, G',
      supplier: 'Malharia Sul Fashion',
    },
    {
      id: 'f_07',
      sku: 'SAI-PLI-01',
      name: 'Saia Midi Plissada Acetinada com Cinto',
      category: 'Saias',
      costPrice: 46.00,
      salePrice: 149.00,
      stockCurrent: 14,
      minStockAlert: 12,
      unitsInMonth: 30,
      unitsOutMonth: 21,
      sizeGrid: 'P, M, G',
      supplier: 'Ateliê Moda Chic',
    },
    {
      id: 'f_08',
      sku: 'SAI-JNS-02',
      name: 'Saia Jeans Curta Cargo c/ Bolsos Frontais',
      category: 'Saias',
      costPrice: 38.00,
      salePrice: 119.90,
      stockCurrent: 22,
      minStockAlert: 10,
      unitsInMonth: 35,
      unitsOutMonth: 24,
      sizeGrid: '36 ao 44',
      supplier: 'Denim Brasil Têxtil',
    },
    {
      id: 'f_09',
      sku: 'BER-CIC-01',
      name: 'Bermuda Ciclista Jeans Meia Coxa Elastano',
      category: 'Bermudas & Shorts',
      costPrice: 36.00,
      salePrice: 109.90,
      stockCurrent: 7, // CRITICAL STOCK!
      minStockAlert: 15,
      unitsInMonth: 30,
      unitsOutMonth: 32,
      sizeGrid: '36 ao 46',
      supplier: 'Denim Brasil Têxtil',
    },
    {
      id: 'f_10',
      sku: 'SHT-ALF-02',
      name: 'Short Alfaiataria Cintura Alta com Pregas',
      category: 'Bermudas & Shorts',
      costPrice: 32.00,
      salePrice: 99.90,
      stockCurrent: 29,
      minStockAlert: 10,
      unitsInMonth: 50,
      unitsOutMonth: 37,
      sizeGrid: 'P, M, G',
      supplier: 'Ateliê Moda Chic',
    },
  ]);

  // Operational Expenses State (Gastos Operacionais Mensais)
  const [fixedExpenses, setFixedExpenses] = useState({
    rentAndCondo: 4800.0,
    storeTeamPayroll: 7500.0,
    digitalMarketingAds: 2200.0,
    cardFeesAndPackagingPct: 4.8, // 4.8% sobre as vendas
    simplesNacionalTaxPct: 6.5,   // 6.5% alíquota média varejo
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New product form
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<FashionCategory>('Vestidos');
  const [newCostPrice, setNewCostPrice] = useState(45);
  const [newSalePrice, setNewSalePrice] = useState(139);
  const [newStock, setNewStock] = useState(20);
  const [newGrid, setNewGrid] = useState('P, M, G');
  const [newSupplier, setNewSupplier] = useState('Confecção Local');

  // ================= CÁLCULOS FINANCEIROS E DE ESTOQUE =================
  const totalUnitsSold = products.reduce((acc, p) => acc + p.unitsOutMonth, 0);
  const totalUnitsPurchased = products.reduce((acc, p) => acc + p.unitsInMonth, 0);
  const totalStockItems = products.reduce((acc, p) => acc + p.stockCurrent, 0);

  // Faturamento Bruto = Soma(preço de venda * saídas)
  const grossRevenue = products.reduce((acc, p) => acc + p.salePrice * p.unitsOutMonth, 0);

  // CMV (Custo das Mercadorias Vendidas) = Soma(custo unitário * saídas)
  const totalCMV = products.reduce((acc, p) => acc + p.costPrice * p.unitsOutMonth, 0);

  // Lucro Bruto Comercial
  const grossProfit = grossRevenue - totalCMV;
  const grossMarginPct = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;

  // Despesas Variáveis
  const cardFeesValue = (grossRevenue * fixedExpenses.cardFeesAndPackagingPct) / 100;
  const taxesValue = (grossRevenue * fixedExpenses.simplesNacionalTaxPct) / 100;
  const totalFixedExpenses = fixedExpenses.rentAndCondo + fixedExpenses.storeTeamPayroll + fixedExpenses.digitalMarketingAds;
  const totalExpenses = totalCMV + cardFeesValue + taxesValue + totalFixedExpenses;

  // Lucro Líquido Real da Empresa
  const netProfit = grossRevenue - totalExpenses;
  const netMarginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // Valor Total Imobilizado no Estoque
  const totalInventoryAtCost = products.reduce((acc, p) => acc + p.costPrice * p.stockCurrent, 0);
  const totalInventoryAtRetail = products.reduce((acc, p) => acc + p.salePrice * p.stockCurrent, 0);

  // ================= PREPARAÇÃO DE DADOS PARA GRÁFICOS =================
  // 1. Receita e Margem por Categoria
  const categoriesList: FashionCategory[] = [
    'Calças Jeans',
    'Vestidos',
    'Croppeds',
    'Saias',
    'Bermudas & Shorts'
  ];

  const categoryFinancialData = categoriesList.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const receita = items.reduce((acc, p) => acc + p.salePrice * p.unitsOutMonth, 0);
    const cmv = items.reduce((acc, p) => acc + p.costPrice * p.unitsOutMonth, 0);
    const lucro = receita - cmv;
    return {
      categoria: cat,
      receita: Math.round(receita),
      cmv: Math.round(cmv),
      lucro: Math.round(lucro),
      margemPct: receita > 0 ? Number(((lucro / receita) * 100).toFixed(1)) : 0,
    };
  });

  // 2. Entradas vs Saídas por Categoria (Unidades)
  const flowData = categoriesList.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const entradas = items.reduce((acc, p) => acc + p.unitsInMonth, 0);
    const saidas = items.reduce((acc, p) => acc + p.unitsOutMonth, 0);
    const estoque = items.reduce((acc, p) => acc + p.stockCurrent, 0);
    return {
      categoria: cat,
      entradas,
      saidas,
      estoque,
    };
  });

  // 3. Distribuição de Vendas (%)
  const salesDistributionData = categoriesList.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const vendas = items.reduce((acc, p) => acc + p.salePrice * p.unitsOutMonth, 0);
    return {
      name: cat,
      value: Math.round(vendas),
    };
  });

  // Filtered Products Table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Stock alert items
  const criticalStockItems = products.filter((p) => p.stockCurrent <= p.minStockAlert);

  // Exportar Planilha CSV
  const handleExportSpreadsheet = () => {
    const headers =
      'SKU,Nome do Produto,Categoria,Grade,Fornecedor,Preco Custo (R$),Preco Venda (R$),Margem Bruta (%),Estoque Atual,Entradas Mes,Saidas Mes,Total Vendas (R$)\n';
    const rows = products
      .map((p) => {
        const margem = (((p.salePrice - p.costPrice) / p.salePrice) * 100).toFixed(1);
        const totalVenda = (p.salePrice * p.unitsOutMonth).toFixed(2);
        return `"${p.sku}","${p.name}","${p.category}","${p.sizeGrid}","${p.supplier}",${p.costPrice.toFixed(
          2
        )},${p.salePrice.toFixed(2)},${margem}%,${p.stockCurrent},${p.unitsInMonth},${
          p.unitsOutMonth
        },${totalVenda}`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aoda_planilha_vestuario_feminino_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onLogAudit) {
      onLogAudit('Exportação de Planilha Comercial de Vestuário', 'planilha_vestuario_feminino.csv');
    }
  };

  // Enviar consulta analítica ao AODA
  const handleAskAodaAboutFashion = (queryType: 'reposicao' | 'margens' | 'geral') => {
    let prompt = '';
    if (queryType === 'reposicao') {
      prompt = `Atue como consultor de varejo fashion do AODA. Analise meu estoque de vestuário feminino: temos ${criticalStockItems.length} produtos em nível crítico (como ${criticalStockItems
        .map((i) => i.name)
        .join(', ')}). Faça um plano de compras de reposição com estimativa de capital de giro necessário e giro de estoque.`;
    } else if (queryType === 'margens') {
      prompt = `Faça um diagnóstico detalhado da margem da minha loja feminina. Faturamento Bruto de R$ ${grossRevenue.toLocaleString(
        'pt-BR'
      )}, CMV de R$ ${totalCMV.toLocaleString('pt-BR')}, Despesas Fixas de R$ ${totalFixedExpenses.toLocaleString(
        'pt-BR'
      )} e Lucro Líquido de R$ ${netProfit.toLocaleString(
        'pt-BR'
      )} (${netMarginPct.toFixed(1)}%). Destaque estratégias para elevar o markup de vestidos e calças jeans.`;
    } else {
      prompt = `Consolide uma relação de desempenho de vendas de vestuário feminino (Calças Jeans, Vestidos, Croppeds, Saias e Bermudas), apontando os top sellers de maior margem e sugestão de ações promocionais para itens de baixo giro.`;
    }
    onSendPromptToAoda(prompt);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku.trim() || !newName.trim()) return;

    const item: FashionProductItem = {
      id: `f_${Date.now()}`,
      sku: newSku.toUpperCase(),
      name: newName,
      category: newCategory,
      costPrice: Number(newCostPrice),
      salePrice: Number(newSalePrice),
      stockCurrent: Number(newStock),
      minStockAlert: 10,
      unitsInMonth: Number(newStock),
      unitsOutMonth: 0,
      sizeGrid: newGrid,
      supplier: newSupplier,
    };

    setProducts([item, ...products]);
    setShowAddModal(false);
    setFeedbackMessage(`Produto "${item.name}" adicionado com sucesso ao catálogo.`);
    setTimeout(() => setFeedbackMessage(null), 4000);

    if (onLogAudit) {
      onLogAudit('Cadastro de Novo Produto no Vestuário', `${item.sku} - ${item.name}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-pink-400" />
            Vestuário Feminino: Dashboard Estatístico & Relação de Produtos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestão integrada de calças jeans, vestidos, bermudas, croppeds e saias com entradas, saídas, CMV e margem financeira real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSpreadsheet}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Baixar planilha para Excel/Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Exportar Planilha CSV
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-brand-600 hover:from-pink-500 hover:to-brand-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-xs text-pink-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Critical Stock Alert Banner */}
      {criticalStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-200">
                Alerta de Reposição Imediata ({criticalStockItems.length} peças abaixo do estoque mínimo)
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {criticalStockItems.map((i) => `${i.name} (${i.stockCurrent} un)`).join(', ')}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleAskAodaAboutFashion('reposicao')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Calcular Reposição com IA
            </button>
          </div>
        </div>
      )}

      {/* Financial & Inventory KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Bruto */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Faturamento Bruto (Saídas)</span>
            <div className="text-2xl font-bold text-white mt-1">
              R$ {grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {totalUnitsSold} peças vendidas no mês
            </span>
          </div>
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Lucro Líquido Real & Margem Líquida */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Lucro Líquido Operacional</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-500">
              Margem Líquida: <strong>{netMarginPct.toFixed(1)}%</strong>
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* CMV e Gastos Totais */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Gastos Totais (CMV + Fixos)</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-slate-500">
              CMV: R$ {totalCMV.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | Fixos: R$ {totalFixedExpenses.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        {/* Estoque Total e Valor Imobilizado */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Estoque Ativo (Peças)</span>
            <div className="text-2xl font-bold text-cyanic-400 mt-1">
              {totalStockItems} unidades
            </div>
            <span className="text-[11px] text-slate-400">
              Valor de Custo: R$ {totalInventoryAtCost.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-cyanic-500/10 text-cyanic-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Charts: Receita x CMV por Categoria & Entradas vs Saídas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Receita x Custo x Margem (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-pink-400" />
                Desempenho Financeiro por Categoria de Vestuário
              </h3>
              <p className="text-[11px] text-slate-400">
                Receita de Vendas vs Custo de Mercadorias (CMV) e Lucro Bruto
              </p>
            </div>
            <span className="text-xs font-mono text-pink-400 font-semibold">
              Margem Média: {grossMarginPct.toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryFinancialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="categoria" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `R$${(val / 1000).toFixed(0)}k`}
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="receita" name="Faturamento" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cmv" name="Custo dos Insumos (CMV)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lucro" name="Lucro Bruto" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entradas x Saídas de Peças e Mix de Vendas (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-400" />
                Distribuição de Vendas por Categoria
              </h3>
              <p className="text-[11px] text-slate-400">
                Mix de faturamento feminino (Jeans, Vestidos, Croppeds...)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [`R$ ${Number(val).toLocaleString('pt-BR')}`, 'Vendas']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie
                  data={salesDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {salesDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Relação Completa de Produtos & Movimentação de Estoque */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              Relação de Produtos & Movimentação de Entradas e Saídas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tabela de itens de vestuário com markup, saídas (vendas), entradas (compras) e saldo disponível.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar calça, cropped, vestido, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-pink-500"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Calças Jeans">Calças Jeans</option>
              <option value="Vestidos">Vestidos</option>
              <option value="Croppeds">Croppeds</option>
              <option value="Saias">Saias</option>
              <option value="Bermudas & Shorts">Bermudas & Shorts</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">SKU / Peça</th>
                <th className="pb-3 font-semibold">Categoria</th>
                <th className="pb-3 font-semibold">Grade</th>
                <th className="pb-3 font-semibold text-right">Custo (R$)</th>
                <th className="pb-3 font-semibold text-right">Venda (R$)</th>
                <th className="pb-3 font-semibold text-right">Margem</th>
                <th className="pb-3 font-semibold text-center">Entradas</th>
                <th className="pb-3 font-semibold text-center">Saídas</th>
                <th className="pb-3 font-semibold text-right">Estoque</th>
                <th className="pb-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((item) => {
                const margin = ((item.salePrice - item.costPrice) / item.salePrice) * 100;
                const isLowStock = item.stockCurrent <= item.minStockAlert;
                return (
                  <tr key={item.id} className="hover:bg-slate-800/25 transition-colors">
                    <td className="py-3">
                      <p className="font-semibold text-slate-100">{item.name}</p>
                      <span className="text-[10px] font-mono text-slate-500">{item.sku} • {item.supplier}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-pink-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{item.sizeGrid}</td>
                    <td className="py-3 text-right font-mono text-slate-400">
                      R$ {item.costPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      R$ {item.salePrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-emerald-400">
                      {margin.toFixed(1)}%
                    </td>
                    <td className="py-3 text-center font-mono text-cyanic-400">
                      +{item.unitsInMonth}
                    </td>
                    <td className="py-3 text-center font-mono text-amber-400">
                      -{item.unitsOutMonth}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          isLowStock
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'text-slate-200'
                        }`}
                      >
                        {item.stockCurrent} un
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() =>
                          onSendPromptToAoda(
                            `Como melhorar o giro e a precificação do produto feminino "${item.name}" (SKU: ${item.sku})? Preço de custo R$ ${item.costPrice}, Preço de venda R$ ${item.salePrice}, Estoque atual de ${item.stockCurrent} un.`
                          )
                        }
                        className="text-pink-400 hover:text-pink-300 font-semibold text-[11px] flex items-center gap-1 ml-auto"
                        title="Consultar com o AODA"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auditar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consulta Rápida AODA: Assistente de Moda e Finanças */}
      <div className="rounded-2xl bg-gradient-to-r from-pink-950/40 via-slate-900 to-indigo-950/40 border border-pink-500/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h4 className="font-bold text-sm text-white">
              Consultor de Negócios e Planilhas AODA
            </h4>
          </div>
          <span className="text-xs text-pink-300 font-mono">Pronto para diagnóstico</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          O AODA correlaciona todas as tabelas de vestuário feminino, calcula pontos de equilíbrio, simula campanhas promocionais de liquidação e orça compras de reposição com fornecedores de tecidos e confecções.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => handleAskAodaAboutFashion('margens')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            📊 Analisar Margem Líquida & Markup
          </button>
          <button
            onClick={() => handleAskAodaAboutFashion('reposicao')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            ⚠️ Plano de Reposição de Estoque Baixo
          </button>
          <button
            onClick={() => handleAskAodaAboutFashion('geral')}
            className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/20 transition-colors"
          >
            ✨ Relatório Completo de Moda Feminina
          </button>
        </div>
      </div>

      {/* Modal Novo Produto */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" />
              Cadastrar Peça de Vestuário Feminino
            </h3>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nome da Peça</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Calça Jeans Skinny Cintura Alta Escura"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Código / SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: JNS-SKI-03"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as FashionCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Calças Jeans">Calças Jeans</option>
                    <option value="Vestidos">Vestidos</option>
                    <option value="Croppeds">Croppeds</option>
                    <option value="Saias">Saias</option>
                    <option value="Bermudas & Shorts">Bermudas & Shorts</option>
                    <option value="Blusas & Camisas">Blusas & Camisas</option>
                    <option value="Conjuntos">Conjuntos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newCostPrice}
                    onChange={(e) => setNewCostPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newSalePrice}
                    onChange={(e) => setNewSalePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Qtd Estoque</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Grade de Tamanhos</label>
                  <input
                    type="text"
                    placeholder="36 ao 44 ou P, M, G"
                    value={newGrid}
                    onChange={(e) => setNewGrid(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Fornecedor / Confecção</label>
                  <input
                    type="text"
                    placeholder="Nome do fabricante"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold"
                >
                  Salvar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
