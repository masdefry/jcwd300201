'use client'

import { useToast } from "@/components/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { IRegisterUser } from "./types"
import { instance } from "@/utils/axiosInstance"

export const useRegisterHook = () => {
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const [isValuePhoneNumber, setIsValuePhoneNumber] = useState<string>('')
    const { toast } = useToast()

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: async ({ email, firstName, lastName, phoneNumber }: IRegisterUser) => {
            return await instance.post('/auth/user/register', { email, firstName, lastName, phoneNumber })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    return {
        isDisabledSucces,
        setIsDisabledSucces,
        handleRegister,
        isPending, isValuePhoneNumber, setIsValuePhoneNumber
    }
}