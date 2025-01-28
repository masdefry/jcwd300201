'use client'

import { useToast } from "@/components/hooks/use-toast";
import authStore from "@/zustand/authoStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ILoginGoogleUser, ILoginUser } from "./type";
import { instance } from "@/utils/axiosInstance";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import auth from "@/utils/firebase";
import CryptoJS from 'crypto-js'

const provider = new GoogleAuthProvider()
const secret_key_crypto = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || ''

export const useLoginUserHook = () => {
    const { toast } = useToast()
    const setToken = authStore((state) => state?.setAuth)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
    const { mutate: handleLoginUser, isPending } = useMutation({
        mutationFn: async ({ email, password }: ILoginUser) => {
            return await instance.post('/auth/user/login', {
                email, password
            })
        },

        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                isVerified: res?.data?.data?.isVerified,
                profilePicture: res?.data?.data?.profilePicture,
                isDiscountUsed: res?.data?.data?.isDiscountUsed,
            })

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            const role = CryptoJS.AES.encrypt(res?.data?.data?.role, secret_key_crypto).toString()

            Cookies.set('__rolx', role)
            Cookies.set('__toksed', res?.data?.data?.token)

            setIsDisabledSucces(true)
            window.location.href = '/'
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    const { mutate: signInWithGoogle } = useMutation({
        mutationFn: async ({ firstName, lastName, email, profilePicture }: ILoginGoogleUser) => {
            return await instance.post('/auth/user/sign-w-google', {
                firstName, lastName, email, profilePicture
            })
        },
        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                isVerified: res?.data?.data?.isVerified,
                profilePicture: res?.data?.data?.profilePicture,
                isDiscountUsed: res?.data?.data?.isDiscountUsed,
            })

            const role = CryptoJS.AES.encrypt(res?.data?.data?.role, secret_key_crypto).toString()

            Cookies.set('__rolx', role)
            Cookies.set('__toksed', res?.data?.data?.token)

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            window.location.href = '/'
        },
        onError: (err) => {
            console.log('err')
        }
    })

    const { mutate: loginWithGoogle } = useMutation({
        mutationFn: async () => {
            return await signInWithPopup(auth, provider)
        },
        onSuccess: (res) => {
            signInWithGoogle({
                firstName: res?.user?.displayName?.split(' ')[0] as string,
                lastName: res?.user?.displayName?.split(' ')[1] as string,
                email: res?.user?.email as string,
                profilePicture: res?.user?.photoURL as string
            })
        },
        onError: (err) => {
        }
    })

    return {
        passwordVisible,
        setPasswordVisible,
        isDisabledSucces,
        setIsDisabledSucces,
        togglePasswordVisibility,
        handleLoginUser,
        isPending,
        signInWithGoogle,
        loginWithGoogle
    }
}