'use client'
import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export const useContactHook = () => {
    const token = authStore((state) => state?.token)
    const [isDisabledSuccess, setIsDisabledSuccess] = useState<boolean>(false)
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState<string>('')
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
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            if (err?.response?.data?.message === 'Harap login terlebih dahulu') router.push('/user/login')
        }
    })

    return {
        isDisabledSuccess, setIsDisabledSuccess,
        handleSendMessage, isPendingSendMessage,
        isValuePhoneNumber, setIsValuePhoneNumber
    }
}