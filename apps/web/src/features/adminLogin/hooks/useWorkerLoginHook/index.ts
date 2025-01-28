'use client'

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { useToast } from "@/components/hooks/use-toast";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'

const secret_key_crypto = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || ''
const useWorkerLoginHook = () => {
    const { toast } = useToast()
    const setToken = authStore((state) => state?.setAuth)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)

    const { mutate: handleLoginAdmin, isPending } = useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }) => {
            return await instance.post('/auth/worker/login', { email, password })
        },
        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                totalWorker: res?.data?.data?.totalWorker,
                productLaundry: res?.data?.data?.productLaundry
            })

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            const role = CryptoJS.AES.encrypt(res?.data?.data?.role, secret_key_crypto).toString()

            Cookies.set('__rolx', role)
            Cookies.set('__toksed', res?.data?.data?.token)

            setIsDisabledSucces(true)

            if (res?.data?.data?.role == 'SUPER_ADMIN') {
                window.location.href = '/admin/dashboard'
            } else if (res?.data?.data?.role == 'OUTLET_ADMIN') {
                window.location.href = '/worker/admin-outlet/dashboard'
            } else if (res?.data?.data?.role == 'WASHING_WORKER') {
                window.location.href = '/worker/washing-worker/dashboard'
            } else if (res?.data?.data?.role == 'IRONING_WORKER') {
                window.location.href = '/worker/ironing-worker/dashboard'
            } else if (res?.data?.data?.role == 'PACKING_WORKER') {
                window.location.href = '/worker/packing-worker/dashboard'
            } else if (res?.data?.data?.role == 'DRIVER') {
                window.location.href = '/worker/driver/dashboard'
            } else {
                window.location.href = '/'
            }
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    return {
        passwordVisible, setPasswordVisible,
        isDisabledSucces, setIsDisabledSucces,
        togglePasswordVisibility, handleLoginAdmin, isPending
    }
}

export { useWorkerLoginHook }