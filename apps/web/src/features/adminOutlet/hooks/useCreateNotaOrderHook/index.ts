'use client'
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useToast } from "@/components/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const useCreateNotaOrderHook = ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);
    const [isCheckedItem, setIsCheckedItem] = useState<boolean>(true)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const { toast } = useToast();

    const { mutate: handleCreateNotaOrder, isPending: createNotaPending } = useMutation({
        mutationFn: async ({ email, totalWeight, laundryPrice, items }: any) => {
            return await instance.post(`/order/order/${slug}`, { email, totalWeight, laundryPrice, items }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: { data: { message: string } }) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            setTimeout(() => {
                router.push('/worker/admin-outlet/nota-order');
            }, 1000);
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    const { data: dataOrderNote, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/detail-order-note/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: dataItemName, isLoading: dataItemNameLoading } = useQuery({
        queryKey: ['get-data-item'],
        queryFn: async () => {
            const res = await instance.get('/laundry', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });


    return {
        slug, router, token, email, isCheckedItem, setIsCheckedItem,
        isDisabledSucces, setIsDisabledSucces, handleCreateNotaOrder, createNotaPending,
        dataOrderNote, dataOrderNoteLoading, isFetching, dataItemName, dataItemNameLoading,
    }
}

export { useCreateNotaOrderHook }