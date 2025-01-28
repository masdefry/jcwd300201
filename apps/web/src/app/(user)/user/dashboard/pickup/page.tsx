'use client'

import ContentWebLayout from '@/components/core/webSessionContent';
import ContentMobileLayout from '@/components/core/mobileSessionLayout/mainMenuLayout';
import { FaTruck } from "react-icons/fa6";
import { pickupValidationSchema } from '@/features/user/schemas/pickupValidationSchema';
import { useRequestPickupHook } from '@/features/user/hooks/useRequestPickupHook';
import { PickupForm } from '@/features/user/components/formPickupMobile';
import { AddressPopUpDialog } from '@/features/user/components/addressSectionComponent';
import { PickupFormWeb } from '@/features/user/components/formPickupWeb';

export default function PickupLaundry() {
    const {
        selectedAddress,
        openDialog,
        setOpenDialog,
        isDisabledSucces,
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
    } = useRequestPickupHook();

    return (
        <>
            <ContentMobileLayout title='Permintaan Pickup' icon={<FaTruck className='text-lg' />}>
                <PickupForm
                    dataOrderType={dataOrderType}
                    dataOrderTypeLoading={dataOrderTypeLoading}
                    dataNearestStoreLoading={dataNearestStoreLoading}
                    setOpenDialog={setOpenDialog}
                    dataMainAddressLoading={dataMainAddressLoading}
                    dataNearestStore={dataNearestStore}
                    dataMainAddress={dataMainAddress}
                    selectedAddress={selectedAddress}
                    handlePickupRequest={handlePickupRequest}
                    pickupValidationSchema={pickupValidationSchema}
                    PendingPickupSubmit={PendingPickupSubmit}
                    isDisabledSucces={isDisabledSucces}
                />
            </ContentMobileLayout>

            <AddressPopUpDialog
                setUserAddress={setUserAddress}
                handleAddressSelect={handleAddressSelect}
                dataAllAddress={dataAllAddress}
                dataAllAddressLoading={dataAllAddressLoading}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />

            <ContentWebLayout caption='Permintaan Pickup'>
                <PickupFormWeb
                    dataOrderType={dataOrderType}
                    dataOrderTypeLoading={dataOrderTypeLoading}
                    dataNearestStoreLoading={dataNearestStoreLoading}
                    setOpenDialog={setOpenDialog}
                    dataMainAddressLoading={dataMainAddressLoading}
                    dataNearestStore={dataNearestStore}
                    dataMainAddress={dataMainAddress}
                    selectedAddress={selectedAddress}
                    handlePickupRequest={handlePickupRequest}
                    pickupValidationSchema={pickupValidationSchema}
                    PendingPickupSubmit={PendingPickupSubmit}
                    isDisabledSucces={isDisabledSucces}
                />
            </ContentWebLayout >
        </>
    );
}
