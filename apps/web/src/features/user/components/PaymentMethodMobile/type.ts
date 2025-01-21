import { useRouter } from "next/navigation";

export interface IPaymentMethodWeb {
    isArrCardPayment: { img: string }[];
    dataOrderNote: {
        order?: {
            id?: number;
            isPaid?: boolean;
            paymentMethod?: string;
            paymentProof?: string;
            laundryPrice?: number | null;
        };
    };
    setIsPaymentMethod: (method: string) => void;
    isPaymentMethod: string;
    handlePaymmentOrder: any
    setIsUploadDialogOpen: (isOpen: boolean) => void;
    router: ReturnType<typeof useRouter>;
}