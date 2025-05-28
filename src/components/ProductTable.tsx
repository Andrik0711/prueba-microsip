import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, Paper, Typography
} from '@mui/material';
// import { Product } from '../types/Product';
import { useProductContext } from '../context/ProductContext';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';

type Props = {
  search: string;
  showOnlyModified: boolean;
  minPrice: number | null;
  maxPrice: number | null;
};

export default function ProductTable({ search, showOnlyModified, minPrice, maxPrice }: Props) {
  const { products, setProducts } = useProductContext();

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
    const matchMin = minPrice === null ? true : p.precio_actual >= minPrice;
    const matchMax = maxPrice === null ? true : p.precio_actual <= maxPrice;
    return matchSearch && matchModified && matchMin && matchMax;
  });

  return (
    <>
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
