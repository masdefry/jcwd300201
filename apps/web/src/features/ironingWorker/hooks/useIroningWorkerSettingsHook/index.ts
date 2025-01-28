'use client'
import { toast } from '@/components/hooks/use-toast'
import { instance } from '@/utils/axiosInstance'
import authStore from '@/zustand/authoStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as React from 'react'
import Cookies from 'js-cookie'

export const useIroningWorkerSettingsHook = () => {
  const token = authStore((state) => state?.token)
  const email = authStore((state) => state?.email)
  const resetAuth = authStore((state) => state?.resetAuth)
  const [value, setValue] = React.useState('1')
  const [tempProfilePict, setTempProfilePict] = React.useState<string>('')
  const [oldPasswordVisible, setOldPasswordVisible] = React.useState<boolean>(false)
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState<boolean>(false)
  const [isDisableSucces, setIsDisableSucces] = React.useState(false)
  const [isChangePassword, setIsChangePassword] = React.useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => setValue(newValue);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible)
  const toggleOldPasswordVisibility = () => setOldPasswordVisible(!oldPasswordVisible)
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible)


  const { data: getDataWorker, isFetching } = useQuery({
    queryKey: ['get-data-worker'],
    queryFn: async () => {
      const response = await instance.get('/worker', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response?.data?.data
    }
  })

  const { mutate: handleUpdateProfile, isPending: isPendingUpdate } = useMutation({
    mutationFn: async (fd: FormData) => {
      return await instance.patch('/worker/profile', fd, {
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
      setIsDisableSucces(true)

      window.location.reload()
    },
    onError: (err: { response: { data: { message: string } } }) => {
      toast({
        description: err?.response?.data?.message,
        className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
      })
    }
  })

  const { mutate: handleDeleteProfilePicture, isPending: isPendingDelete } = useMutation({
    mutationFn: async () => {
      return await instance.delete('/worker', {
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
      setIsDisableSucces(true)

      window.location.reload()
    },
    onError: (err: { response: { data: { message: string } } }) => {
      toast({
        description: err?.response?.data?.message,
        className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
      })
    }
  })

  const { mutate: handleChangePassword, isPending: isPendingChangePassword } = useMutation({
    mutationFn: async ({ existingPassword, password }: { existingPassword: string, password: string }) => {
      return await instance.patch('/worker/change-password', {
        existingPassword, password
      }, {
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
      setIsChangePassword(true)
    },
    onError: (err: { response: { data: { message: string } } }) => {
      toast({
        description: err?.response?.data?.message,
        className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
      })
    }
  })

  const { mutate: handleLogoutAdmin, isPending } = useMutation({
    mutationFn: async () => {
      return await instance.post('/auth/worker/logout', { email }, { headers: { Authorization: `Bearer ${token}` } })
    },
    onSuccess: (res) => {
      if (res) {
        Cookies.remove('__rolx')
        Cookies.remove('__toksed')
        resetAuth()

        toast({
          description: res?.data?.message,
          className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
        })

        setIsDisableSucces(true)

        window.location.href = '/worker/login'
      }
    },
    onError: (err: { response: { data: { message: string } } }) => {
      toast({
        description: err?.response?.data?.message,
        className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
      })
    }
  })
  return {
    token, value, setValue, tempProfilePict, setTempProfilePict, oldPasswordVisible, setOldPasswordVisible,
    passwordVisible, setPasswordVisible, confirmPasswordVisible, setConfirmPasswordVisible, handleChange,
    togglePasswordVisibility, toggleOldPasswordVisibility, toggleConfirmPasswordVisibility, getDataWorker, isFetching,
    handleUpdateProfile, isPendingUpdate, handleDeleteProfilePicture, isPendingDelete, handleChangePassword, isPendingChangePassword,
    isDisableSucces, isChangePassword, handleLogoutAdmin, isPending
  }
}