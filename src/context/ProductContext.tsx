// src/context/ProductContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { fetchProducts } from '../api/KladiApi.ts';
import { cleanAndDecode, randomInt } from '../utils/productUtils';

interface ProductContextType {
    products: Product[];
    setProducts: (products: Product[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        interface FetchProductsResponse {
            __ITEMS__: Product[];
            [key: string]: unknown;
        }

        fetchProducts().then((response: FetchProductsResponse) => {
            const items = response.__ITEMS__ || [];
            // Usamos unknown y lo casteamos para evitar 'any' y cumplir con las reglas de TypeScript
            const formatted = items.map((item: object) => {
                const p = item as { [key: string]: unknown };
                // Utilidades para extraer string seguro
                const getString = (v: unknown): string => (typeof v === 'string' ? v : '');
                // Extrae el nombre de la categoría sin usar 'any'
                const getCategoria = (v: unknown): string => {
                    if (v && typeof v === 'object' && 'nombre' in v) {
                        const nombre = (v as { nombre?: unknown }).nombre;
                        return typeof nombre === 'string' ? nombre : '';
                    }
                    return '';
                };
                // Utilidad para extraer y limpiar un número seguro
                const getNumber = (...args: unknown[]): number => {
                    for (const v of args) {
                        const s = getString(v);
                        if (s) {
                            const n = parseFloat(cleanAndDecode(s));
                            if (!isNaN(n)) return n;
                        }
                    }
                    return 0;
                };
                // Utilidad para extraer marca
                const getMarca = (v: unknown): string => {
                    if (typeof v === 'string') return v;
                    if (v && typeof v === 'object' && 'nombre' in v) {
                        const nombre = (v as { nombre?: unknown }).nombre;
                        return typeof nombre === 'string' ? nombre : '';
                    }
                    return '';
                };
                // Type guard para objetos con propiedad nombre
                function hasNombre(obj: unknown): obj is { nombre: string } {
                    return (
                        typeof obj === 'object' &&
                        obj !== null &&
                        'nombre' in obj &&
                        typeof (obj as { nombre: unknown }).nombre === 'string'
                    );
                }
                // Utilidad para extraer categoría robusta
                const getCategoriaRobusta = (p: Record<string, unknown>): string => {
                    if (typeof p.categoria === 'string' && p.categoria.trim()) return p.categoria;
                    if (hasNombre(p.catalogo)) return p.catalogo.nombre;
                    if (hasNombre(p.CATALOGO)) return p.CATALOGO.nombre;
                    if (typeof p.catalogo === 'string' && p.catalogo.trim()) return p.catalogo;
                    if (typeof p.CATALOGO === 'string' && p.CATALOGO.trim()) return p.CATALOGO;
                    return 'SIN CATEGORÍA';
                };
                // Utilidad para extraer marca robusta
                const getMarcaRobusta = (p: Record<string, unknown>): string => {
                    if (typeof p.marca === 'string' && p.marca.trim()) return p.marca;
                    if (hasNombre(p.marca)) return p.marca.nombre;
                    if (hasNombre(p.MARCA)) return p.MARCA.nombre;
                    if (typeof p.MARCA === 'string' && p.MARCA.trim()) return p.MARCA;
                    return 'SIN MARCA';
                };
                return {
                    // Generamos un key único para cada producto
                    key_unique: randomInt(1, 1000000).toString(),
                    id:
                        typeof p.ID === 'number' || typeof p.ID === 'string'
                            ? p.ID.toString()
                            : typeof p.id === 'number' || typeof p.id === 'string'
                              ? p.id.toString()
                              : '',
                    nombre: cleanAndDecode(getString(p.nombre) || getString(p.NOMBRE)),
                    clave: getString(p.clave), // Solo campo directo
                    unidad_medida: getString(p.unidad_medida) || getString(p.unidadMedida),
                    precio_sugerido: getNumber(
                        p.precio_sugerido,
                        p.precioSugerido,
                        p.PRECIO_SUGERIDO
                    ),
                    precio_actual: getNumber(
                        p.precio_actual,
                        p.precioActual,
                        p.precio_sugerido,
                        p.precioSugerido,
                        p.PRECIO_SUGERIDO
                    ),
                    inventario_actual: 0, // Siempre entero
                    inventario_original: 0,
                    categoria: getCategoriaRobusta(p),
                    marca: getMarcaRobusta(p),
                    CATALOGO:
                        p.CATALOGO && typeof p.CATALOGO === 'object'
                            ? { nombre: getCategoria(p.CATALOGO) }
                            : undefined,
                    MARCA:
                        p.MARCA && typeof p.MARCA === 'object'
                            ? { nombre: getMarca(p.MARCA) }
                            : undefined,
                    modificado: false,
                };
            });
            setProducts(formatted);
        });
    }, []);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProductContext must be used within a ProductProvider');
    return context;
};
