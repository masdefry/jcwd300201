'use client'
import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export const useContactHooks = ()=> {
    const token = authStore((state) => state?.token)
    const [isDisabledSuccess, setIsDisabledSuccess] = useState<boolean>(false)
    const router = useRouter()
    const { mutate: handleSendMessage, isPending: isPendingSendMessage } = useMutation({
        mutationFn: async ({ name, email, textHelp, phoneNumber }: { name: string, email: string, textHelp: string, phoneNumber: string }) => {
            return await instance.post('/contact', { name, email, textHelp, phoneNumber }, {
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

            setIsDisabledSuccess(true)
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            if (err?.response?.data?.message === 'Harap login terlebih dahulu') router.push('/user/login')
            console.log(err)
        }
    })

    return {
        isDisabledSuccess, setIsDisabledSuccess,
        handleSendMessage, isPendingSendMessage
    }
}