'use client'

import { toast } from "@/components/hooks/use-toast"
import { instance } from "@/utils/axiosInstance"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

export const useResendEmailUserHooks = () => {
    const router = useRouter()
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const { mutate: handleResendEmail, isPending } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            return await instance.post('/auth/user/resend-email', { email })
        },

        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
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
        isDisabledSucces,
        setIsDisabledSucces,
        handleResendEmail,
        isPending,
        router
    }
}