export type FormaPago = 'efectivo' | 'tarjeta_debito' | 'tarjeta_credito' | 'transferencia' | 'cuenta_corriente';

export interface Producto {
  id: string;
  codigo_barras: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  costo_adquisicion: number;
  margen_ganancia: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  fecha_vencimiento?: string;
  estado: 'activo' | 'inactivo';
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
  razon_social: string;
  cuit: string;
  contacto_nombre?: string;
  telefono?: string;
  email?: string;
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
