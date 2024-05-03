interface ModalProps {
    id: number | string | undefined | null;
    show: boolean;
    onHide: () => void;
    updateData: (updatedInstance: any) => void;
}