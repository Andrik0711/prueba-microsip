import {
  Box, Button, Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SummaryModal from '../components/SummaryModal';

export default function Summary() {
  const { products } = useProductContext();
  const modifiedProducts = products.filter(p => p.modificado);
  const totalInventory = modifiedProducts.reduce((acc, p) => acc + p.inventario_actual, 0);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h4" mt={2} gutterBottom>
        Resumen de cambios
      </Typography>
      <Typography mb={2}>
        Productos modificados: <strong>{modifiedProducts.length}</strong> | Inventario total: <strong>{totalInventory}</strong>
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Inventario</TableCell>
              <TableCell>Unidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modifiedProducts.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>{`$${Number(p.precio_actual).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</TableCell>
                <TableCell>{p.inventario_actual}</TableCell>
                <TableCell>{p.unidad_medida}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Regresar
        </Button>
        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          Guardar cambios
        </Button>
      </Box>

      <SummaryModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Modal de éxito si no está implementado dentro de SummaryModal */}
      {/*
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>¡Cambios guardados exitosamente!</DialogTitle>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      */}
    </Container>
  );
}
