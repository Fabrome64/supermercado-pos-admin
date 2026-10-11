export type FormaPago = 'efectivo' | 'tarjeta_debito' | 'tarjeta_credito' | 'transferencia' | 'cuenta_corriente';

export interface FormaPagoItem {
  id: string;
  nombre: string;
  recargo_descuento_pct: number; // Positivo = recargo %, Negativo = descuento %
  estado: 'activo' | 'inactivo';
}

export interface ImpuestoItem {
  id: string;
  nombre: string;
  porcentaje: number; // Ej: 21 para IVA 21%, 10.5 para IVA 10.5%
  estado: 'activo' | 'inactivo';
}

export interface GastoItem {
  id: string;
  concepto: string;
  categoria: string;
  monto: number;
  fecha: string;
  forma_pago_nombre: string;
  comprobante?: string;
  proveedor_nombre?: string;
}

export interface Producto {
  id: string;
  codigo_barras: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  costo_adquisicion: number;
  margen_ganancia: number;
  impuesto_pct?: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  fecha_vencimiento?: string;
  estado: 'activo' | 'inactivo';
  proveedor_habitual?: string;
}

export interface CartItem extends Producto {
  cantidad: number;
  subtotal: number;
}

export interface Cliente {
  id: string;
  nombre_razon_social: string;
  dni_cuit: string;
  telefono?: string;
  direccion?: string;
  limite_credito: number;
  saldo_deudor: number;
  estado: 'activo' | 'inactivo';
}

export interface Proveedor {
  id: string;
  nombre_empresa: string;
  direccion: string;
  whatsapp: string;
  cuit: string; // Formato xx.xxxxxx.x (solo números al escribir, con puntos en pantalla)
  arba: string;
  observaciones?: string;
  estado: 'activo' | 'inactivo';
}

export interface Gasto {
  id: string;
  categoria: 'servicios' | 'insumos' | 'logistica' | 'mantenimiento' | 'sueldos' | 'varios';
  monto: number;
  descripcion: string;
  creado_en: string;
}

export interface CajaSesion {
  id: string;
  monto_inicial: number;
  monto_final_esperado: number;
  monto_final_real: number;
  diferencia: number;
  estado: 'abierta' | 'cerrada';
  fecha_apertura: string;
  fecha_cierre?: string;
}
