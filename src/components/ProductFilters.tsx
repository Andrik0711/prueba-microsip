import { Box, FormControlLabel, Switch, TextField } from '@mui/material';

type Props = {
  search: string;
  setSearch: (v: string) => void;
  showOnlyModified: boolean;
  setShowOnlyModified: (v: boolean) => void;
};

export default function ProductFilters({ search, setSearch, showOnlyModified, setShowOnlyModified }: Props) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
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
    </Box>
  );
}
