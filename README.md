# 🛠️ Kladi Ferretería - Gestión de Catálogo Inicial

Aplicación web construida para clientes de **Kladi**, que permite a una ferretería revisar un catálogo precargado de productos, editar precios e inventario inicial, y confirmar los artículos que manejará en su tienda.

---

## ✨ Funcionalidades principales

- Visualización de catálogo con campos editables (`precio` e `inventario`)
- Filtro de productos por nombre o clave
- Filtros por rango de precio y estado de inventario
- Restauración de precios sugeridos
- Detección de productos modificados (precio/inventario editado)
- Pantalla de resumen con lista de productos modificados
- Modal de éxito al guardar cambios
- Navegación entre vista de edición y resumen

---

## 🧑‍💻 Tecnologías utilizadas

- ⚛️ **React** + **TypeScript**
- 🎨 [Material UI (MUI)](https://mui.com/)
- 🌐 [Axios](https://axios-http.com/) – Consumo de API externa
- ⚡ [Vite](https://vitejs.dev/) – Entorno de desarrollo rápido
- 🧠 **React Context API** – Para estado global
- 🧪 ESLint + Prettier – Buenas prácticas de código (opcional)

---

## 📁 Estructura del Proyecto

```
kladi-ferreteria/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── kladiApi.ts         # Cliente Axios para API de Kladi
│   ├── components/
│   │   ├── ProductTable.tsx    # Tabla editable de productos
│   │   ├── ProductFilters.tsx  # Barra de búsqueda y filtro modificado
│   │   └── SummaryModal.tsx    # Modal de éxito tras guardar
│   ├── context/
│   │   └── ProductContext.tsx  # Estado global de productos
│   ├── pages/
│   │   ├── EditProducts.tsx    # Pantalla principal (edición)
│   │   └── Summary.tsx         # Pantalla resumen de cambios
│   ├── types/
│   │   └── Product.ts          # Tipado del modelo de producto
│   ├── App.tsx                 # Rutas y layout
│   ├── main.tsx                # Entrada principal + Theme MUI
│   └── ...
├── .eslintrc.json              # Configuración ESLint (4 espacios)
├── .prettierrc                 # Configuración Prettier (4 espacios)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y uso local

### 1. Clona el repositorio

```bash
git clone https://github.com/Andrik0711/prueba-microsip.git
cd prueba-microsip
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Instala ESLint y Prettier (opcional pero recomendado)

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 4. Scripts útiles

- `npm run lint` — Ejecuta ESLint sobre el código fuente
- `npm run format` — Formatea el código con Prettier

### 5. Inicia el servidor de desarrollo

```bash
npm run dev
```

### 6. Abre la app en tu navegador

[http://localhost:5173](http://localhost:5173)

---

## 📌 Consideraciones Técnicas

- Se utiliza el API abierto de Kladi para poblar productos:  
  https://catalogo-kladi.dev.rombo.microsipnube.com/api/productos

- Los productos se enriquecen en frontend con campos auxiliares como `precio_actual`, `inventario_actual`, `inventario_original` y `modificado`.

- La detección de cambios se basa en comparar `precio_actual` con `precio_sugerido` e `inventario_actual` con `inventario_original`.

---

## 🧪 Pruebas

Actualmente, no se han implementado pruebas automatizadas.  
Se recomienda realizar pruebas manuales del flujo completo:

- Editar precios e inventario.
- Activar filtro “solo modificados”.
- Finalizar → revisar resumen.
- Guardar cambios → verificar modal de éxito.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.