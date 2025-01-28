'use client'

import { useToast } from "@/components/hooks/use-toast"
import { instance } from "@/utils/axiosInstance"
import React from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authStore from "@/zustand/authoStore";

export const useUserComplaintHook = ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state?.token);
    const { toast } = useToast();

    const { data: dataOrderNote, refetch, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleComplaint, isPending } = useMutation({
        mutationFn: async ({ complaintText }: any) => {
            return await instance.patch(`/order/complaint/${slug}`, { complaintText }, {
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
            refetch()
            setTimeout(() => {
                router.push('/user/dashboard/order');
            }, 1000);

        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    return {
        dataOrderNote,
        isFetching, handleComplaint, isPending
    }
}