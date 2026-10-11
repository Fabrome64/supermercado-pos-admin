import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { INITIAL_PRODUCTS, INITIAL_GASTOS } from '../../services/mockData';
import { 
  TrendingUp, AlertTriangle, Clock, DollarSign, Wallet, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const salesData = [
    { dia: 'Lun', ventas: 145000, gastos: 22000 },
    { dia: 'Mar', ventas: 189000, gastos: 15000 },
    { dia: 'Mié', ventas: 210000, gastos: 35000 },
    { dia: 'Jue', ventas: 178000, gastos: 12000 },
    { dia: 'Vie', ventas: 340000, gastos: 45000 },
    { dia: 'Sáb', ventas: 420000, gastos: 50000 },
    { dia: 'Dom', ventas: 290000, gastos: 18000 },
  ];

  const paymentMethodsData = [
    { name: 'Efectivo', value: 45, color: '#2563eb' },
    { name: 'T. Débito', value: 25, color: '#0284c7' },
    { name: 'T. Crédito', value: 18, color: '#7c3aed' },
    { name: 'Transferencia', value: 12, color: '#d97706' },
  ];

  const lowStockProducts = INITIAL_PRODUCTS.filter((p) => p.stock_actual <= p.stock_minimo);
  const totalValorInventario = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.stock_actual * p.costo_adquisicion, 0);
  const totalVentasSemana = salesData.reduce((acc, s) => acc + s.ventas, 0);
  const totalGastosSemana = INITIAL_GASTOS.reduce((acc, g) => acc + g.monto, 0);
  const balanceNeto = totalVentasSemana - totalGastosSemana;

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <TrendingUp className="w-7 h-7 text-blue-700" /> Dashboard Analítico y Logístico
          </h1>
          <p className="text-sm text-slate-600 font-medium">Panel centralizado de salud financiera, caja y stock en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-900 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supabase Realtime Sync: OK
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Ventas Semanales</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            ${totalVentasSemana.toLocaleString('es-AR')}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">↑ +14.2% vs semana anterior</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Valor Inventario</span>
            <Wallet className="w-5 h-5 text-blue-700" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            ${totalValorInventario.toLocaleString('es-AR')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Costo neto de mercadería</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Balance Financiero</span>
            <TrendingUp className="w-5 h-5 text-purple-700" />
          </div>
          <div className="text-3xl font-black text-blue-900 font-mono mt-2">
            ${balanceNeto.toLocaleString('es-AR')}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Ventas vs Gastos Operativos</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Quiebres de Stock</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono mt-2">
            {lowStockProducts.length} ítems
          </div>
          <span className="text-[11px] text-amber-700 font-bold mt-1 inline-block">En nivel crítico de reposición</span>
        </div>
      </div>

      {/* Gráficos de Ventas y Medios de Pago */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Ventas vs Gastos por Día</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dia" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.75rem', color: '#0f172a' }} />
                <Bar dataKey="ventas" fill="#2563eb" radius={[4, 4, 0, 0]} name="Ventas ($)" />
                <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} name="Gastos ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-900 mb-2">Desglose por Formas de Pago</h3>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethodsData} innerRadius={60} outerRadius={80} dataKey="value">
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {paymentMethodsData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-700 font-bold">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets de Alertas Críticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold border-b border-slate-200 pb-3">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-slate-900 text-base">Alertas de Stock Mínimo para Reposición</h3>
          </div>
          <div className="space-y-2">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.nombre}</h4>
                  <span className="text-xs text-slate-500 font-mono">EAN: {p.codigo_barras}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-700 font-mono font-bold text-sm block">
                    Stock: {p.stock_actual} / Mín: {p.stock_minimo}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Generar Orden de Compra</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold border-b border-slate-200 pb-3">
            <Clock className="w-5 h-5" />
            <h3 className="text-slate-900 text-base">Control de Vencimientos (Próximos 15 Días)</h3>
          </div>
          <div className="space-y-2">
            {INITIAL_PRODUCTS.filter((p) => p.fecha_vencimiento).map((p) => (
              <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.nombre}</h4>
                  <span className="text-xs text-slate-500 font-medium">Vence: {p.fecha_vencimiento}</span>
                </div>
                <span className="bg-red-100 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                  Aplicar Descuento / Oferta
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
