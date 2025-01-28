'use client'

import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";

const useDetailWorkerHook = ({ params }: { params: Promise<{ detail: string }> }) => {
    const slug = use(params)
    const idUser = slug?.detail
    const token = authStore((state) => state?.token)
    const email = authStore((state) => state?.email)
    const router = useRouter()

    const { data: workerData, isFetching } = useQuery({
        queryKey: ['get-data-worker'],
        queryFn: async () => {
            const res = await instance.get(`/worker/detail/${idUser}`)
            return res?.data?.data
        }
    })

    const { mutate: handleDeleteData, isPending: isPendingDelete } = useMutation({
        mutationFn: async () => {
            return await instance.patch(`/worker/detail/${idUser}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            router.push('/admin/worker')
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

    return {
        workerData, isFetching,
        handleDeleteData, isPendingDelete
    }
}

export { useDetailWorkerHook }