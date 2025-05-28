# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
# 🛠️ Kladi Ferretería - Gestión de Catálogo Inicial

Aplicación web construida para clientes de **Kladi**, que permite a una ferretería revisar un catálogo precargado de productos, editar precios e inventario inicial, y confirmar los artículos que manejará en su tienda.

## ✨ Funcionalidades principales

- Visualización de catálogo con campos editables (precio e inventario)
- Filtros por nombre, rango de precio y estado de inventario
- Restauración de precios sugeridos
- Detección de productos modificados
- Pantalla de resumen y confirmación antes de guardar

---

## 🧑‍💻 Tecnologías utilizadas

- ⚛️ React + TypeScript
- 🎨 Material UI (MUI)
- 🌐 Axios (para consumo de API externa)
- 📦 Vite (entorno de desarrollo)
- 🧠 React Context API (para estado global)
- 🧪 (Opcional) ESLint + Prettier

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/Andrik0711/prueba-microsip.git
cd prueba-microsip

### 2. Instala las dependencias

```bash
npm install
```

### 3. Inicia el servidor de desarrollo

```bash
npm run dev
```
### 4. Abre tu navegador
Abre [http://localhost:5173](http://localhost:5173) para ver la aplicación en acción.
