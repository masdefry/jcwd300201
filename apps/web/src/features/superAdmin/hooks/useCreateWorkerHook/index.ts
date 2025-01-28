'use client'

import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICreateUserBody } from "./types";
import { useState } from "react";

const useCreateWorkerHook = () => {
    const token = authStore((state) => state?.token)
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState<string>('')
    const { data: getDataStore } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const { mutate: handleCreateUser, isPending } = useMutation({
        mutationFn: async ({ email, firstName, lastName, phoneNumber, workerRole, identityNumber, outletId, motorcycleType, plateNumber, shiftId }: ICreateUserBody) => {
            return await instance.post('/auth/worker/register', { email, firstName, lastName, phoneNumber, workerRole, identityNumber, outletId, shiftId, motorcycleType, plateNumber }, {
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
            setIsValuePhoneNumber('')
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

    return { getDataStore, handleCreateUser, isPending, isValuePhoneNumber, setIsValuePhoneNumber }
}

export { useCreateWorkerHook }