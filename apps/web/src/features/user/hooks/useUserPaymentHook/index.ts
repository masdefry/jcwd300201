'use client'

import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import React from 'react';


export const useUserPaymentHook = ({ params }: { params: Promise<{ slug: string }> }) => {

    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false)
    const [isPaymentMethod, setIsPaymentMethod] = useState<string>('')
    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);
    const { toast } = useToast();

    const { data: dataOrderNote, refetch, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handlePaymmentOrder, isPending } = useMutation({
        mutationFn: async ({ email }: { email:string }) => {
            return await instance.post(`/order/payment/${slug}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: { data: { message: string; OrderUrl: { paymentProof: string }; } }) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setTimeout(() => {
                router.push(res?.data?.OrderUrl?.paymentProof);
            }, 1000);
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    const { mutate: uploadPaymentProof, isPending: isUploading } = useMutation({
        mutationFn: async (fd: FormData) => {
            return await instance.post(`/order/payment-tf/${slug}`, fd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-green-500 text-white p-4 rounded-lg shadow-lg",
            })

            refetch()
            setIsUploadDialogOpen(false);
        },
        onError: (error: any) => {
            toast({
                description: error.response?.data?.message || "Upload failed",
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg",
            });
        },
    });

    const isArrCardPayment = [
        { img: '/images/bca-card.png' },
        { img: '/images/bank-tf.png' },
        { img: '/images/dana-card.png' },
        { img: '/images/e-wallet.png' },
    ]
    return {
        isArrCardPayment, token, isUploadDialogOpen, setIsUploadDialogOpen, isPaymentMethod, setIsPaymentMethod
        , isFetching, refetch, isPending, uploadPaymentProof, isUploading
        , router, email, dataOrderNote, dataOrderNoteLoading, handlePaymmentOrder
    }
}

