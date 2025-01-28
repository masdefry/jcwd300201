import authStore from "@/zustand/authoStore";
import React, { useState } from "react";
import { instance } from "@/utils/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";

export const UsePackingCheckHook = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = React.use(params);
    const router = useRouter()
    const token = authStore((state) => state?.token);
    const emails = authStore((state) => state?.email);
    const { toast } = useToast();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogNotes, setDialogNotes] = useState("");
    const [isCheckedItem, setIsCheckedItem] = useState<boolean>(true)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)

    const { data: dataOrderNote, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/detail-order-note/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: dataOrderDetail, } = useQuery({
        queryKey: ['get-detail-item'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: dataItemName } = useQuery({
        queryKey: ['get-data-item'],
        queryFn: async () => {
            const res = await instance.get('/laundry', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleStatusOrder, isPending } = useMutation({
        mutationFn: async ({ email, notes }: { email:string, notes:string }) => {
            return await instance.post(`/order/packing-process/${slug}`, { email, notes }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: { data: { message: string } }) => {

            setIsDisabledSucces(true)
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            }),
                setTimeout(() => {
                    router.push('/worker/packing-worker/order/');
                }, 1000);
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    const handleDialogSubmit = () => {
        handleStatusOrder({ email: emails, notes: dialogNotes });
        setShowDialog(false);
    };

    const compareData = (frontendItems: any[], backendItems: any[]) => {
        if (!backendItems || backendItems.length !== frontendItems.length) return false;

        return frontendItems.every((item) =>
            backendItems.some(
                (backendItem) =>
                    String(backendItem.laundryItemId) === item.laundryItemId &&
                    backendItem.quantity === item.quantity
            )
        );
    };


    return {
        dataOrderNote,
        isFetching,
        showDialog,
        setShowDialog,
        dialogNotes,
        setDialogNotes,
        dataOrderDetail,
        dataItemName,
        isCheckedItem,
        setIsCheckedItem,
        isDisabledSucces,
        setIsDisabledSucces,
        handleStatusOrder,
        isPending,
        compareData,
        emails,
        handleDialogSubmit
    };

}