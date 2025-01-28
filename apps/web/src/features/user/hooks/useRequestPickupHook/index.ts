'use client'

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/hooks/use-toast';
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import { IAddress, IOrderType, IRequestPickup } from './type';

export const useRequestPickupHook = () => {
    const token = authStore((state) => state?.token);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();


    const [userAddress, setUserAddress] = useState(params.get('address') || null);

    const { mutate: handlePickupRequest, isPending: PendingPickupSubmit } = useMutation({
        mutationFn: async ({ deliveryFee, outletId, orderTypeId, userAddressId }: IRequestPickup) => {
            return await instance.post(
                '/order/request-pickup',
                { deliveryFee, outletId, orderTypeId, userAddressId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    });

    const { data: dataOrderType, isLoading: dataOrderTypeLoading } = useQuery<IOrderType[]>({
        queryKey: ['get-order-type'],
        queryFn: async () => {
            const res = await instance.get('/order/type');
            return res?.data?.data;
        },
    });

    const { data: dataMainAddress, isLoading: dataMainAddressLoading } = useQuery({
        queryKey: ['get-main-address'],
        queryFn: async () => {
            const res = await instance.get('/user/main-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
        retry: 4,

    });

    const { data: dataAllAddress, isLoading: dataAllAddressLoading } = useQuery({
        queryKey: ['get-all-address'],
        queryFn: async () => {
            const res = await instance.get('/user/all-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
        retry: 4,
    });

    const { data: dataNearestStore, refetch, isLoading: dataNearestStoreLoading } = useQuery({
        queryKey: ['get-nearest-store'],
        queryFn: async () => {
            const res = await instance.get('/order/nearest-store', {
                params: {
                    address: userAddress,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            return res?.data?.data;
        },
    });

    const handleAddressSelect = (address: IAddress) => {
        setSelectedAddress(address);
        setOpenDialog(false);
    };

    useEffect(() => {
        const currentUrl = new URLSearchParams(window.location.search); //
        if (userAddress) {
            currentUrl.set('address', userAddress);
        } else {
            currentUrl.delete('address');
        }
        router.push(`${pathname}?${currentUrl.toString()}`);
        refetch()
    }, [userAddress, router, refetch, pathname]);

    return {
        selectedAddress,
        setSelectedAddress,
        openDialog,
        setOpenDialog,
        isDisabledSucces,
        setIsDisabledSucces,
        userAddress,
        setUserAddress,
        handlePickupRequest,
        PendingPickupSubmit,
        dataOrderType,
        dataOrderTypeLoading,
        dataMainAddress,
        dataMainAddressLoading,
        dataAllAddress,
        dataAllAddressLoading,
        dataNearestStore,
        dataNearestStoreLoading,
        handleAddressSelect,
    }
}