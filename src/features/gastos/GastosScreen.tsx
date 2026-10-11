import React, { useState } from 'react';
import type { GastoItem, FormaPagoItem, Proveedor } from '../../types/pos';
import { Wallet, Plus, Edit3, Trash2, X, Truck } from 'lucide-react';

interface GastosScreenProps {
  gastos: GastoItem[];
  setGastos: React.Dispatch<React.SetStateAction<GastoItem[]>>;
  formasPago: FormaPagoItem[];
  proveedores?: Proveedor[];
}

export const GastosScreen: React.FC<GastosScreenProps> = ({ gastos, setGastos, formasPago, proveedores = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GastoItem | null>(null);

  // Formas de pago activas para el desplegable
  const activeFormasPago = formasPago.filter((fp) => fp.estado === 'activo');
  const activeProveedores = proveedores.filter((p) => p.estado === 'activo');

  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'Servicios',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    forma_pago_nombre: activeFormasPago[0]?.nombre || 'Efectivo en Caja',
    comprobante: '',
    proveedor_nombre: '',
  });

  const categories = ['Servicios', 'Insumos', 'Logística', 'Mantenimiento', 'Sueldos', 'Alquiler', 'Varios'];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      concepto: '',
      categoria: 'Servicios',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      forma_pago_nombre: activeFormasPago[0]?.nombre || 'Efectivo en Caja',
      comprobante: '',
      proveedor_nombre: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: GastoItem) => {
    setEditingItem(item);
    setFormData({
      concepto: item.concepto,
      categoria: item.categoria,
      monto: item.monto.toString(),
      fecha: item.fecha,
      forma_pago_nombre: item.forma_pago_nombre,
      comprobante: item.comprobante || '',
      proveedor_nombre: item.proveedor_nombre || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este gasto operativo?')) {
      setGastos((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.concepto.trim() || !formData.monto) return;

    const numMonto = parseFloat(formData.monto);
    if (isNaN(numMonto) || numMonto <= 0) return;

    if (editingItem) {
      // Modificación
      setGastos((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                monto: numMonto,
                proveedor_nombre: formData.proveedor_nombre || undefined,
              }
            : item
        )
      );
    } else {
      // Alta
      const newItem: GastoItem = {
        id: `g-${Date.now()}`,
        concepto: formData.concepto.trim(),
        categoria: formData.categoria,
        monto: numMonto,
        fecha: formData.fecha,
        forma_pago_nombre: formData.forma_pago_nombre,
        comprobante: formData.comprobante.trim() || undefined,
        proveedor_nombre: formData.proveedor_nombre || undefined,
      };
      setGastos((prev) => [newItem, ...prev]);
    }

    setShowModal(false);
  };

  const totalGastosMonto = gastos.reduce((acc, g) => acc + g.monto, 0);

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <Wallet className="w-7 h-7 text-blue-700" /> Control de Gastos Operativos
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Registro, categorización y administración (Altas, Modificaciones y Bajas) de egresos del supermercado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Egresos Registrados</span>
            <span className="text-lg font-black font-mono text-red-600">
              ${totalGastosMonto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo Gasto
          </button>
        </div>
      </div>

      {/* Grid de Gastos */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-900 text-xs font-bold text-white uppercase tracking-wider">
              <tr>
                <th className="p-4">Fecha</th>
                <th className="p-4">Concepto / Descripción</th>
                <th className="p-4">Proveedor</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Medio de Pago</th>
                <th className="p-4">Comprobante</th>
                <th className="p-4 text-right">Monto ($)</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gastos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    No hay gastos operativos registrados en este período.
                  </td>
                </tr>
              ) : (
                gastos.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-semibold text-slate-900">{item.fecha}</td>
                    <td className="p-4 font-bold text-slate-900">{item.concepto}</td>
                    <td className="p-4">
                      {item.proveedor_nombre ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs px-2 py-0.5 rounded-md font-semibold">
                          <Truck className="w-3 h-3 text-amber-700" />
                          {item.proveedor_nombre}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-300 font-semibold">
                        {item.categoria}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-md border border-blue-200 font-bold">
                        {item.forma_pago_nombre}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{item.comprobante || '-'}</td>
                    <td className="p-4 text-right font-mono font-black text-red-600 text-base">
                      ${item.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Modificar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal A-M */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-400" /> {editingItem ? 'Modificar Gasto' : 'Nuevo Registro de Gasto'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Concepto / Descripción del Gasto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mantenimiento grupo electrógeno"
                  value={formData.concepto}
                  onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Monto ($ con decimales)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.monto}
                    onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {/* Desplegable alimentado por las Formas de Pago cargadas */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Forma de Pago (Desplegable)</label>
                  <select
                    value={formData.forma_pago_nombre}
                    onChange={(e) => setFormData({ ...formData, forma_pago_nombre: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-semibold"
                  >
                    {activeFormasPago.map((fp) => (
                      <option key={fp.id} value={fp.nombre}>
                        {fp.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Proveedor / Empresa Asociada (Desplegable Opcional)
                </label>
                <select
                  value={formData.proveedor_nombre}
                  onChange={(e) => setFormData({ ...formData, proveedor_nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-semibold"
                >
                  <option value="">-- Sin proveedor asociado / Gasto interno --</option>
                  {activeProveedores.map((p) => (
                    <option key={p.id} value={p.nombre_empresa}>
                      {p.nombre_empresa} (CUIT: {p.cuit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nº Comprobante / Factura (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. FAC-0001-0004928"
                  value={formData.comprobante}
                  onChange={(e) => setFormData({ ...formData, comprobante: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Gasto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
