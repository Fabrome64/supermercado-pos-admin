import { useState } from 'react';
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
  CreditCard, Percent, Wallet, Truck, MapPin, MessageCircle 
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#E6E6FA] text-slate-900 flex flex-col font-sans select-none">
        {/* Navigation Top Header - Dark Blue Theme (#0B192C) */}
        <header className="bg-[#0B192C] text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-xl z-10 flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img 
              src="/logo.jpg" 
              alt="Lo de SU - Kiosco Almacén" 
              className="w-13 h-13 rounded-full object-cover border-2 border-pink-500 shadow-lg shadow-pink-500/25 shrink-0 bg-slate-950" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-lg tracking-tight leading-none">
                  Lo de SU
                </h1>
                <span className="bg-pink-950/80 text-pink-300 border border-pink-600/70 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Kiosco • Almacén
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
      </div>
    </QueryClientProvider>
  );
}

export default App;
