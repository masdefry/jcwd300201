import { useRouter } from "next/navigation";

export interface IPaymentMethodMobile {
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
    handlePaymmentOrder: (orderId?: number) => void;
    setIsUploadDialogOpen: (isOpen: boolean) => void;
    router: ReturnType<typeof useRouter>;
}