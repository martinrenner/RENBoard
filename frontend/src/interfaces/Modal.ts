interface ModalProps {
    show: boolean;
    onHide: () => void;
}

interface EditModalProps {
    show: boolean;
    onHide: () => void;
    setData: (data: any) => void;
}

interface IdModalProps {
    show: boolean;
    onHide: () => void;
    id: number;
}