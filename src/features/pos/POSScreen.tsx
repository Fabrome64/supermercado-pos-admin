import React, { useState } from 'react';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';
import { useRealtimeStock } from '../../hooks/useRealtimeStock';
import type { Producto, CartItem, FormaPago, Cliente } from '../../types/pos';
import { INITIAL_PRODUCTS, INITIAL_CLIENTS } from '../../services/mockData';
import { 
  ShoppingCart, Barcode, CreditCard, Trash2, Plus, Minus, Search, 
  CheckCircle, User, AlertTriangle, Printer, Banknote, ShieldCheck
} from 'lucide-react';

export const POSScreen: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);
  const [clients] = useState<Cliente[]>(INITIAL_CLIENTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<{ message: string; type: 'success' | 'warning' | 'error' | 'info' }>({
    message: 'Listo para escanear. Utilice el lector físico de código de barras USB/BT.',
    type: 'info',
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [scannedNotFoundCode, setScannedNotFoundCode] = useState('');
  
  const [newProductForm, setNewProductForm] = useState({
    nombre: '',
    categoria: 'General',
    costo: 1000,
    margen: 35,
    stock: 20,
    vencimiento: '',
  });

  const [formaPago, setFormaPago] = useState<FormaPago>('efectivo');
  const [selectedClienteId, setSelectedClienteId] = useState<string>('');
  const [montoPagado, setMontoPagado] = useState<string>('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState<number>(0);
  const [saleCompleted, setSaleCompleted] = useState<boolean>(false);

  useRealtimeStock();

  const handleScanCode = (code: string) => {
    const found = products.find((p) => p.codigo_barras === code && p.estado === 'activo');
    if (found) {
      addToCart(found);
      setScanStatus({
        message: `✔ Ítem agregado: ${found.nombre} ($${found.precio_venta.toFixed(2)})`,
        type: 'success',
      });
    } else {
      setScannedNotFoundCode(code);
      setScanStatus({
        message: `⚠ Código no registrado (${code}). Se requiere alta rápida.`,
        type: 'warning',
      });
      setShowQuickAddModal(true);
    }
  };

  useBarcodeScanner({ onScan: handleScanCode });

  const addToCart = (product: Producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                subtotal: (item.cantidad + 1) * item.precio_venta,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cantidad: 1,
          subtotal: product.precio_venta,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.cantidad + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              cantidad: newQty,
              subtotal: newQty * item.precio_venta,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode.trim());
    setManualCode('');
  };

  const handleCreateQuickProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const precioFinal = newProductForm.costo * (1 + newProductForm.margen / 100);
    const newProd: Producto = {
      id: `p-${Date.now()}`,
      codigo_barras: scannedNotFoundCode,
      nombre: newProductForm.nombre || `Producto ${scannedNotFoundCode}`,
      categoria: newProductForm.categoria,
      costo_adquisicion: Number(newProductForm.costo),
      margen_ganancia: Number(newProductForm.margen),
      precio_venta: Number(precioFinal),
      stock_actual: Number(newProductForm.stock),
      stock_minimo: 5,
      fecha_vencimiento: newProductForm.vencimiento || undefined,
      estado: 'activo',
    };

    setProducts((prev) => [newProd, ...prev]);
    addToCart(newProd);
    setShowQuickAddModal(false);
    setScanStatus({
      message: `✔ Producto guardado y agregado al carrito: ${newProd.nombre}`,
      type: 'success',
    });
  };

  const subtotalTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const montoDescuento = (subtotalTotal * descuentoPorcentaje) / 100;
  const totalFinal = Math.max(0, subtotalTotal - montoDescuento);

  const numMontoPagado = Number(montoPagado) || totalFinal;
  const vueltoCalculado = Math.max(0, numMontoPagado - totalFinal);

  const handleCompleteSale = () => {
    setProducts((prev) =>
      prev.map((prod) => {
        const itemEnCarrito = cart.find((c) => c.id === prod.id);
        if (itemEnCarrito) {
          return {
            ...prod,
            stock_actual: Math.max(0, prod.stock_actual - itemEnCarrito.cantidad),
          };
        }
        return prod;
      })
    );

    setSaleCompleted(true);
    setTimeout(() => {
      setCart([]);
      setShowPaymentModal(false);
      setSaleCompleted(false);
      setMontoPagado('');
      setSelectedClienteId('');
      setScanStatus({
        message: '✔ Venta registrada exitosamente. Ticket impreso en POS 80mm.',
        type: 'success',
      });
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#E6E6FA] text-slate-900 font-sans overflow-hidden p-6 gap-6">
      {/* Panel Izquierdo - Carrito y Búsqueda */}
      <div className="flex-1 flex flex-col p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        {/* Header / Barcode Status */}
        <div className="flex justify-between items-center gap-4 mb-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-blue-700" />
            <h1 className="text-xl font-bold text-slate-900">Caja Registradora (POS)</h1>
          </div>

          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative">
              <Barcode className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Escaneo manual / EAN..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl pl-10 pr-3 py-2 w-64 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" /> Buscar
            </button>
          </form>
        </div>

        {/* Barcode Scanner Feed Notification */}
        <div
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            scanStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : scanStatus.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>{scanStatus.message}</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
            Escáner HID: Activo
          </span>
        </div>

        {/* Carrito List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2.5 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                <Barcode className="w-10 h-10 text-blue-600 opacity-60" />
              </div>
              <p className="text-lg font-bold text-slate-700">Punto de Venta Listo</p>
              <p className="text-sm text-slate-500 mt-1 max-w-sm text-center">
                Pase el código de barras por el lector o ingréselo manualmente en la barra superior.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-all shadow-2xs"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-slate-900 text-base leading-tight">{item.nombre}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-mono">
                    <span>EAN: {item.codigo_barras}</span>
                    <span>•</span>
                    <span>P. Unit: ${item.precio_venta.toFixed(2)}</span>
                    <span>•</span>
                    <span className={item.stock_actual <= item.stock_minimo ? 'text-amber-700 font-bold' : ''}>
                      Stock: {item.stock_actual} un.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white rounded-lg border border-slate-300 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-mono font-bold text-sm text-blue-900">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="w-28 text-right font-mono font-black text-lg text-blue-900">
                    ${item.subtotal.toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Panel Derecho - Totales y Cobro */}
      <div className="w-96 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Resumen Venta</h2>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-mono font-bold">
              {cart.reduce((a, b) => a + b.cantidad, 0)} ítems
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-600 block uppercase">Descuento Global (%)</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDescuentoPorcentaje(pct)}
                  className={`py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                    descuentoPorcentaje === pct
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">${subtotalTotal.toFixed(2)}</span>
            </div>
            {montoDescuento > 0 && (
              <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                <span>Descuento ({descuentoPorcentaje}%):</span>
                <span className="font-mono">-${montoDescuento.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block mb-1">
                TOTAL A COBRAR
              </span>
              <div className="text-4xl font-black text-blue-900 font-mono tracking-tight">
                ${totalFinal.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            disabled={cart.length === 0}
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 transition-all cursor-pointer"
          >
            <CreditCard className="w-6 h-6" /> PROCESAR PAGO (F12)
          </button>

          {cart.length > 0 && (
            <button
              onClick={() => setCart([])}
              className="w-full py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs rounded-xl transition-all border border-slate-200"
            >
              Cancelar y Limpiar Carrito
            </button>
          )}
        </div>
      </div>

      {/* Modal de Cobro */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Banknote className="w-6 h-6 text-blue-400" />
                <h2 className="text-lg font-bold">Cobro y Finalización de Venta</h2>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
                <span className="text-xs text-blue-800 font-bold uppercase tracking-wider">Monto Total</span>
                <div className="text-3xl font-black text-blue-900 font-mono mt-1">
                  ${totalFinal.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Forma de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'efectivo', label: 'Efectivo' },
                    { id: 'tarjeta_debito', label: 'T. Débito' },
                    { id: 'tarjeta_credito', label: 'T. Crédito' },
                    { id: 'transferencia', label: 'Transferencia' },
                    { id: 'cuenta_corriente', label: 'Cuenta Cte.' },
                  ].map((fp) => (
                    <button
                      key={fp.id}
                      onClick={() => setFormaPago(fp.id as FormaPago)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        formaPago === fp.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {fp.label}
                    </button>
                  ))}
                </div>
              </div>

              {formaPago === 'cuenta_corriente' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <User className="w-4 h-4 text-blue-600" /> Seleccionar Cliente de Cuenta Corriente
                  </label>
                  <select
                    value={selectedClienteId}
                    onChange={(e) => setSelectedClienteId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">-- Seleccione Cliente --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre_razon_social} (DNI: {c.dni_cuit}) - Deuda: ${c.saldo_deudor.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formaPago === 'efectivo' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Monto Recibido</label>
                    <input
                      type="number"
                      placeholder={totalFinal.toFixed(2)}
                      value={montoPagado}
                      onChange={(e) => setMontoPagado(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-lg font-mono rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Vuelto a Entregar</label>
                    <div className="bg-slate-100 border border-slate-300 text-blue-900 font-mono text-xl font-bold rounded-xl p-2.5">
                      ${vueltoCalculado.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <button
                disabled={saleCompleted}
                onClick={handleCompleteSale}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {saleCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 animate-bounce" /> Imprimiendo Ticket y Finalizando...
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" /> CONFIRMAR Y COBRAR
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alta Rápida */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-white">Alta Rápida de Producto</h3>
              </div>
              <button onClick={() => setShowQuickAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateQuickProduct} className="p-5 space-y-4">
              <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex justify-between">
                <span>Código Escaneado:</span>
                <span className="font-bold text-amber-700">{scannedNotFoundCode}</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Arroz Largo Fino 1kg"
                  value={newProductForm.nombre}
                  onChange={(e) => setNewProductForm({ ...newProductForm, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Costo ($)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.costo}
                    onChange={(e) => setNewProductForm({ ...newProductForm, costo: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Margen (%)</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.margen}
                    onChange={(e) => setNewProductForm({ ...newProductForm, margen: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 flex justify-between items-center text-sm font-semibold">
                <span className="text-blue-900">Precio Venta Sugerido:</span>
                <span className="text-blue-900 font-mono text-lg font-bold">
                  ${(newProductForm.costo * (1 + newProductForm.margen / 100)).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-4 h-4" /> Guardar y Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
