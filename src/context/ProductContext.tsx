// src/context/ProductContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/Product';
import { fetchProducts } from '../api/KladiApi.ts';

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
        const getString = (v: unknown): string => typeof v === 'string' ? v : '';
        const getFirstClave = (v: unknown): string => Array.isArray(v) && v[0] && typeof v[0].clave === 'string' ? v[0].clave : '';
        // Extrae el nombre de la categoría sin usar 'any'
        const getCategoria = (v: unknown): string => {
          if (v && typeof v === 'object' && 'nombre' in v) {
            const nombre = (v as { nombre?: unknown }).nombre;
            return typeof nombre === 'string' ? nombre : '';
          }
          return '';
        };
        return {
          // Generamos un key único para cada producto
          key_unique: randomInt(1, 1000000).toString(),
          id: getString(p.id) || getString(p.ID),
          nombre: cleanAndDecode(getString(p.nombre) || getString(p.NOMBRE)),
          clave: getString(p.clave) || getFirstClave(p.claves),
          unidad_medida: getString(p.unidad_medida) || getString(p.unidadMedida),
          precio_sugerido: parseFloat(cleanAndDecode(getString(p.precio_sugerido) || getString(p.precioSugerido) || '0')),
          precio_actual: parseFloat(cleanAndDecode(getString(p.precio_actual) || getString(p.precioActual) || getString(p.precio_sugerido) || getString(p.precioSugerido) || '0')),
          inventario_actual: 0,
          inventario_original: 0,
          categoria: getString(p.categoria) || getCategoria(p.CATALOGO),
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

// Limpia el prefijo 'val::' y decodifica caracteres mal codificados
function cleanAndDecode(str: string): string {
  if (!str) return '';
  const cleaned = str.startsWith('val::') ? str.slice(5) : str;
  try {
    return decodeURIComponent(escape(cleaned));
  } catch {
    return cleaned;
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
