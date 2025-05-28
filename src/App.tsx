export { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { ProductProvider } from './context/ProductContext';
import EditProducts from './pages/EditProducts';
// import Summary from './pages/Summary';
// import Home from './pages/Home';
export default function App() {
    return (
        <ProductProvider>
            <Router>
                <Container maxWidth="lg">
                    <Routes>
                        {/* <Route path="/" element={<Home />} /> */}
                        <Route path="/" element={<EditProducts />} />
                        {/* <Route path="/summary" element={<Summary />} /> */}
                    </Routes>
                </Container>
            </Router>
        </ProductProvider>
    );
}

// src/pages/Summary.tsx
// export default function Summary() {
//   return <h1>Resumen de productos</h1>;
// }
