import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { POSScreen } from './features/pos/POSScreen';
import { ProductsScreen } from './features/productos/ProductsScreen';
import { ClientsScreen } from './features/clientes/ClientsScreen';
import { DashboardScreen } from './features/dashboard/DashboardScreen';
import { FormasPagoScreen } from './features/config/FormasPagoScreen';
import { ImpuestosScreen } from './features/config/ImpuestosScreen';
import { GastosScreen } from './features/gastos/GastosScreen';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { FormaPagoItem, ImpuestoItem, GastoItem, Producto } from './types/pos';
import { INITIAL_FORMAS_PAGO, INITIAL_IMPUESTOS, INITIAL_GASTOS_ITEMS, INITIAL_PRODUCTS } from './services/mockData';
import { 
  ShoppingCart, Package, Users, LayoutDashboard, Store, Download, Smartphone, 
  CreditCard, Percent, Wallet 
} from 'lucide-react';

const queryClient = new QueryClient();

export function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'pos' | 'productos' | 'clientes' | 'gastos' | 'formasPago' | 'impuestos'
  >('dashboard');
  const { isInstallable, installPWA } = usePWAInstall();

  // Estados dinámicos interconectados
  const [formasPago, setFormasPago] = useState<FormaPagoItem[]>(INITIAL_FORMAS_PAGO);
  const [impuestos, setImpuestos] = useState<ImpuestoItem[]>(INITIAL_IMPUESTOS);
  const [gastos, setGastos] = useState<GastoItem[]>(INITIAL_GASTOS_ITEMS);
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#E6E6FA] text-slate-900 flex flex-col font-sans select-none">
        {/* Navigation Top Header - Dark Blue Theme (#0B192C) */}
        <header className="bg-[#0B192C] text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-xl z-10 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-950">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base leading-tight">SUPERMERCADO POS</h1>
                <span className="bg-blue-950 text-blue-300 border border-blue-700 text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold">
                  WEB PWA
                </span>
              </div>
              <p className="text-xs text-blue-200 font-mono">Panel de Control & Administración</p>
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
