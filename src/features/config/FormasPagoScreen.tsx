import React, { useState } from 'react';
import type { FormaPagoItem } from '../../types/pos';
import { CreditCard, Plus, Edit3, Trash2, X } from 'lucide-react';

interface FormasPagoScreenProps {
  formasPago: FormaPagoItem[];
  setFormasPago: React.Dispatch<React.SetStateAction<FormaPagoItem[]>>;
}

export const FormasPagoScreen: React.FC<FormasPagoScreenProps> = ({ formasPago, setFormasPago }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FormaPagoItem | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    recargo_descuento_pct: 0,
    estado: 'activo' as 'activo' | 'inactivo',
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ nombre: '', recargo_descuento_pct: 0, estado: 'activo' });
    setShowModal(true);
  };

  const handleOpenEdit = (item: FormaPagoItem) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      recargo_descuento_pct: item.recargo_descuento_pct,
      estado: item.estado,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta forma de pago?')) {
      setFormasPago((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    if (editingItem) {
      // Modificación
      setFormasPago((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, ...formData, recargo_descuento_pct: Number(formData.recargo_descuento_pct) }
            : item
        )
      );
    } else {
      // Alta
      const newItem: FormaPagoItem = {
        id: `fp-${Date.now()}`,
        nombre: formData.nombre.trim(),
        recargo_descuento_pct: Number(formData.recargo_descuento_pct),
        estado: formData.estado,
      };
      setFormasPago((prev) => [...prev, newItem]);
    }

    setShowModal(false);
  };

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <CreditCard className="w-7 h-7 text-blue-700" /> Formas de Pago
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Administración (Altas, Modificaciones y Bajas). Estos medios aparecerán en los desplegables de cobro, cuentas corrientes y gastos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Nueva Forma de Pago
        </button>
      </div>

      {/* Grid de Formas de Pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {formasPago.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{item.nombre}</h3>
                <span
                  className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.estado === 'activo'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}
                >
                  {item.estado.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-1.5">
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
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex justify-between items-center">
              <span>Recargo / Descuento:</span>
              <span className={`font-bold ${item.recargo_descuento_pct > 0 ? 'text-amber-700' : item.recargo_descuento_pct < 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                {item.recargo_descuento_pct > 0 ? `+${item.recargo_descuento_pct}% (Recargo)` : item.recargo_descuento_pct < 0 ? `${item.recargo_descuento_pct}% (Descuento)` : '0% (Sin ajuste)'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal A-M */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" /> {editingItem ? 'Modificar Forma de Pago' : 'Nueva Forma de Pago'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Medio de Pago</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Billetera Virtual MODO"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ajuste % (Positivo = Recargo, Negativo = Descuento)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.recargo_descuento_pct}
                  onChange={(e) => setFormData({ ...formData, recargo_descuento_pct: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-semibold"
                >
                  <option value="activo">Activo (Disponible en desplegables)</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
                  {editingItem ? 'Guardar Cambios' : 'Crear Forma de Pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
