import { useState } from 'react';
import { Box, Button, Container, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ProductTable from '../components/ProductTable';
import ProductFilters from '../components/ProductFilters';
import { useProductContext } from '../context/ProductContext';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function EditProducts() {
  const [search, setSearch] = useState('');
  const [showOnlyModified, setShowOnlyModified] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const { products, setProducts } = useProductContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleRestorePrices = () => {
    const restored = products.map((p) => ({
      ...p,
      precio_actual: p.precio_sugerido,
      modificado: p.inventario_actual !== p.inventario_original,
    }));
    setProducts(restored);
  };

  const handleFinish = () => {
    setModalOpen(true);
  };

  // Productos modificados y suma de inventario
  const modifiedProducts = products.filter(p => p.modificado);
  const totalInventory = modifiedProducts.reduce((acc, p) => acc + p.inventario_actual, 0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom mt={2}>
        Inventario inicial
      </Typography>
      <ProductFilters
        search={search}
        setSearch={setSearch}
        showOnlyModified={showOnlyModified}
        setShowOnlyModified={setShowOnlyModified}
        products={products}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
      />
      <ProductTable
        search={search}
        showOnlyModified={showOnlyModified}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" color="secondary" onClick={handleRestorePrices}>
          Restaurar precios sugeridos
        </Button>
        <Button variant="contained" color="primary" onClick={handleFinish}>
          Finalizar cambios
        </Button>
      </Box>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resumen de cambios</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Productos modificados: <strong>{modifiedProducts.length}</strong> | Inventario total: <strong>{totalInventory}</strong>
          </Typography>
          <TableContainer component={Paper}>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Inventario</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modifiedProducts.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell>{`$${Number(p.precio_actual).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</TableCell>
                    <TableCell>{p.inventario_actual}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
