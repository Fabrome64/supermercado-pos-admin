import React, { useState } from 'react';
import type { Cliente } from '../../types/pos';
import { INITIAL_CLIENTS } from '../../services/mockData';
import { Users, Plus, Search, DollarSign, FileText, CreditCard } from 'lucide-react';

export const ClientsScreen: React.FC = () => {
  const [clients, setClients] = useState<Cliente[]>(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [montoPago, setMontoPago] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dni_cuit.includes(searchTerm)
  );

  const handleRegisterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !montoPago) return;

    const numPago = Number(montoPago);
    setClients(
      clients.map((c) =>
        c.id === selectedClient.id
          ? { ...c, saldo_deudor: Math.max(0, c.saldo_deudor - numPago) }
          : c
      )
    );

    setShowPaymentModal(false);
    setMontoPago('');
    alert(`Pago de $${numPago.toFixed(2)} asentado en la cuenta corriente de ${selectedClient.nombre_razon_social}.`);
  };

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <Users className="w-7 h-7 text-blue-700" /> Clientes y Cuentas Corrientes
          </h1>
          <p className="text-sm text-slate-600 font-medium">Control de crédito asignado, pagos parciales y saldos en tiempo real</p>
        </div>

        <button
          onClick={() => alert('Creación de cliente habilitada')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
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
                Límite Crédito: ${client.limite_credito.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Saldo Deudor Actual</span>
                <span className={`text-2xl font-black font-mono ${client.saldo_deudor > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  ${client.saldo_deudor.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={client.saldo_deudor === 0}
                  onClick={() => {
                    setSelectedClient(client);
                    setShowPaymentModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" /> Asentar Pago
                </button>
                <button
                  onClick={() => alert(`Generando extracto de cuenta en PDF para ${client.nombre_razon_social}...`)}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-300 cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4" /> Extracto
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && selectedClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" /> Registro de Pago de Cuenta Corriente
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRegisterPayment} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                <p><strong className="text-slate-900">Cliente:</strong> {selectedClient.nombre_razon_social}</p>
                <p><strong className="text-slate-900">Saldo Pendiente:</strong> ${selectedClient.saldo_deudor.toFixed(2)}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Monto a Abonar ($)</label>
                <input
                  type="number"
                  required
                  max={selectedClient.saldo_deudor}
                  placeholder="ej. 5000"
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-lg rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
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
    </div>
  );
};
