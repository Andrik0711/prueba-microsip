import { renderHook, act } from '@testing-library/react';
import { ProductProvider, useProductContext } from '../context/ProductContext';
import { ReactNode } from 'react';
import { Product } from '../types/Product';

describe('ProductContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ProductProvider>{children}</ProductProvider>
    );

    it('permite setear productos y obtenerlos', () => {
        const { result } = renderHook(() => useProductContext(), { wrapper });
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
        ];
        act(() => {
            result.current.setProducts(mockProducts);
        });
        expect(result.current.products).toEqual(mockProducts);
    });
});
