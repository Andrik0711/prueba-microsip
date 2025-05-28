import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, Paper, Typography
} from '@mui/material';
import { Product } from '../types/Product';
import { useProductContext } from '../context/ProductContext';
import { useState, useMemo } from 'react';

type Props = {
  search: string;
  showOnlyModified: boolean;
};

export default function ProductTable({ search, showOnlyModified }: Props) {
  const { products, setProducts } = useProductContext();

  // Nuevo estado para el filtro de rango de precio actual
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Calcular el rango real de precios actuales en los productos
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const precios = products.map((p) => p.precio_actual);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios),
    };
  }, [products]);

  const handleChange = (key_unique: string, field: 'precio_actual' | 'inventario_actual', value: string) => {
    const newProducts = products.map((p) => {
      if (p.key_unique === key_unique) {
        const updated = {
          ...p,
          [field]: parseFloat(value) || 0,
        };
        updated.modificado =
          updated.precio_actual !== updated.precio_sugerido || updated.inventario_actual !== updated.inventario_original;
        return updated;
      }
      return p;
    });
    setProducts(newProducts);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.clave.toLowerCase().includes(search.toLowerCase());
    const matchModified = !showOnlyModified || p.modificado;
    const matchMin = minPrice === null || p.precio_actual >= minPrice;
    const matchMax = maxPrice === null || p.precio_actual <= maxPrice;
    return matchSearch && matchModified && matchMin && matchMax;
  });

  return (
    <>
      {/* Filtro de rango de precio actual */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        <Typography variant="body2">Filtrar por precio actual:</Typography>
        <TextField
          label={`Mín ($${priceRange.min.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`}
          type="number"
          size="small"
          value={minPrice ?? ''}
          onChange={e => setMinPrice(e.target.value === '' ? null : Number(e.target.value))}
          inputProps={{ min: priceRange.min, max: priceRange.max, step: '0.01' }}
          sx={{ width: 120 }}
        />
        <TextField
          label={`Máx ($${priceRange.max.toLocaleString('es-MX', { minimumFractionDigits: 2 })})`}
          type="number"
          size="small"
          value={maxPrice ?? ''}
          onChange={e => setMaxPrice(e.target.value === '' ? null : Number(e.target.value))}
          inputProps={{ min: priceRange.min, max: priceRange.max, step: '0.01' }}
          sx={{ width: 120 }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio sugerido</TableCell>
              <TableCell>Precio actual</TableCell>
              <TableCell>Inventario</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.key_unique}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {p.nombre}
                  </Typography>
                  <Typography variant="caption">{p.unidad_medida}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {`$${Number(p.precio_sugerido).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <TextField
                    label="Precio actual"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={p.precio_actual}
                    onChange={(e) => handleChange(p.key_unique, 'precio_actual', e.target.value)}
                    inputProps={{
                      step: '0.01', min: 0, style: { textAlign: 'right' }
                    }}
                    InputProps={{
                      startAdornment: <span style={{ marginRight: 4 }}>$</span>,
                    }}
                    sx={{ width: 140 }}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    value={p.inventario_actual}
                    onChange={(e) => handleChange(p.key_unique, 'inventario_actual', e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
