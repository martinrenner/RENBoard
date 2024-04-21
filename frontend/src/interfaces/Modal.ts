interface ModalProps {
    show: boolean;
    onHide: () => void;
}

interface IdModalProps {
    show: boolean;
    onHide: () => void;
    data: any;
    setData: (data: any) => void;
    id: number;
}