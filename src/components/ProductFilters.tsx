import {
    Box,
    FormControlLabel,
    Switch,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slider,
    Typography,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useState, useMemo } from 'react';

type Props = {
    search: string;
    setSearch: (v: string) => void;
    showOnlyModified: boolean;
    setShowOnlyModified: (v: boolean) => void;
    products: import('../types/Product').Product[];
    minPrice: number | null;
    maxPrice: number | null;
    setMinPrice: (v: number | null) => void;
    setMaxPrice: (v: number | null) => void;
};

export default function ProductFilters({
    search,
    setSearch,
    showOnlyModified,
    setShowOnlyModified,
    products,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
}: Props) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sliderValue, setSliderValue] = useState<[number, number]>([0, 0]);

    const priceRange = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 0 };
        const precios = products.map((p) => p.precio_actual);
        return {
            min: Math.min(...precios),
            max: Math.max(...precios),
        };
    }, [products]);

    useMemo(() => {
        setSliderValue([
            minPrice !== null ? minPrice : priceRange.min,
            maxPrice !== null ? maxPrice : priceRange.max,
        ]);
    }, [minPrice, maxPrice, priceRange.min, priceRange.max]);

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        const [min, max] = newValue as [number, number];
        setSliderValue([min, max]);
        setMinPrice(min);
        setMaxPrice(max);
    };

    const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? priceRange.min : Number(e.target.value);
        setMinPrice(value);
        setSliderValue([value, sliderValue[1]]);
    };
    const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === '' ? priceRange.max : Number(e.target.value);
        setMaxPrice(value);
        setSliderValue([sliderValue[0], value]);
    };

    return (
        <Box display="flex" alignItems="center" mb={2} gap={2}>
            <TextField
                label="Buscar por nombre o clave"
                variant="outlined"
                size="small"
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={showOnlyModified}
                        onChange={(e) => setShowOnlyModified(e.target.checked)}
                    />
                }
                label="Solo modificados"
            />
            <Button
                variant="outlined"
                startIcon={<FilterAltIcon />}
                onClick={() => setFiltersOpen(true)}
            >
                Filtros
            </Button>
            <Dialog
                open={filtersOpen}
                onClose={() => setFiltersOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Filtros Avanzados</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>Filtrar por precio actual</Typography>
                    <Box px={1}>
                        <Slider
                            value={sliderValue}
                            min={priceRange.min}
                            max={priceRange.max}
                            step={0.01}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            marks={[
                                { value: priceRange.min, label: `$${priceRange.min.toFixed(2)}` },
                                { value: priceRange.max, label: `$${priceRange.max.toFixed(2)}` },
                            ]}
                            sx={{ mb: 2 }}
                        />
                        <Box display="flex" gap={2} alignItems="center">
                            <TextField
                                label="Mín"
                                type="number"
                                size="small"
                                value={minPrice ?? priceRange.min}
                                onChange={handleMinInput}
                                inputProps={{
                                    min: priceRange.min,
                                    max: priceRange.max,
                                    step: '0.01',
                                }}
                                sx={{ width: 100 }}
                            />
                            <span>-</span>
                            <TextField
                                label="Máx"
                                type="number"
                                size="small"
                                value={maxPrice ?? priceRange.max}
                                onChange={handleMaxInput}
                                inputProps={{
                                    min: priceRange.min,
                                    max: priceRange.max,
                                    step: '0.01',
                                }}
                                sx={{ width: 100 }}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setMinPrice(null);
                            setMaxPrice(null);
                            setSliderValue([priceRange.min, priceRange.max]);
                        }}
                    >
                        Limpiar
                    </Button>
                    <Button onClick={() => setFiltersOpen(false)} variant="contained">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
