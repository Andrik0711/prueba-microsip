import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function SummaryModal({ open, onClose }: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>¡Cambios guardados con éxito!</DialogTitle>
            <DialogContent>Tu inventario ha sido registrado correctamente.</DialogContent>
            <DialogActions>
                <Button onClick={onClose} autoFocus>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
