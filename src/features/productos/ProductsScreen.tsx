import React, { useState } from 'react';
import type { Producto } from '../../types/pos';
import { INITIAL_PRODUCTS } from '../../services/mockData';
import { Package, Plus, Search, AlertTriangle, FileSpreadsheet, Edit3, Trash2 } from 'lucide-react';

export const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Producto[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    codigo_barras: '',
    nombre: '',
    categoria: 'Almacén',
    costo_adquisicion: 1000,
    margen_ganancia: 35,
    stock_actual: 50,
    stock_minimo: 10,
    fecha_vencimiento: '',
  });

  const categories = ['Todas', 'Almacén', 'Lácteos', 'Panadería', 'Limpieza', 'Bebidas'];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo_barras.includes(searchTerm);
    const matchCategory = selectedCategory === 'Todas' || p.categoria === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const precioFinal = formData.costo_adquisicion * (1 + formData.margen_ganancia / 100);
    const newProd: Producto = {
      id: `p-${Date.now()}`,
      codigo_barras: formData.codigo_barras,
      nombre: formData.nombre,
      categoria: formData.categoria,
      costo_adquisicion: Number(formData.costo_adquisicion),
      margen_ganancia: Number(formData.margen_ganancia),
      precio_venta: Number(precioFinal),
      stock_actual: Number(formData.stock_actual),
      stock_minimo: Number(formData.stock_minimo),
      fecha_vencimiento: formData.fecha_vencimiento || undefined,
      estado: 'activo',
    };

    setProducts([newProd, ...products]);
    setShowModal(false);
    setFormData({
      codigo_barras: '',
      nombre: '',
      categoria: 'Almacén',
      costo_adquisicion: 1000,
      margen_ganancia: 35,
      stock_actual: 50,
      stock_minimo: 10,
      fecha_vencimiento: '',
    });
  };

  return (
    <div className="p-6 bg-[#E6E6FA] min-h-[calc(100vh-4rem)] text-slate-900 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-300">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#0B192C]">
            <Package className="w-7 h-7 text-blue-700" /> Catálogo de Productos e Inventario
          </h1>
          <p className="text-sm text-slate-600 font-medium">Gestión de stock, alerta de vencimientos y cálculo de márgenes</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert('Soporte de importación CSV/Excel disponible en Supabase.')}
            className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 border border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-700" /> Importar CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-900 text-xs font-bold text-white uppercase tracking-wider">
              <tr>
                <th className="p-4">Código / Nombre</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Costo Adq.</th>
                <th className="p-4">Margen %</th>
                <th className="p-4">Precio Venta</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((prod) => {
                const isLowStock = prod.stock_actual <= prod.stock_minimo;
                return (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="text-slate-900 font-bold">{prod.nombre}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">{prod.codigo_barras}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-300 font-semibold">
                        {prod.categoria}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-semibold">${prod.costo_adquisicion.toFixed(2)}</td>
                    <td className="p-4 font-mono text-blue-700 font-bold">{prod.margen_ganancia}%</td>
                    <td className="p-4 font-mono font-extrabold text-blue-900 text-base">
                      ${prod.precio_venta.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 w-fit ${
                          isLowStock
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isLowStock && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                        {prod.stock_actual} un.
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {prod.fecha_vencimiento || 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProducts(products.filter((p) => p.id !== prod.id))}
                          className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nuevo Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
              <h3 className="font-bold text-lg">Carga de Nuevo Producto</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Código de Barras (EAN)</label>
                  <input
                    type="text"
                    required
                    placeholder="7791234567890"
                    value={formData.codigo_barras}
                    onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'Todas').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Yogur Frutilla 180g"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Costo ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.costo_adquisicion}
                    onChange={(e) => setFormData({ ...formData, costo_adquisicion: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Margen (%)</label>
                  <input
                    type="number"
                    required
                    value={formData.margen_ganancia}
                    onChange={(e) => setFormData({ ...formData, margen_ganancia: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_actual}
                    onChange={(e) => setFormData({ ...formData, stock_actual: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm rounded-xl p-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
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
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
