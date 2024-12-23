'use client'

import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use } from "react";

const useDetailWorkerHooks = ({ params }: { params: Promise<{ detail: string }> }) => {
    const slug = use(params)
    const idUser = slug?.detail
    const token = authStore((state) => state?.token)
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
            return await instance.delete(`/worker/detail/${idUser}`, {
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

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            console.log(err)
        }
    })

    return {
        workerData, isFetching,
        handleDeleteData, isPendingDelete
    }
}

export { useDetailWorkerHooks }