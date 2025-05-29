import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductFilters from '../components/ProductFilters';
import type { Product } from '../types/Product';

describe('ProductFilters', () => {
    const mockSetSearch = vi.fn();
    const mockSetShowOnlyModified = vi.fn();
    const mockSetMinPrice = vi.fn();
    const mockSetMaxPrice = vi.fn();

    const products: Product[] = [
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
    ];

    beforeEach(() => {
        mockSetSearch.mockClear();
        mockSetShowOnlyModified.mockClear();
        mockSetMinPrice.mockClear();
        mockSetMaxPrice.mockClear();
    });

    it('renderiza el campo de búsqueda y el switch', () => {
        render(
            <ProductFilters
                search=""
                setSearch={mockSetSearch}
                showOnlyModified={false}
                setShowOnlyModified={mockSetShowOnlyModified}
                products={products}
                minPrice={null}
                maxPrice={null}
                setMinPrice={mockSetMinPrice}
                setMaxPrice={mockSetMaxPrice}
            />
        );
        expect(screen.getByLabelText(/Buscar por nombre o clave/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Solo modificados/i)).toBeInTheDocument();
    });

    it('llama a setSearch al escribir', () => {
        render(
            <ProductFilters
                search=""
                setSearch={mockSetSearch}
                showOnlyModified={false}
                setShowOnlyModified={mockSetShowOnlyModified}
                products={products}
                minPrice={null}
                maxPrice={null}
                setMinPrice={mockSetMinPrice}
                setMaxPrice={mockSetMaxPrice}
            />
        );
        fireEvent.change(screen.getByLabelText(/Buscar por nombre o clave/i), { target: { value: 'Martillo' } });
        expect(mockSetSearch).toHaveBeenCalledWith('Martillo');
    });
});
