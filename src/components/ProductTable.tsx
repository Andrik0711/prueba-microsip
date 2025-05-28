import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, Paper, Typography
} from '@mui/material';
import { Product } from '../types/Product';
import { useProductContext } from '../context/ProductContext';

type Props = {
  search: string;
  showOnlyModified: boolean;
};

export default function ProductTable({ search, showOnlyModified }: Props) {
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
    return matchSearch && matchModified;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Precio</TableCell>
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
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  value={p.precio_actual}
                  onChange={(e) => handleChange(p.key_unique, 'precio_actual', e.target.value)}
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
              <TableCell>{p.unidad_medida}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
