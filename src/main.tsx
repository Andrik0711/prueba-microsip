// src/main.tsx
// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ProductProvider } from './context/ProductContext';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ProductProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </ProductProvider>
);
