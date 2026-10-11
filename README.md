# 🛒 Supermercado POS & ERP - Web PWA Admin Panel

Sistema de Gestión Administrativa, Logística e Inventarios para Supermercados, desarrollado como **Web Progressive Web App (PWA)** instalable con soporte de base de datos en tiempo real mediante **Supabase (PostgreSQL)**.

---

## 🌟 Características Principales

- **📱 Web PWA Instalable:** Instalable en Windows, macOS, Linux, Android e iOS con soporte de Service Worker offline.
- **⚡ Terminal POS de Cobro Rápido:** Integración universal con lectores de código de barras USB/Bluetooth en emulación HID, alta rápida de productos no registrados, cálculo de vuelto en efectivo y tickets de 80mm.
- **📦 Control de Productos e Inventarios:** Categorización de artículos, margen de ganancia %, precio de venta sugerido, alertas de stock mínimo y control de vencimientos a 30, 15 y 7 días.
- **👥 Clientes y Cuentas Corrientes:** Registro de clientes, límites de crédito, saldo deudor en tiempo real y asentamiento de pagos a cuenta.
- **📊 Dashboard Analítico & Gastos:** Métricas de recaudación diaria, gráficos comparativos de ventas vs. gastos y desglose de formas de pago.
- **🎨 UI Personalizada:** Esquema corporativo con encabezado Azul Oscuro (`#0B192C`) y fondo Lavender (`#E6E6FA`).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Vite, `@vitepwa/plugin-pwa`.
- **Estilos:** Tailwind CSS v4, Lucide Icons, Recharts.
- **Backend / DB:** Supabase (PostgreSQL DDL, RLS, WebSockets Realtime).

---

## 🚀 Instalación y Uso Local

```bash
# 1. Clonar o ingresar al proyecto
cd pos-supermarket

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción (PWA Bundle)
npm run build

# 5. Probar versión compilada localmente
npm run preview
```

---

## 📤 Pasos para Vincular y Subir a GitHub

Si deseas subir este proyecto a tu cuenta personal o de empresa en GitHub, ejecuta los siguientes comandos en tu terminal:

```bash
# 1. Crear un nuevo repositorio en https://github.com/new (ej: pos-supermarket-admin)

# 2. En la terminal de este proyecto ejecutar:
git remote add origin https://github.com/TU_USUARIO/pos-supermarket-admin.git

# 3. Subir el código a la rama principal (main)
git branch -M main
git push -u origin main
```

---

## 🗄️ Esquema DDL SQL para Supabase

El archivo DDL completo de PostgreSQL con tablas, índices B-Tree y triggers de automatización de stock se encuentra documentado en la arquitectura del proyecto.
