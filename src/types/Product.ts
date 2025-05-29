// src/types/Product.ts
export interface Product {
    // generamos una interfaz para definir la estructura de un producto
    key_unique: string; // clave única generada aleatoriamente
    id: string;
    nombre: string;
    clave: string;
    unidad_medida: string;
    precio_sugerido: number;
    precio_actual: number;
    inventario_actual: number;
    categoria?: string; // opcional, ya que no todos los productos tienen categoría
    marca?: string; // nombre de la marca, si existe
    // Para compatibilidad flexible con objetos anidados
    CATALOGO?: { nombre?: string };
    MARCA?: { nombre?: string };
    inventario_original: number;
    modificado: boolean;
}
