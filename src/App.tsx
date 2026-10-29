import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { POSScreen } from './features/pos/POSScreen';
import { ProductsScreen } from './features/productos/ProductsScreen';
import { ClientsScreen } from './features/clientes/ClientsScreen';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FormasPagoScreen } from './features/config/FormasPagoScreen';
import { ImpuestosScreen } from './features/config/ImpuestosScreen';
import { GastosScreen } from './features/gastos/GastosScreen';
import { ProveedoresScreen } from './features/proveedores/ProveedoresScreen';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { FormaPagoItem, ImpuestoItem, GastoItem, Producto, Proveedor } from './types/pos';
import { 
  INITIAL_FORMAS_PAGO, INITIAL_IMPUESTOS, INITIAL_GASTOS_ITEMS, 
  INITIAL_PRODUCTS, INITIAL_PROVEEDORES 
} from './services/mockData';
import { 
  ShoppingCart, Package, Users, LayoutDashboard, Download, Smartphone, 
  CreditCard, Percent, Wallet, Truck, MapPin, MessageCircle, Lock, KeyRound, ShieldAlert 
} from 'lucide-react';

const queryClient = new QueryClient();

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'pos' | 'productos' | 'clientes' | 'gastos' | 'proveedores' | 'formasPago' | 'impuestos'
  >('dashboard');
  const { isInstallable, installPWA } = usePWAInstall();

  // Estados dinámicos interconectados
  const [formasPago, setFormasPago] = useState<FormaPagoItem[]>(INITIAL_FORMAS_PAGO);
  const [impuestos, setImpuestos] = useState<ImpuestoItem[]>(INITIAL_IMPUESTOS);
  const [gastos, setGastos] = useState<GastoItem[]>(INITIAL_GASTOS_ITEMS);
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);
  const [proveedores, setProveedores] = useState<Proveedor[]>(INITIAL_PROVEEDORES);

  // Control de Licencia y Bloqueo Remoto (Trial 5 días + Kill-Switch)
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState('');
  const [unlockPin, setUnlockPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  useEffect(() => {
    const checkLicense = async () => {
      // 1. Si ya se desbloqueó con clave permanente en este dispositivo
      if (localStorage.getItem('sj_pos_unlocked') === 'true') {
        setIsLocked(false);
        return;
      }

      // 2. Control de tiempo de prueba local (5 días desde primer uso)
      const TRIAL_DAYS = 5;
      const trialStartStr = localStorage.getItem('sj_pos_trial_start');
      let trialStart = trialStartStr ? Number(trialStartStr) : null;
      if (!trialStart) {
        trialStart = Date.now();
        localStorage.setItem('sj_pos_trial_start', trialStart.toString());
      }
      const msPassed = Date.now() - trialStart;
      const daysPassed = msPassed / (1000 * 60 * 60 * 24);

      if (daysPassed > TRIAL_DAYS) {
        setIsLocked(true);
        setLockReason(`Período de prueba de ${TRIAL_DAYS} días finalizado. Comuníquese para adquirir la licencia comercial.`);
        return;
      }

      // 3. Consulta del Kill-Switch Remoto (GitHub / local)
      try {
        const timestamp = Date.now();
        const remoteUrl = `https://raw.githubusercontent.com/Fabrome64/supermercado-pos-admin/main/public/license.json?t=${timestamp}`;
        let res = await fetch(remoteUrl, { cache: 'no-store' }).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(`./license.json?t=${timestamp}`, { cache: 'no-store' }).catch(() => null);
        }
        if (res && res.ok) {
          const lic = await res.json();
          if (lic.activa === false) {
            setIsLocked(true);
            setLockReason(lic.mensaje || 'Sistema pausado remotamente por el desarrollador.');
            return;
          }
          if (lic.fecha_vencimiento) {
            const expDate = new Date(lic.fecha_vencimiento).getTime();
            if (Date.now() > expDate) {
              setIsLocked(true);
              setLockReason(lic.mensaje || 'Período de prueba vencido.');
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Licencia remota no accesible:', err);
      }
    };

    checkLicense();
  }, []);

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPin.trim().toUpperCase() === 'SJ2026' || unlockPin.trim().toUpperCase() === 'SANJOSE2026') {
      localStorage.setItem('sj_pos_unlocked', 'true');
      setIsLocked(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#E6E6FA] text-slate-900 flex flex-col font-sans select-none">
        {/* Navigation Top Header - Dark Blue Theme (#0B192C) */}
        <header className="bg-[#0B192C] text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-xl z-10 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img 
              src="./logo.jpg" 
              alt="Supermercado San José" 
              className="w-13 h-13 rounded-2xl object-cover border-2 border-yellow-400 shadow-lg shadow-yellow-500/20 shrink-0 bg-slate-950" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-lg tracking-tight leading-none">
                  Supermercado San José
                </h1>
                <span className="bg-amber-950/80 text-amber-300 border border-amber-500/70 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  SJ • Supermercado
                </span>
                <span className="bg-blue-950 text-blue-300 border border-blue-700 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  PWA
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  Nicolás Mascardi 743 Grand Bourg - Buenos Aires
                </span>
                <a 
                  href="https://wa.me/5491125819825" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-600/60 px-2 py-0.5 rounded-md transition-colors"
                  title="Abrir WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  +54 9 11 2581-9825
                </a>
              </div>
            </div>
          </div>

          {/* Tab Navigation con los nuevos módulos */}
          <nav className="flex bg-[#0f243f] p-1 rounded-xl border border-blue-900/60 gap-1 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'pos'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> POS / Caja
            </button>

            <button
              onClick={() => setActiveTab('productos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'productos'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Productos & Stock
            </button>

            <button
              onClick={() => setActiveTab('clientes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'clientes'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Clientes & Ctas Ctes
            </button>

            <button
              onClick={() => setActiveTab('gastos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gastos'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" /> Gastos
            </button>

            <button
              onClick={() => setActiveTab('proveedores')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'proveedores'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Proveedores
            </button>

            <button
              onClick={() => setActiveTab('formasPago')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'formasPago'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Formas de Pago
            </button>

            <button
              onClick={() => setActiveTab('impuestos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'impuestos'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              }`}
            >
              <Percent className="w-3.5 h-3.5" /> Impuestos
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isInstallable && (
              <button
                onClick={installPWA}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all animate-pulse"
              >
                <Download className="w-4 h-4" /> Instalar PWA
              </button>
            )}
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">Admin Principal</span>
              <span className="text-[10px] text-blue-300 font-mono">PWA Web App</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-600 flex items-center justify-center font-bold text-xs text-blue-200">
              <Smartphone className="w-4 h-4 text-blue-200" />
            </div>
          </div>
        </header>

        {/* Main Content Area - Lavender Background (#E6E6FA) */}
        <main className="flex-1 bg-[#E6E6FA]">
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'pos' && <POSScreen />}
          {activeTab === 'productos' && (
            <ProductsScreen 
              products={products} 
              setProducts={setProducts} 
              impuestos={impuestos}
              proveedores={proveedores}
            />
          )}
          {activeTab === 'clientes' && (
            <ClientsScreen 
              formasPago={formasPago} 
            />
          )}
          {activeTab === 'gastos' && (
            <GastosScreen 
              gastos={gastos} 
              setGastos={setGastos} 
              formasPago={formasPago}
              proveedores={proveedores}
            />
          )}
          {activeTab === 'proveedores' && (
            <ProveedoresScreen
              proveedores={proveedores}
              setProveedores={setProveedores}
            />
          )}
          {activeTab === 'formasPago' && (
            <FormasPagoScreen 
              formasPago={formasPago} 
              setFormasPago={setFormasPago} 
            />
          )}
          {activeTab === 'impuestos' && (
            <ImpuestosScreen 
              impuestos={impuestos} 
              setImpuestos={setImpuestos} 
            />
          )}
        </main>

        {/* Modal de Bloqueo Remoto / Fin de Período de Prueba */}
        {isLocked && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6">
              <div className="relative mx-auto w-24 h-24">
                <img 
                  src="./logo.jpg" 
                  alt="Supermercado San José" 
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-yellow-400 shadow-2xl mx-auto" 
                />
                <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                  <ShieldAlert className="w-4 h-4" /> Sistema Suspendido
                </span>
                <h2 className="text-2xl font-black text-white mt-3">
                  Período de Evaluación Finalizado
                </h2>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {lockReason || 'El período de prueba para Supermercado San José ha concluido. Para continuar utilizando el sistema de caja y administración, por favor comuníquese con el desarrollador.'}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/5491125819825?text=Hola!%20Quiero%20activar%20la%20licencia%20comercial%20del%20sistema%20para%20Supermercado%20San%20Jos%C3%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl text-base shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp (+54 9 11 2581-9825)
                </a>

                {!showPinInput ? (
                  <button
                    onClick={() => setShowPinInput(true)}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 mx-auto pt-2 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Ingresar clave de activación comercial
                  </button>
                ) : (
                  <form onSubmit={handleUnlockWithPin} className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Clave de licencia (ej: SJ2026)"
                        value={unlockPin}
                        onChange={(e) => {
                          setUnlockPin(e.target.value);
                          setPinError(false);
                        }}
                        className="flex-1 bg-slate-800 border border-slate-700 text-white px-3.5 py-2.5 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
                      >
                        Activar
                      </button>
                    </div>
                    {pinError && (
                      <p className="text-xs text-red-400 font-bold">
                        Clave incorrecta. Solicítela al desarrollador por WhatsApp.
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
