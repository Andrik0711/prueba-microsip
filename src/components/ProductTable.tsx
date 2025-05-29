import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TextField,
    Paper,
    Typography,
    TablePagination,
    TableSortLabel,
    Checkbox,
    Chip,
    Tooltip,
    Box,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useProductContext } from '../context/ProductContext';
import { useState, useMemo } from 'react';

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
    const rowsPerPage = 3;

    // Estado de ordenamiento
    const [orderBy, setOrderBy] = useState<
        'nombre' | 'precio_sugerido' | 'precio_actual' | 'inventario_actual' | 'categoria' | 'marca'
    >('nombre');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    // Filtro de categoría y marca (case-insensitive, soporta distintos campos)
    const categorias = useMemo(() => {
        const set = new Set(
            products.map((p) =>
                (p.categoria || p.CATALOGO?.nombre || 'SIN CATEGORÍA').toString().toUpperCase()
            )
        );
        return Array.from(set).sort();
    }, [products]);
    const marcas = useMemo(() => {
        const set = new Set(
            products.map((p) =>
                (p.marca || p.MARCA?.nombre || 'SIN MARCA').toString().toUpperCase()
            )
        );
        return Array.from(set).sort();
    }, [products]);
    const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
    const [marcaFiltro, setMarcaFiltro] = useState<string>('');

    // Selección para edición por grupo
    const [selected, setSelected] = useState<string[]>([]);
    const handleSelectRow = (key: string) => {
        setSelected((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };
    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelected(paginated.map((p) => p.key_unique));
        else setSelected([]);
    };

    // Edición masiva ejemplo: poner inventario a 0
    const handleGroupSetInventarioCero = () => {
        setProducts(
            products.map((p) =>
                selected.includes(p.key_unique)
                    ? { ...p, inventario_actual: 0, modificado: true }
                    : p
            )
        );
        setSelected([]);
    };

    const handleSort = (
        property:
            | 'nombre'
            | 'precio_sugerido'
            | 'precio_actual'
            | 'inventario_actual'
            | 'categoria'
            | 'marca'
    ) => {
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

    const handleChange = (
        key_unique: string,
        field: 'precio_actual' | 'inventario_actual',
        value: string
    ) => {
        const newProducts = products.map((p) => {
            if (p.key_unique === key_unique) {
                let newValue: number;
                if (field === 'inventario_actual') {
                    newValue = Math.max(0, Math.floor(Number(value)) || 0); // Solo enteros positivos
                } else {
                    newValue = parseFloat(value) || 0;
                }
                const updated = {
                    ...p,
                    [field]: newValue,
                };
                updated.modificado =
                    updated.precio_actual !== updated.precio_sugerido ||
                    updated.inventario_actual !== updated.inventario_original;
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
        const categoriaValue = (p.categoria || p.CATALOGO?.nombre || 'SIN CATEGORÍA')
            .toString()
            .toUpperCase();
        const marcaValue = (p.marca || p.MARCA?.nombre || 'SIN MARCA').toString().toUpperCase();
        const matchCategoria = categoriaFiltro === '' || categoriaValue === categoriaFiltro;
        const matchMarca = marcaFiltro === '' || marcaValue === marcaFiltro;
        return matchSearch && matchModified && matchMin && matchMax && matchCategoria && matchMarca;
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
        } else if (orderBy === 'categoria') {
            const aCat = (a.categoria || a.CATALOGO?.nombre || '').toString().toUpperCase();
            const bCat = (b.categoria || b.CATALOGO?.nombre || '').toString().toUpperCase();
            cmp = aCat.localeCompare(bCat);
        } else if (orderBy === 'marca') {
            const aMarca = (a.marca || a.MARCA?.nombre || '').toString().toUpperCase();
            const bMarca = (b.marca || b.MARCA?.nombre || '').toString().toUpperCase();
            cmp = aMarca.localeCompare(bMarca);
        }
        return order === 'asc' ? cmp : -cmp;
    });

    // Slice para paginación
    const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            {/* Filtros de categoría y marca */}
            <Box mb={2} display="flex" alignItems="center" gap={2}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                        value={categoriaFiltro}
                        label="Categoría"
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {categorias.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Marca</InputLabel>
                    <Select
                        value={marcaFiltro}
                        label="Marca"
                        onChange={(e) => setMarcaFiltro(e.target.value)}
                    >
                        <MenuItem value="">Todas</MenuItem>
                        {marcas.map((marca) => (
                            <MenuItem key={marca} value={marca}>
                                {marca}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selected.length > 0 && (
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={handleGroupSetInventarioCero}
                    >
                        Inventario a 0 ({selected.length})
                    </Button>
                )}
            </Box>
            <TableContainer component={Paper}>
                <Table size="medium" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={
                                        selected.length > 0 && selected.length < paginated.length
                                    }
                                    checked={
                                        paginated.length > 0 && selected.length === paginated.length
                                    }
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    inputProps={{ 'aria-label': 'Seleccionar todos' }}
                                />
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'nombre' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'nombre'}
                                    direction={orderBy === 'nombre' ? order : 'asc'}
                                    onClick={() => handleSort('nombre')}
                                >
                                    Nombre
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'categoria' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'categoria'}
                                    direction={orderBy === 'categoria' ? order : 'asc'}
                                    onClick={() => handleSort('categoria')}
                                >
                                    Categoría
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'marca' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'marca'}
                                    direction={orderBy === 'marca' ? order : 'asc'}
                                    onClick={() => handleSort('marca')}
                                >
                                    Marca
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                sortDirection={orderBy === 'precio_sugerido' ? order : false}
                            >
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
                            <TableCell
                                sortDirection={orderBy === 'inventario_actual' ? order : false}
                            >
                                <TableSortLabel
                                    active={orderBy === 'inventario_actual'}
                                    direction={orderBy === 'inventario_actual' ? order : 'asc'}
                                    onClick={() => handleSort('inventario_actual')}
                                >
                                    Inventario
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Editado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.map((p) => {
                            const categoriaValue = (
                                p.categoria ||
                                p.CATALOGO?.nombre ||
                                'SIN CATEGORÍA'
                            )
                                .toString()
                                .toUpperCase();
                            const marcaValue = (p.marca || p.MARCA?.nombre || 'SIN MARCA')
                                .toString()
                                .toUpperCase();
                            return (
                                <TableRow
                                    key={p.key_unique}
                                    selected={selected.includes(p.key_unique)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.includes(p.key_unique)}
                                            onChange={() => handleSelectRow(p.key_unique)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {p.nombre.toUpperCase()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {p.id ? p.id : ''}
                                        </Typography>
                                        {p.unidad_medida && (
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                                sx={{ fontSize: 13, fontWeight: 500 }}
                                            >
                                                {p.unidad_medida.toUpperCase()}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            {p.clave ? p.clave.toUpperCase() : ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={categoriaValue} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={marcaValue}
                                            size="small"
                                            color={
                                                marcaValue !== 'SIN MARCA' ? 'default' : 'warning'
                                            }
                                        />
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
                                            onChange={(e) =>
                                                handleChange(
                                                    p.key_unique,
                                                    'precio_actual',
                                                    e.target.value
                                                )
                                            }
                                            inputProps={{
                                                step: '0.01',
                                                min: 0,
                                                style: { textAlign: 'right' },
                                                pattern: '[0-9]+([.][0-9]+)?',
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <span style={{ marginRight: 4 }}>$</span>
                                                ),
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
                                            onChange={(e) =>
                                                handleChange(
                                                    p.key_unique,
                                                    'inventario_actual',
                                                    e.target.value
                                                )
                                            }
                                            inputProps={{
                                                step: '1',
                                                min: 0,
                                                pattern: '[0-9]*',
                                                inputMode: 'numeric',
                                                style: { textAlign: 'right' },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {p.modificado && (
                                            <Tooltip title="Artículo editado">
                                                <EditIcon color="primary" fontSize="small" />
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
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
