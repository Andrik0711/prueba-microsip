import { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import ProductTable from '../components/ProductTable';
import ProductFilters from '../components/ProductFilters';
import { useProductContext } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

export default function EditProducts() {
  const [search, setSearch] = useState('');
  const [showOnlyModified, setShowOnlyModified] = useState(false);
  const { products, setProducts } = useProductContext();
  const navigate = useNavigate();

  const handleRestorePrices = () => {
    const restored = products.map((p) => ({
      ...p,
      precio_actual: p.precio_sugerido,
      modificado: p.inventario_actual !== p.inventario_original,
    }));
    setProducts(restored);
  };

  const handleFinish = () => {
    navigate('/resumen');
  };

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
      />
      <ProductTable search={search} showOnlyModified={showOnlyModified} />

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button variant="outlined" color="secondary" onClick={handleRestorePrices}>
          Restaurar precios sugeridos
        </Button>
        <Button variant="contained" color="primary" onClick={handleFinish}>
          Finalizar cambios
        </Button>
      </Box>
    </Container>
  );
}
