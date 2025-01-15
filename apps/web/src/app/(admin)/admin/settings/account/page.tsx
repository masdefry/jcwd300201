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
import { useAdminSettingsHook } from '@/features/superAdmin/hooks/useAdminSettingsHook';
import ContentWebLayout from '@/components/core/webSessionContent';
import MobileSessionLayout from '@/components/core/mobileSessionLayout/subMenuLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent } from '@/components/ui/card';
import ProfileSettingsMobile from '@/components/core/profileSettingsMobile';
import { adminAccountValidationSchema } from '@/features/superAdmin/schemas/adminAccountValidationSchema';
import { adminAccountMobileValidationSchema } from '@/features/superAdmin/schemas/adminAccountMobileValidationSchema';
import { adminChangePasswordValidationSchema } from '@/features/superAdmin/schemas/adminChangePasswordValidationSchema';

const profilePict = process.env.NEXT_PUBLIC_PHOTO_PROFILE || ''
export default function Page() {
    const { token, value, tempProfilePict, setTempProfilePict, oldPasswordVisible,
        passwordVisible, confirmPasswordVisible, handleChange, togglePasswordVisibility,
        toggleOldPasswordVisibility, toggleConfirmPasswordVisibility, getDataWorker, isFetching,
        handleUpdateProfile, isPendingUpdate, handleDeleteProfilePicture, isPendingDelete,
        handleChangePassword, isPendingChangePassword, isDisableSucces, isChangePassword, setActiveTab } = useAdminSettingsHook()

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
            <MobileSessionLayout title='Pengaturan'>
                <Tabs defaultValue='change-profile' onValueChange={(tab) => setActiveTab(tab)}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="change-profile">Ubah Profil</TabsTrigger>
                        <TabsTrigger value="change-password">Ganti Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="change-profile">
                        <CardContent className="space-y-2 pt-2">
                            <Formik initialValues={{
                                firstNames: getDataWorker?.firstName || '',
                                lastNames: getDataWorker?.lastName || '',
                                emails: getDataWorker?.email || '',
                                phoneNumbers: getDataWorker?.phoneNumber || '',
                                img: null
                            }} validationSchema={adminAccountMobileValidationSchema}
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
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="change-password">
                        <CardContent className="space-y-2 pt-2">
                            <Formik initialValues={{
                                existingPassword: '',
                                password: '',
                                confirmPassword: ''
                            }}
                                validationSchema={adminChangePasswordValidationSchema}
                                onSubmit={(values) => handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password })}>
                                <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                    confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                    isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                    toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                            </Formik>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </MobileSessionLayout>

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
                        }} validationSchema={adminAccountValidationSchema}
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
                            validationSchema={adminChangePasswordValidationSchema}
                            onSubmit={(values) => handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password })}>
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
