'use client'

import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICreateUserBody } from "./types";

const useCreateWorkerHooks = () => {
    const token = authStore((state) => state?.token)
    const { data: getDataStore } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const { mutate: handleCreateUser, isPending } = useMutation({
        mutationFn: async ({ email, firstName, lastName, phoneNumber, workerRole, identityNumber, storeId, motorcycleType, plateNumber, shiftId }: ICreateUserBody) => {
            return await instance.post('/auth/worker/register', { email, firstName, lastName, phoneNumber, workerRole, identityNumber, storeId, shiftId, motorcycleType, plateNumber }, {
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

    return { getDataStore, handleCreateUser, isPending }
}

export { useCreateWorkerHooks }