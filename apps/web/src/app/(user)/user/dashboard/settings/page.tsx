'use client'

import { FaSignOutAlt } from 'react-icons/fa';
import ContentWebLayout from "@/components/core/webSessionContent";
import ListCustom from "@/components/core/listSettings";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { FaGear } from "react-icons/fa6";
import Link from "next/link";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import ButtonCustom from '@/components/core/buttonCustom';
import useLandingSettingsUserHooks from '@/features/user/hooks/useLandingSettingsUserHooks/useLandingSettingsUserHooks';
export default function Page() {
    const { isDisabledSucces, handleLogoutAdmin, isPending, settingsItems } = useLandingSettingsUserHooks()
    return (
        <>
            <ContentMobileLayout title='Pengaturan' icon={<FaGear className='text-lg' />}>
                <div className="min-h-44 px-3 flex gap-5 flex-col w-full">
                    {settingsItems?.map((set, i) => (
                        <Link href={set?.url} key={i} className="flex border-b pb-2 justify-between w-full h-fit items-center">
                            <div className="flex items-center gap-5 text-neutral-700">
                                <set.icon />
                                <h1 className="text-neutral-700">{set?.name}</h1>
                            </div>
                            <div className='w-2 h-2 rounded-full bg-green-700'></div>
                        </Link>
                    ))}
                    <ConfirmAlert caption="Apakah anda yakin ingin logout?" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                        <ButtonCustom btnColor='bg-red-500 hover:bg-red-500' type='button' rounded='rounded-full' disabled={isPending || isDisabledSucces} width='w-full gap-2'><FaSignOutAlt /> Logout</ButtonCustom>
                    </ConfirmAlert>
                </div>
            </ContentMobileLayout>
            <ContentWebLayout caption="Pengaturan">
                {settingsItems?.map((set, i) => (
                    <ListCustom key={i} url={set?.url} caption={set.name}><set.icon /></ListCustom>
                ))}
            </ContentWebLayout>
        </>
    )
}