'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Formik } from 'formik';
import ProfileSettings from '@/components/core/profileSettings';
import ChangePassword from '@/components/core/changePassword';
import { usePackingWorkerSettingsHook } from '@/features/packingWorker/hooks/usePackingWorkerSettingsHook';
import ContentWebLayout from '@/components/core/webSessionContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { packingChangePasswordValidationSchema } from '@/features/packingWorker/schemas/packingChangePasswordValidationSchema';
import ProfileSettingsMobile from '@/components/core/profileSettingsMobile';
import { FaGear } from 'react-icons/fa6';
import ContentMobileLayout from '@/components/core/mobileSessionLayout/mainMenuLayout';
import { packingAccountValidationSchema } from '@/features/packingWorker/schemas/packingAccountValidationSchema';
import { packingAccountMobileValidationSchema } from '@/features/packingWorker/schemas/packingAccountMobileValidationSchema';
import { ConfirmAlert } from '@/components/core/confirmAlertCustom';
import ButtonCustom from '@/components/core/buttonCustom';
import { FaSignOutAlt } from 'react-icons/fa';

const profilePict = process.env.NEXT_PUBLIC_PHOTO_PROFILE || ''
export default function Page() {
    const { token, value, tempProfilePict, setTempProfilePict, oldPasswordVisible,
        passwordVisible, confirmPasswordVisible, handleChange, togglePasswordVisibility,
        toggleOldPasswordVisibility, toggleConfirmPasswordVisibility, getDataWorker, isFetching,
        handleUpdateProfile, isPendingUpdate, handleDeleteProfilePicture, isPendingDelete,
        handleChangePassword, isPendingChangePassword, isDisableSucces, isChangePassword, handleLogoutAdmin, isPending } = usePackingWorkerSettingsHook()

    if (isFetching) return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
            <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                <div className="flex flex-col w-full gap-5 h-full">
                    <div className="w-full py-7 bg-neutral-300 animate-pulse px-14 rounded-xl">
                        <h1 className="font-bold text-white"></h1>
                    </div>
                    <div className='w-full flex gap-2'>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                    </div>
                    <div className='w-full h-full bg-neutral-300 animate-pulse rounded-xl'></div>
                </div>
            </section>
        </main>
    )

    return (
        <>
            <ContentMobileLayout icon={<FaGear className='text-lg' />} title="Pengaturan">
                <Tabs defaultValue="1" className="fit">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="1" >Akun</TabsTrigger>
                        <TabsTrigger value="2" >Change Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        <Formik initialValues={{
                            firstNames: getDataWorker?.firstName || '',
                            lastNames: getDataWorker?.lastName || '',
                            emails: getDataWorker?.email || '',
                            phoneNumbers: getDataWorker?.phoneNumber || '',
                            img: null
                        }} validationSchema={packingAccountMobileValidationSchema}
                            onSubmit={(values) => {
                                const fd = new FormData()
                                fd.append('email', values?.emails)
                                fd.append('firstName', values?.firstNames)
                                fd.append('lastName', values?.lastNames)
                                fd.append('phoneNumber', values?.phoneNumbers)
                                if (values?.img) fd.append('images', values?.img)

                                handleUpdateProfile(fd)
                            }}>
                            {({ setFieldValue, values }) => (
                                <ProfileSettingsMobile disabledProfilePhoto={isPendingDelete} isDisabledSucces={isDisableSucces}
                                    disabledSubmitButton={isPendingUpdate} getData={getDataWorker}
                                    handleDeleteProfilePicture={handleDeleteProfilePicture}
                                    profilePict={profilePict} setFieldValue={setFieldValue}
                                    setTempProfilePict={setTempProfilePict} tempProfilePict={tempProfilePict} />
                            )}
                        </Formik>
                    </TabsContent>
                    <TabsContent value="2">
                        <Formik initialValues={{
                            existingPassword: '',
                            password: '',
                            confirmPassword: ''
                        }} validationSchema={packingChangePasswordValidationSchema}
                            onSubmit={(values, { resetForm }) => {
                                handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password }, {
                                    onSuccess: () => {
                                        resetForm()
                                    }
                                })
                            }}>
                            <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                        </Formik>
                    </TabsContent>
                </Tabs>
                <ConfirmAlert caption="Apakah anda yakin ingin logout?" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisableSucces}>
                    <ButtonCustom btnColor='bg-red-500 hover:bg-red-500' rounded='rounded-full gap-2' disabled={isPending || isDisableSucces} width='w-full'><FaSignOutAlt /> Logout</ButtonCustom>
                </ConfirmAlert>
            </ContentMobileLayout>

            <ContentWebLayout caption='Pengaturan'>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="Pengaturan tabs">
                            <Tab label="Akun" value="1" />
                            <Tab label="Change Password" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" className="w-full p-6 bg-gray-50 rounded-xl">
                        <Formik initialValues={{
                            firstName: getDataWorker?.firstName || '',
                            lastName: getDataWorker?.lastName || '',
                            email: getDataWorker?.email || '',
                            phoneNumber: getDataWorker?.phoneNumber || '',
                            images: null
                        }} validationSchema={packingAccountValidationSchema}
                            onSubmit={(values) => {
                                const fd = new FormData()
                                fd.append('email', values?.email)
                                fd.append('firstName', values?.firstName)
                                fd.append('lastName', values?.lastName)
                                fd.append('phoneNumber', values?.phoneNumber)
                                if (values?.images) fd.append('images', values?.images)

                                handleUpdateProfile(fd)
                            }}>
                            {({ setFieldValue, values }) => (
                                <ProfileSettings disabledProfilePhoto={isPendingDelete} isDisabledSucces={isDisableSucces}
                                    disabledSubmitButton={isPendingUpdate} getData={getDataWorker}
                                    handleDeleteProfilePicture={handleDeleteProfilePicture}
                                    profilePict={profilePict} setFieldValue={setFieldValue}
                                    setTempProfilePict={setTempProfilePict} tempProfilePict={tempProfilePict} />
                            )}
                        </Formik>
                    </TabPanel>
                    <TabPanel value="2" className="w-full p-6 bg-gray-50 rounded-xl">
                        <Formik initialValues={{
                            existingPassword: '',
                            password: '',
                            confirmPassword: ''
                        }}
                            validationSchema={packingChangePasswordValidationSchema}
                            onSubmit={(values, { resetForm }) => handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password }, {
                                onSuccess: () => {
                                    resetForm()
                                }
                            })}>
                            <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                        </Formik>
                    </TabPanel>
                </TabContext>
            </ContentWebLayout>
        </>
    );
}
