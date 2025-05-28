import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  TextField, Paper, Typography, TablePagination, TableSortLabel
} from '@mui/material';
// import { Product } from '../types/Product';
import { useProductContext } from '../context/ProductContext';
import { useState } from 'react';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';

type Props = {
  search: string;
  showOnlyModified: boolean;
  minPrice: number | null;
  maxPrice: number | null;
};

export default function ProductTable({ search, showOnlyModified, minPrice, maxPrice }: Props) {
  const { products, setProducts } = useProductContext();

  // Estado de paginación
  const [page, setPage] = useState(0);
  const rowsPerPage = 4;

  // Estado de ordenamiento
  const [orderBy, setOrderBy] = useState<'nombre' | 'precio_sugerido' | 'precio_actual' | 'inventario_actual'>('nombre');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (property: 'nombre' | 'precio_sugerido' | 'precio_actual' | 'inventario_actual') => {
    if (orderBy === property) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(property);
      setOrder('asc');
    }
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

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

  // Ordenar los productos filtrados
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (orderBy === 'nombre') {
      cmp = a.nombre.localeCompare(b.nombre);
    } else if (orderBy === 'precio_sugerido') {
      cmp = a.precio_sugerido - b.precio_sugerido;
    } else if (orderBy === 'precio_actual') {
      cmp = a.precio_actual - b.precio_actual;
    } else if (orderBy === 'inventario_actual') {
      cmp = a.inventario_actual - b.inventario_actual;
    }
    return order === 'asc' ? cmp : -cmp;
  });

  // Slice para paginación
  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === 'nombre' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? order : 'asc'}
                  onClick={() => handleSort('nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'precio_sugerido' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'precio_sugerido'}
                  direction={orderBy === 'precio_sugerido' ? order : 'asc'}
                  onClick={() => handleSort('precio_sugerido')}
                >
                  Precio sugerido
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'precio_actual' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'precio_actual'}
                  direction={orderBy === 'precio_actual' ? order : 'asc'}
                  onClick={() => handleSort('precio_actual')}
                >
                  Precio actual
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'inventario_actual' ? order : false}>
                <TableSortLabel
                  active={orderBy === 'inventario_actual'}
                  direction={orderBy === 'inventario_actual' ? order : 'asc'}
                  onClick={() => handleSort('inventario_actual')}
                >
                  Inventario
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.key_unique}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {p.nombre.toUpperCase()}
                  </Typography>
                  <Typography variant="caption">{p.unidad_medida ? p.unidad_medida.toUpperCase() : ''}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.clave ? p.clave.toUpperCase() : ''}
                  </Typography>
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
                      step: '0.01', min: 0, style: { textAlign: 'right' }, pattern: '[0-9]+([.][0-9]+)?'
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
                    inputProps={{
                      step: '0.01', min: 0, pattern: '[0-9]+([.][0-9]+)?'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>
    </>
  );
}
