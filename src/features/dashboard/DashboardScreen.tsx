import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '../../services/mockData';
import { 
  TrendingUp, AlertTriangle, Clock, DollarSign, Wallet, ShieldAlert, CheckCircle2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, CreditCard
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  // Estado para la navegación del Calendario Mensual
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // Octubre 2026 por defecto

  // Datos mock simulados por día del mes
  const generateMonthData = (year: number, month: number): Record<number, { ventas: number; gastos: number }> => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data: Record<number, { ventas: number; gastos: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const seed = (d * 17 + month * 31) % 100;
      const ventas = seed > 10 ? (seed * 4200 + 18500) : 0;
      const gastos = (d % 4 === 0) ? (seed * 850 + 4500) : (d % 7 === 0 ? 12500 : 0);
      data[d] = { ventas, gastos };
    }
    return data;
  };

  const monthYearStr = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
  const formattedMonthYear = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Ajustar a Lunes = 0

  const monthData = generateMonthData(year, month);

  // Calcular acumulados del mes seleccionado
  let totalVentasMes = 0;
  let totalGastosMes = 0;
  Object.values(monthData).forEach((d) => {
    totalVentasMes += d.ventas;
    totalGastosMes += d.gastos;
  });
  const balanceNetoMes = totalVentasMes - totalGastosMes;

  // Ventas del día actual (Día 10)
  const hoyDia = 10;
  const ventasHoy = monthData[hoyDia]?.ventas || 145000.00;
  const gastosHoy = monthData[hoyDia]?.gastos || 22000.00;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Formas de pago (solo texto, valor y porcentaje, SIN gráfico circular)
  const paymentMethodsList = [
    { name: 'Efectivo', porcentaje: 45, monto: totalVentasMes * 0.45 },
    { name: 'Tarjeta de Débito', porcentaje: 25, monto: totalVentasMes * 0.25 },
    { name: 'Tarjeta de Crédito', porcentaje: 18, monto: totalVentasMes * 0.18 },
    { name: 'Transferencia Bancaria', porcentaje: 12, monto: totalVentasMes * 0.12 },
  ];

  const lowStockProducts = INITIAL_PRODUCTS.filter((p) => p.stock_actual <= p.stock_minimo);
  const totalValorInventario = INITIAL_PRODUCTS.reduce((acc, p) => acc + p.stock_actual * p.costo_adquisicion, 0);

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <TrendingUp className="w-7 h-7 text-blue-700" /> Dashboard Analítico y Logístico
          </h1>
          <p className="text-sm text-slate-600 font-medium">Panel centralizado de ventas, caja y stock en tiempo real</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-blue-900 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Supabase Realtime Sync: OK
        </div>
      </div>

      {/* KPI Cards: Ventas del Día y Compras/Gastos del Día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Ventas del Día</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            ${ventasHoy.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">✔ Registro diario en tiempo real</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Compras / Gastos del Día</span>
            <Wallet className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600 font-mono mt-2">
            ${gastosHoy.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-red-700 font-bold mt-1 inline-block">Egresos operativos del día</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Valor Total Inventario</span>
            <Wallet className="w-5 h-5 text-blue-700" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono mt-2">
            ${totalValorInventario.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">Costo neto de mercadería</span>
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

      {/* SECCIÓN 1: Calendario Mensual de Ventas vs Gastos acumulados con controles < > */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-700" />
            <h2 className="text-lg font-bold text-[#0B192C]">Calendario de Ventas y Gastos Diarios</h2>
          </div>

          {/* Navegador de Meses < > */}
          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Mes Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-sm text-slate-900 font-mono min-w-[140px] text-center">
              {formattedMonthYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Mes Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grilla del Calendario */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Header Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-600 uppercase">
              <div className="p-2 bg-slate-100 rounded-lg">Lun</div>
              <div className="p-2 bg-slate-100 rounded-lg">Mar</div>
              <div className="p-2 bg-slate-100 rounded-lg">Mié</div>
              <div className="p-2 bg-slate-100 rounded-lg">Jue</div>
              <div className="p-2 bg-slate-100 rounded-lg">Vie</div>
              <div className="p-2 bg-slate-100 rounded-lg bg-blue-50 text-blue-900">Sáb</div>
              <div className="p-2 bg-slate-100 rounded-lg bg-blue-50 text-blue-900">Dom</div>
            </div>

            {/* Celdas de los días */}
            <div className="grid grid-cols-7 gap-2">
              {/* Celdas vacías del inicio del mes */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[85px] bg-slate-50/50 rounded-xl border border-slate-100 p-2"></div>
              ))}

              {/* Días del mes con Ventas y Gastos */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const data = monthData[dayNum] || { ventas: 0, gastos: 0 };
                const netDay = data.ventas - data.gastos;

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[85px] p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                      dayNum === hoyDia
                        ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-black font-mono px-1.5 py-0.5 rounded ${
                        dayNum === hoyDia ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {dayNum}
                      </span>
                      {netDay > 0 && <span className="text-[10px] text-emerald-700 font-bold">+${netDay.toLocaleString('es-AR')}</span>}
                    </div>

                    <div className="space-y-0.5 text-[11px] font-mono">
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>V:</span>
                        <span>${data.ventas.toLocaleString('es-AR')}</span>
                      </div>
                      {data.gastos > 0 && (
                        <div className="flex justify-between text-red-600 font-semibold">
                          <span>G:</span>
                          <span>-${data.gastos.toLocaleString('es-AR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pie de Calendario: Sumatoria y Acumulado Mensual */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Total Ventas Mes:</span>
            <span className="font-mono text-base font-black text-emerald-700">
              ${totalVentasMes.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <span>Total Gastos Mes:</span>
            <span className="font-mono text-base font-black text-red-600">
              ${totalGastosMes.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-semibold text-slate-900 border-l border-slate-300 pl-4">
            <span>Acumulado Neto Mes:</span>
            <span className="font-mono text-lg font-black text-blue-900">
              ${balanceNetoMes.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Desglose por Formas de Venta (SOLO TEXTO, MONTO Y PORCENTAJE - SIN GRÁFICO) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <CreditCard className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">Desglose por Formas de Venta y Cobro</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethodsList.map((pm) => (
            <div key={pm.name} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase">{pm.name}</span>
              <div className="my-2">
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ${pm.monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono inline-block mt-1">
                  {pm.porcentaje}% del Total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: Widgets de Alertas Críticas (Stock Mínimo & Vencimientos) */}
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
