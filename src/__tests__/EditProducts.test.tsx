import { render, screen, fireEvent } from '@testing-library/react';
import EditProducts from '../pages/EditProducts';
import { ProductProvider } from '../context/ProductContext';
import React from 'react';

describe('EditProducts', () => {
    it('renderiza el título y los botones principales', () => {
        render(
            <ProductProvider>
                <EditProducts />
            </ProductProvider>
        );
        expect(screen.getByText(/Inventario inicial/i)).toBeInTheDocument();
        expect(screen.getByText(/Restaurar precios sugeridos/i)).toBeInTheDocument();
        expect(screen.getByText(/Finalizar cambios/i)).toBeInTheDocument();
    });
});
