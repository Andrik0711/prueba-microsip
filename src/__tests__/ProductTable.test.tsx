import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '../components/ProductTable';
import { ProductProvider, useProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';
import React from 'react';

const mockProducts: Product[] = [
    {
        key_unique: '1',
        id: '1',
        nombre: 'Martillo',
        clave: 'MART-001',
        unidad_medida: 'pz',
        precio_sugerido: 100,
        precio_actual: 100,
        inventario_actual: 10,
        inventario_original: 10,
        categoria: 'Herramientas',
        marca: 'Truper',
        modificado: false,
    },
    {
        key_unique: '2',
        id: '2',
        nombre: 'Desarmador',
        clave: 'DESA-002',
        unidad_medida: 'pz',
        precio_sugerido: 50,
        precio_actual: 60,
        inventario_actual: 5,
        inventario_original: 5,
        categoria: 'Herramientas',
        marca: 'Truper',
        modificado: true,
    },
];

function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <ProductProvider>
            <TestProductsSetter>{children}</TestProductsSetter>
        </ProductProvider>
    );
}

function TestProductsSetter({ children }: { children: React.ReactNode }) {
    const { setProducts } = useProductContext();
    React.useEffect(() => {
        setProducts(mockProducts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setProducts]);
    return <>{children}</>;
}

describe('ProductTable', () => {
    it('muestra los productos y detecta modificados', () => {
        render(
            <ProductTable search="" showOnlyModified={false} minPrice={null} maxPrice={null} />,
            { wrapper: Wrapper }
        );
        expect(screen.getByText(/Martillo/i)).toBeInTheDocument();
        expect(screen.getByText(/Desarmador/i)).toBeInTheDocument();
    });

    it('filtra solo modificados', () => {
        render(
            <ProductTable search="" showOnlyModified={true} minPrice={null} maxPrice={null} />,
            { wrapper: Wrapper }
        );
        expect(screen.queryByText(/Martillo/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Desarmador/i)).toBeInTheDocument();
    });

    it('permite editar el precio actual', () => {
        render(
            <ProductTable search="" showOnlyModified={false} minPrice={null} maxPrice={null} />,
            { wrapper: Wrapper }
        );
        const input = screen.getAllByRole('spinbutton')[0];
        fireEvent.change(input, { target: { value: '120' } });
        expect((input as HTMLInputElement).value).toBe('120');
    });
});
