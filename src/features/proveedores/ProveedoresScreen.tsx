import React, { useState } from 'react';
import type { Proveedor } from '../../types/pos';
import { 
  Truck, Plus, Edit3, Trash2, X, Search, Phone, MapPin, 
  FileText, ShieldCheck, MessageCircle, Building2, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface ProveedoresScreenProps {
  proveedores: Proveedor[];
  setProveedores: React.Dispatch<React.SetStateAction<Proveedor[]>>;
}

/**
 * Formatea automáticamente el CUIT al escribir números.
 * Soporta hasta 11 dígitos, representando en formato xx.xxxxxx.x (o xx.xxxxxxxx.x para CUIT completo de 11 dígitos).
 */
export function formatCuitInput(value: string): string {
  // Extrae únicamente números
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  }
  // Desde 9 dígitos en adelante: prefijo de 2 números, bloque intermedio, y último dígito verificador
  const prefix = digits.slice(0, 2);
  const suffix = digits.slice(-1);
  const middle = digits.slice(2, -1);
  return `${prefix}.${middle}.${suffix}`;
}

export const ProveedoresScreen: React.FC<ProveedoresScreenProps> = ({
  proveedores,
  setProveedores,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activo' | 'inactivo'>('todos');

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    direccion: '',
    whatsapp: '',
    cuit: '',
    arba: '',
    observaciones: '',
    estado: 'activo' as 'activo' | 'inactivo',
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      nombre_empresa: '',
      direccion: '',
      whatsapp: '',
      cuit: '',
      arba: '',
      observaciones: '',
      estado: 'activo',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: Proveedor) => {
    setEditingItem(item);
    setFormData({
      nombre_empresa: item.nombre_empresa,
      direccion: item.direccion,
      whatsapp: item.whatsapp,
      cuit: item.cuit,
      arba: item.arba,
      observaciones: item.observaciones || '',
      estado: item.estado,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, nombre: string) => {
    if (confirm(`¿Está seguro de eliminar al proveedor "${nombre}"?`)) {
      setProveedores((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleEstado = (id: string) => {
    setProveedores((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, estado: p.estado === 'activo' ? 'inactivo' : 'activo' } : p
      )
    );
  };

  const handleCuitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCuitInput(e.target.value);
    setFormData((prev) => ({ ...prev, cuit: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_empresa.trim()) {
      alert('Por favor ingrese el Nombre de la Empresa');
      return;
    }
    if (!formData.cuit.trim()) {
      alert('Por favor ingrese el CUIT del proveedor');
      return;
    }

    if (editingItem) {
      // Modificación
      setProveedores((prev) =>
        prev.map((p) =>
          p.id === editingItem.id
            ? {
                ...p,
                nombre_empresa: formData.nombre_empresa.trim(),
                direccion: formData.direccion.trim(),
                whatsapp: formData.whatsapp.trim(),
                cuit: formData.cuit.trim(),
                arba: formData.arba.trim(),
                observaciones: formData.observaciones.trim() || undefined,
                estado: formData.estado,
              }
            : p
        )
      );
    } else {
      // Alta
      const nuevoProveedor: Proveedor = {
        id: `prov-${Date.now()}`,
        nombre_empresa: formData.nombre_empresa.trim(),
        direccion: formData.direccion.trim(),
        whatsapp: formData.whatsapp.trim(),
        cuit: formData.cuit.trim(),
        arba: formData.arba.trim(),
        observaciones: formData.observaciones.trim() || undefined,
        estado: formData.estado,
      };
      setProveedores((prev) => [nuevoProveedor, ...prev]);
    }

    setShowModal(false);
  };

  // Filtrado de proveedores
  const filteredProveedores = proveedores.filter((p) => {
    const matchesSearch =
      p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cuit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.arba && p.arba.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'todos' || p.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActivos = proveedores.filter((p) => p.estado === 'activo').length;
  const conArba = proveedores.filter((p) => p.arba && p.arba.trim().length > 0).length;

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <Truck className="w-7 h-7 text-blue-700" />
            Proveedores & Distribuidores
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gestión integral de empresas proveedoras, datos fiscales (CUIT, ARBA), contacto directo y condiciones comerciales.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registrados</p>
            <p className="text-2xl font-black text-[#0B192C]">{proveedores.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Proveedores Activos</p>
            <p className="text-2xl font-black text-emerald-700">{totalActivos}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Con CUIT Registrado</p>
            <p className="text-2xl font-black text-indigo-900">{proveedores.filter((p) => Boolean(p.cuit)).length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inscripción ARBA</p>
            <p className="text-2xl font-black text-amber-800">{conArba}</p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por Empresa, CUIT, Dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filtrar estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'todos' | 'activo' | 'inactivo')}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="todos">Todos los Estados</option>
            <option value="activo">Solo Activos</option>
            <option value="inactivo">Solo Inactivos</option>
          </select>
        </div>
      </div>

      {/* Grid de Proveedores */}
      {filteredProveedores.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No se encontraron proveedores</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchTerm ? 'Intente con otros términos de búsqueda.' : 'Presione "Nuevo Proveedor" para dar de alta la primera empresa proveedora.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProveedores.map((item) => {
            const cleanPhone = item.whatsapp.replace(/\D/g, '');
            const waUrl = cleanPhone ? `https://wa.me/549${cleanPhone}` : null;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado de la tarjeta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0B192C] text-base leading-tight">
                          {item.nombre_empresa}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            CUIT: {item.cuit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleEstado(item.id)}
                      title="Cambiar estado"
                      className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        item.estado === 'activo'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {item.estado === 'activo' ? '● Activo' : '○ Inactivo'}
                    </button>
                  </div>

                  {/* Datos del Proveedor */}
                  <div className="space-y-2 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{item.direccion || 'Sin dirección especificada'}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{item.whatsapp || 'Sin WhatsApp'}</span>
                      </div>
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Chat WhatsApp
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-medium text-slate-800">
                        ARBA: <span className="text-slate-600 font-normal">{item.arba || 'No especificado'}</span>
                      </span>
                    </div>

                    {item.observaciones && (
                      <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 leading-relaxed">
                        <span className="font-bold block mb-0.5">Observaciones:</span>
                        {item.observaciones}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Modificar Proveedor"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.nombre_empresa)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Eliminar Proveedor"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Alta / Modificación */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#0B192C] flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                {editingItem ? 'Modificar Proveedor' : 'Alta de Nuevo Proveedor'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nombre Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Distribuidora Mayorista San Cayetano S.R.L."
                  value={formData.nombre_empresa}
                  onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CUIT (Formato xx.xxxxxx.x) *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="Escriba números (ej: 307098458)"
                    value={formData.cuit}
                    onChange={handleCuitChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-blue-900 bg-slate-50"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-blue-500 shrink-0" />
                    Escriba solo números; los puntos se formatean automáticamente.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1145678901 o 11-4567-8901"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Juan B. Justo 4520, CABA"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ARBA (Inscripción / Alícuota)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Inscripto - Agente Percepción 1.5% o N° 902-334455-1"
                    value={formData.arba}
                    onChange={(e) => setFormData({ ...formData, arba: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value as 'activo' | 'inactivo' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="activo">Activo (Disponible en el sistema)</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Observaciones / Condiciones Comerciales
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Días de entrega (martes y jueves), condiciones de pago, pedido mínimo, contactos de reparto..."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {editingItem ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
