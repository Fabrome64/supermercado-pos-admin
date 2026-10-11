import type { Producto, Cliente, Gasto, FormaPagoItem, ImpuestoItem, GastoItem } from '../types/pos';

export const INITIAL_FORMAS_PAGO: FormaPagoItem[] = [
  { id: 'fp-1', nombre: 'Efectivo en Caja', recargo_descuento_pct: 0, estado: 'activo' },
  { id: 'fp-2', nombre: 'Tarjeta de Débito', recargo_descuento_pct: 0, estado: 'activo' },
  { id: 'fp-3', nombre: 'Tarjeta de Crédito', recargo_descuento_pct: 10, estado: 'activo' },
  { id: 'fp-4', nombre: 'Transferencia Bancaria', recargo_descuento_pct: -5, estado: 'activo' },
  { id: 'fp-5', nombre: 'Cuenta Corriente', recargo_descuento_pct: 0, estado: 'activo' },
];

export const INITIAL_IMPUESTOS: ImpuestoItem[] = [
  { id: 'imp-1', nombre: 'IVA General (21%)', porcentaje: 21, estado: 'activo' },
  { id: 'imp-2', nombre: 'IVA Reducido (10.5%)', porcentaje: 10.5, estado: 'activo' },
  { id: 'imp-3', nombre: 'Exento (0%)', porcentaje: 0, estado: 'activo' },
  { id: 'imp-4', nombre: 'Percepción IIBB (3%)', porcentaje: 3, estado: 'activo' },
];

export const INITIAL_GASTOS_ITEMS: GastoItem[] = [
  {
    id: 'g-1',
    concepto: 'Factura de Energía Eléctrica',
    categoria: 'Servicios',
    monto: 45000.00,
    fecha: '2026-10-01',
    forma_pago_nombre: 'Transferencia Bancaria',
    comprobante: 'FAC-0004-9821'
  },
  {
    id: 'g-2',
    concepto: 'Bobinas de Papel Térmico 80mm',
    categoria: 'Insumos',
    monto: 12500.00,
    fecha: '2026-10-05',
    forma_pago_nombre: 'Efectivo en Caja',
    comprobante: 'TKT-0012-3490'
  },
  {
    id: 'g-3',
    concepto: 'Mantenimiento Heladeras Exhibidoras',
    categoria: 'Mantenimiento',
    monto: 35000.00,
    fecha: '2026-10-08',
    forma_pago_nombre: 'Efectivo en Caja',
    comprobante: 'REC-0089'
  }
];

export const INITIAL_PRODUCTS: Producto[] = [
  {
    id: 'p1',
    codigo_barras: '7791234567890',
    nombre: 'Leche Entera Larga Vida 1L',
    descripcion: 'Leche entera ultra pasteurizada',
    categoria: 'Lácteos',
    costo_adquisicion: 850.00,
    margen_ganancia: 35.00,
    impuesto_pct: 21,
    precio_venta: 1147.50,
    stock_actual: 45,
    stock_minimo: 10,
    fecha_vencimiento: '2026-11-15',
    estado: 'activo',
  },
  {
    id: 'p2',
    codigo_barras: '7799876543210',
    nombre: 'Pan Lactal Blanco 500g',
    descripcion: 'Pan de molde para sándwich',
    categoria: 'Panadería',
    costo_adquisicion: 1400.00,
    margen_ganancia: 40.00,
    impuesto_pct: 10.5,
    precio_venta: 1960.00,
    stock_actual: 8,
    stock_minimo: 12,
    fecha_vencimiento: '2026-10-18',
    estado: 'activo',
  },
  {
    id: 'p3',
    codigo_barras: '7795555444333',
    nombre: 'Aceite de Girasol 1.5L',
    descripcion: 'Aceite vegetal de primera prensada',
    categoria: 'Almacén',
    costo_adquisicion: 2100.00,
    margen_ganancia: 30.00,
    impuesto_pct: 21,
    precio_venta: 2730.00,
    stock_actual: 3,
    stock_minimo: 5,
    fecha_vencimiento: '2027-05-20',
    estado: 'activo',
  },
  {
    id: 'p4',
    codigo_barras: '7791111222333',
    nombre: 'Yerba Mate con Palo 1kg',
    descripcion: 'Yerba estacionada 12 meses',
    categoria: 'Almacén',
    costo_adquisicion: 3200.00,
    margen_ganancia: 35.00,
    impuesto_pct: 21,
    precio_venta: 4320.00,
    stock_actual: 28,
    stock_minimo: 8,
    fecha_vencimiento: '2027-12-01',
    estado: 'activo',
  },
  {
    id: 'p5',
    codigo_barras: '7790000111222',
    nombre: 'Jabón Líquido para Ropa 3L',
    descripcion: 'Detergente concentrado para lavarropas',
    categoria: 'Limpieza',
    costo_adquisicion: 4500.00,
    margen_ganancia: 45.00,
    impuesto_pct: 21,
    precio_venta: 6525.00,
    stock_actual: 14,
    stock_minimo: 4,
    fecha_vencimiento: '2028-01-01',
    estado: 'activo',
  },
];

export const INITIAL_CLIENTS: Cliente[] = [
  {
    id: 'c1',
    nombre_razon_social: 'Juan Carlos Pérez',
    dni_cuit: '20-34567890-9',
    telefono: '11-5544-3322',
    direccion: 'Av. Corrientes 1450',
    limite_credito: 50000.00,
    saldo_deudor: 12500.00,
    estado: 'activo',
  },
  {
    id: 'c2',
    nombre_razon_social: 'María Elena Gómez',
    dni_cuit: '27-28999888-4',
    telefono: '11-9988-7766',
    direccion: 'Belgrano 430',
    limite_credito: 30000.00,
    saldo_deudor: 0.00,
    estado: 'activo',
  },
];

export const INITIAL_GASTOS: Gasto[] = [
  {
    id: 'g1',
    categoria: 'servicios',
    monto: 45000.00,
    descripcion: 'Factura de luz bimestral local',
    creado_en: '2026-10-01',
  },
  {
    id: 'g2',
    categoria: 'insumos',
    monto: 12500.00,
    descripcion: 'Bobinas de papel térmico para tickets 80mm',
    creado_en: '2026-10-05',
  },
];
