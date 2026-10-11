import React, { useState } from 'react';
import type { Cliente, FormaPagoItem, FormaPago } from '../../types/pos';
import { INITIAL_CLIENTS } from '../../services/mockData';
import { Users, Plus, Search, DollarSign, FileText, CreditCard, Calendar, Printer, X } from 'lucide-react';

interface MovimientoCuenta {
  id: string;
  fecha: string;
  tipo: 'compra' | 'pago';
  descripcion: string;
  formaPago?: string;
  monto: number;
  saldoResultante: number;
}

interface ClientsScreenProps {
  formasPago?: FormaPagoItem[];
}

export const ClientsScreen: React.FC<ClientsScreenProps> = ({ formasPago = [] }) => {
  const [clients, setClients] = useState<Cliente[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  const activeFormasPago = formasPago.filter(fp => fp.estado === 'activo');

  // Formulario Nuevo Cliente
  const [newClientForm, setNewClientForm] = useState({
    nombre_razon_social: '',
    dni_cuit: '',
    telefono: '',
    direccion: '',
    limite_credito: 50000,
  });

  // Formulario Asentar Pago
  const [paymentForm, setPaymentForm] = useState({
    fecha: new Date().toISOString().split('T')[0], // Fecha del sistema
    monto: '',
    formaPago: 'efectivo' as FormaPago,
    observacion: '',
  });

  // Historial de movimientos simulado por cliente
  const [movimientos, setMovimientos] = useState<Record<string, MovimientoCuenta[]>>({
    c1: [
      { id: 'm1', fecha: '2026-10-01', tipo: 'compra', descripcion: 'Compra Ticket #00452', monto: 18500.00, saldoResultante: 18500.00 },
      { id: 'm2', fecha: '2026-10-05', tipo: 'pago', descripcion: 'Pago parcial a cuenta', formaPago: 'Efectivo', monto: -6000.00, saldoResultante: 12500.00 },
    ],
    c2: [
      { id: 'm3', fecha: '2026-10-02', tipo: 'compra', descripcion: 'Compra Ticket #00460', monto: 8200.00, saldoResultante: 8200.00 },
      { id: 'm4', fecha: '2026-10-08', tipo: 'pago', descripcion: 'Cancelación total saldo', formaPago: 'Transferencia', monto: -8200.00, saldoResultante: 0.00 },
    ],
  });

  const filteredClients = clients.filter(
    (c) =>
      c.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni_cuit.includes(searchTerm)
  );

  // Guardar Nuevo Cliente
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.nombre_razon_social || !newClientForm.dni_cuit) return;

    const newClient: Cliente = {
      id: `c-${Date.now()}`,
      nombre_razon_social: newClientForm.nombre_razon_social,
      dni_cuit: newClientForm.dni_cuit,
      telefono: newClientForm.telefono,
      direccion: newClientForm.direccion,
      limite_credito: Number(newClientForm.limite_credito),
      saldo_deudor: 0.00,
      estado: 'activo',
    };

    setClients([newClient, ...clients]);
    setShowNewClientModal(false);
    setNewClientForm({
      nombre_razon_social: '',
      dni_cuit: '',
      telefono: '',
      direccion: '',
      limite_credito: 50000,
    });
  };

  // Asentar Pago con Fecha, Monto en Formato AR y Medio de Pago
  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !paymentForm.monto) return;

    const numMonto = parseFloat(paymentForm.monto);
    if (isNaN(numMonto) || numMonto <= 0) return;

    const nuevoSaldo = Math.max(0, selectedClient.saldo_deudor - numMonto);

    setClients(
      clients.map((c) =>
        c.id === selectedClient.id ? { ...c, saldo_deudor: nuevoSaldo } : c
      )
    );

    const nuevoMovimiento: MovimientoCuenta = {
      id: `m-${Date.now()}`,
      fecha: paymentForm.fecha,
      tipo: 'pago',
      descripcion: `Pago a cuenta (${paymentForm.formaPago.toUpperCase()})`,
      formaPago: paymentForm.formaPago,
      monto: -numMonto,
      saldoResultante: nuevoSaldo,
    };

    setMovimientos((prev) => ({
      ...prev,
      [selectedClient.id]: [...(prev[selectedClient.id] || []), nuevoMovimiento],
    }));

    setShowPaymentModal(false);
    setPaymentForm({
      fecha: new Date().toISOString().split('T')[0],
      monto: '',
      formaPago: 'efectivo',
      observacion: '',
    });
  };

  const handleOpenHistory = (client: Cliente) => {
    setSelectedClient(client);
    setShowHistoryModal(true);
  };

  const handlePrintHistory = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <Users className="w-7 h-7 text-blue-700" /> Clientes y Cuentas Corrientes
          </h1>
          <p className="text-sm text-slate-600 font-medium">Control de crédito asignado, pagos parciales e historial de movimientos</p>
        </div>

        <button
          onClick={() => setShowNewClientModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por cliente o DNI/CUIT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{client.nombre_razon_social}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">DNI/CUIT: {client.dni_cuit}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Tel: {client.telefono || 'Sin teléfono'}</p>
              </div>
              <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                Límite: ${client.limite_credito.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Saldo Deudor Actual</span>
                <span className={`text-2xl font-black font-mono ${client.saldo_deudor > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  ${client.saldo_deudor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={client.saldo_deudor === 0}
                  onClick={() => {
                    setSelectedClient(client);
                    setPaymentForm({
                      fecha: new Date().toISOString().split('T')[0],
                      monto: '',
                      formaPago: 'efectivo',
                      observacion: '',
                    });
                    setShowPaymentModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" /> Asentar Pago
                </button>
                <button
                  onClick={() => handleOpenHistory(client)}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-300 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-blue-700" /> Historial de Movimientos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ALTA DE NUEVO CLIENTE (100% FUNCIONAL) */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Alta de Nuevo Cliente
              </h3>
              <button onClick={() => setShowNewClientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre o Razón Social</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distribuidora San Martín S.R.L."
                  value={newClientForm.nombre_razon_social}
                  onChange={(e) => setNewClientForm({ ...newClientForm, nombre_razon_social: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">DNI / CUIT</label>
                  <input
                    type="text"
                    required
                    placeholder="20-33445566-9"
                    value={newClientForm.dni_cuit}
                    onChange={(e) => setNewClientForm({ ...newClientForm, dni_cuit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    placeholder="11-4567-8901"
                    value={newClientForm.telefono}
                    onChange={(e) => setNewClientForm({ ...newClientForm, telefono: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dirección / Localidad</label>
                <input
                  type="text"
                  placeholder="Av. San Martín 1234"
                  value={newClientForm.direccion}
                  onChange={(e) => setNewClientForm({ ...newClientForm, direccion: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Límite de Crédito Asignado ($)</label>
                <input
                  type="number"
                  required
                  value={newClientForm.limite_credito}
                  onChange={(e) => setNewClientForm({ ...newClientForm, limite_credito: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASENTAR PAGO (CON FECHA SISTEMA MODIFICABLE, MONTO AR Y FORMA DE PAGO) */}
      {showPaymentModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" /> Registro de Pago de Cuenta Corriente
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p><strong className="text-slate-900">Cliente:</strong> {selectedClient.nombre_razon_social}</p>
                <p><strong className="text-slate-900">Saldo Deudor Actual:</strong> ${selectedClient.saldo_deudor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>

              {/* Fecha del Sistema con opción de cambiarla */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-700" /> Fecha del Pago
                </label>
                <input
                  type="date"
                  required
                  value={paymentForm.fecha}
                  onChange={(e) => setPaymentForm({ ...paymentForm, fecha: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Monto con Decimales en Formato Monetario */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Monto a Abonar ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  max={selectedClient.saldo_deudor}
                  placeholder="0.00"
                  value={paymentForm.monto}
                  onChange={(e) => setPaymentForm({ ...paymentForm, monto: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-lg font-bold rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Máximo a abonar: ${selectedClient.saldo_deudor.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Selector Forma de Pago Dinámico */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Forma de Pago Utilizada</label>
                <select
                  value={paymentForm.formaPago}
                  onChange={(e) => setPaymentForm({ ...paymentForm, formaPago: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none font-semibold"
                >
                  {activeFormasPago.length > 0 ? (
                    activeFormasPago.map((fp) => (
                      <option key={fp.id} value={fp.nombre}>
                        {fp.nombre}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Efectivo en Caja">Efectivo en Caja</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                      <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: HISTORIAL DE MOVIMIENTOS Y GENERACIÓN DE PDF / IMPRESIÓN */}
      {showHistoryModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" /> Historial de Movimientos de Cuenta Corriente
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 print:p-0">
              {/* Encabezado del Reporte */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedClient.nombre_razon_social}</h4>
                  <p className="text-xs text-slate-500 font-mono">DNI/CUIT: {selectedClient.dni_cuit} | Tel: {selectedClient.telefono || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold uppercase block">Saldo Actual</span>
                  <span className="text-xl font-black font-mono text-blue-900">
                    ${selectedClient.saldo_deudor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Tabla de Movimientos */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-900 text-xs text-white uppercase font-bold">
                    <tr>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Concepto / Comprobante</th>
                      <th className="p-3">Medio</th>
                      <th className="p-3 text-right">Importe</th>
                      <th className="p-3 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-xs">
                    {(movimientos[selectedClient.id] || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">
                          No existen movimientos registrados para este cliente.
                        </td>
                      </tr>
                    ) : (
                      (movimientos[selectedClient.id] || []).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">{m.fecha}</td>
                          <td className="p-3 font-sans font-medium text-slate-800">{m.descripcion}</td>
                          <td className="p-3 text-slate-500">{m.formaPago || '-'}</td>
                          <td className={`p-3 text-right font-bold ${m.monto > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {m.monto > 0 ? `+$${m.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : `-$${Math.abs(m.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
                          </td>
                          <td className="p-3 text-right font-black text-slate-900">
                            ${m.saldoResultante.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer con Botón de Impresión / PDF */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrintHistory}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" /> Imprimir / Exportar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
