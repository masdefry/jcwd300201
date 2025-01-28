'use client'

import ContentWebLayout from "@/components/core/webSessionContent";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useEditOutletHook } from "@/features/superAdmin/hooks/useEditOutletHook";
import EditOutletMobile from "@/features/superAdmin/components/editOutletMobileComponent";
import EditOutletWeb from "@/features/superAdmin/components/editOutletWebComponent";

export default function Page({ params }: { params: Promise<{ detail: string }> }) {
    const {
        router, isDisabledSucces, dataOutlet, isFetching, loadingPage, handleUpdateOutlet, lngGlobal, token, isPosition, setIsPosition, selectedProvince, setSelectedProvince,
        cities, isPositionCheck, citiesLoading, provinces, provincesLoading, isPending,
    } = useEditOutletHook({ params })

    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title="Ubah Data Outlet">
                <div className="w-full h-fit pb-28">
                    <EditOutletMobile
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        dataOutlet={dataOutlet}
                        setSelectedProvince={setSelectedProvince}
                        isPositionCheck={isPositionCheck}
                        selectedProvince={selectedProvince}
                        isDisabledSucces={isDisabledSucces}
                        isPending={isPending}
                        router={router}
                        handleUpdateOutlet={handleUpdateOutlet}
                    />
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Ubah Data Outlet">
                <div className="w-full h-fit">
                    <EditOutletWeb
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        dataOutlet={dataOutlet}
                        setSelectedProvince={setSelectedProvince}
                        isPositionCheck={isPositionCheck}
                        selectedProvince={selectedProvince}
                        isDisabledSucces={isDisabledSucces}
                        isPending={isPending}
                        router={router}
                        handleUpdateOutlet={handleUpdateOutlet}
                    />
                </div>
            </ContentWebLayout>
        </>
    )
}
