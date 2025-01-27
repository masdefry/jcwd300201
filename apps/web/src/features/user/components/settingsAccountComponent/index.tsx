'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import ProfileSettings from '@/components/core/profileSettings';
import ChangePassword from '@/components/core/changePassword';
import { useUserSettingsHook } from '@/features/user/hooks/useUserSettingsHook';
import { FaEye, FaEyeSlash, FaGear } from 'react-icons/fa6';
import ButtonCustom from '@/components/core/buttonCustom';
import ContentMobileLayout from '@/components/core/mobileSessionLayout/mainMenuLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettingsMobile from '@/components/core/profileSettingsMobile';
import { userAccountValidationMobileSchema } from '@/features/user/schemas/userAccountMobileValidationSchema';
import { userAccountValidationSchema } from '@/features/user/schemas/userAccountValidationSchema';
import { userGoogleChangePasswordValidationSchema } from '@/features/user/schemas/userGoogleChangePasswordValidationSchema';
import ContentWebLayout from '@/components/core/webSessionContent';
import { userChangePasswordValidationSchema } from '@/features/user/schemas/userChangePasswordValidationSchema';

const profilePict = process.env.NEXT_PUBLIC_PHOTO_PROFILE || ''
export default function SettingsAccountComponent() {
    const { token, value, tempProfilePict, setTempProfilePict, oldPasswordVisible,
        passwordVisible, confirmPasswordVisible, handleChange, togglePasswordVisibility,
        toggleOldPasswordVisibility, toggleConfirmPasswordVisibility, getDataUser, isFetching,
        handleUpdateProfile, isPendingUpdate, handleDeleteProfilePicture, isPendingDelete,
        handleChangePassword, isPendingChangePassword, isDisableSucces, isChangePassword,
        handleChangePasswordGoogleRegister, isPendingChangePasswordGoogleRegister } = useUserSettingsHook()

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
                <div className="space-y-4 pb-24">
                    <Tabs defaultValue="1" className="fit">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="1" >Akun</TabsTrigger>
                            <TabsTrigger value="2" >Ganti Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="1">
                            <Formik initialValues={{
                                firstNames: getDataUser?.firstName || '',
                                lastNames: getDataUser?.lastName || '',
                                emails: getDataUser?.email || '',
                                phoneNumbers: getDataUser?.phoneNumber || '',
                                img: null
                            }} validationSchema={userAccountValidationMobileSchema} onSubmit={(values) => {
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
                                        disabledSubmitButton={isPendingUpdate} getData={getDataUser}
                                        handleDeleteProfilePicture={handleDeleteProfilePicture}
                                        profilePict={profilePict} setFieldValue={setFieldValue}
                                        setTempProfilePict={setTempProfilePict} tempProfilePict={tempProfilePict} />
                                )}
                            </Formik>
                        </TabsContent>
                        <TabsContent value="2">
                            {getDataUser?.isGooglePasswordChange ?
                                <Formik initialValues={{
                                    password: '',
                                    confirmPassword: ''
                                }} validationSchema={userGoogleChangePasswordValidationSchema}
                                    onSubmit={(values, { resetForm }) => handleChangePasswordGoogleRegister({ password: values?.password }, {
                                        onSuccess: () => { resetForm() }
                                    })}>

                                    <Form className='w-full'>
                                        <div className="w-full flex flex-col gap-2 py-2">
                                            <label htmlFor="password" className="font-semibold">Password baru</label>
                                            <div className='flex w-full relative'>
                                                <Field name='password' type={passwordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                                                <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={togglePasswordVisibility}>
                                                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                                </span>
                                                <ErrorMessage component='div' className='text-red-600 absolute text-sm right-3 top-[-25px]' name='password' />
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col gap-2 py-2">
                                            <label htmlFor="confirmPassword" className="font-semibold">Ulangi password baru</label>
                                            <div className='flex w-full relative'>
                                                <Field name='confirmPassword' type={confirmPasswordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                                                <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={toggleConfirmPasswordVisibility}>
                                                    {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                                                </span>
                                                <ErrorMessage component='div' className='text-red-600 absolute text-sm right-3 top-[-25px]' name='confirmPassword' />
                                            </div>
                                        </div>
                                        <div className='py-2'>
                                            <ButtonCustom disabled={isPendingChangePasswordGoogleRegister || isDisableSucces} rounded='rounded-2xl' btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
                                        </div>
                                    </Form>
                                </Formik>
                                :
                                <Formik initialValues={{
                                    existingPassword: '',
                                    password: '',
                                    confirmPassword: ''
                                }} validationSchema={userChangePasswordValidationSchema}
                                    onSubmit={(values, { resetForm }) => handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password }, {
                                        onSuccess: () => { resetForm() }
                                    })}>
                                    <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                        confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                        isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                        toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                                </Formik>
                            }
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Pengaturan'>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="Pengaturan tabs">
                            <Tab label="Akun" value="1" />
                            <Tab label="Ganti Password" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" className="w-full p-6 bg-gray-50 rounded-xl">
                        <Formik initialValues={{
                            firstName: getDataUser?.firstName || '',
                            lastName: getDataUser?.lastName || '',
                            email: getDataUser?.email || '',
                            phoneNumber: getDataUser?.phoneNumber || '',
                            images: null
                        }} validationSchema={userAccountValidationSchema} onSubmit={(values) => {
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
                                    disabledSubmitButton={isPendingUpdate} getData={getDataUser}
                                    handleDeleteProfilePicture={handleDeleteProfilePicture}
                                    profilePict={profilePict} setFieldValue={setFieldValue}
                                    setTempProfilePict={setTempProfilePict} tempProfilePict={tempProfilePict} />
                            )}
                        </Formik>
                    </TabPanel>
                    {getDataUser?.isGooglePasswordChange ?
                        <TabPanel value="2" className="w-full p-6 bg-gray-50 rounded-xl">
                            <Formik initialValues={{
                                password: '',
                                confirmPassword: ''
                            }} validationSchema={userGoogleChangePasswordValidationSchema}
                                onSubmit={(values, { resetForm }) => handleChangePasswordGoogleRegister({ password: values?.password }, {
                                    onSuccess: () => { resetForm() }
                                })}>
                                <Form className='w-full'>
                                    <div className="w-full flex flex-col gap-2 py-2">
                                        <label htmlFor="password" className="font-semibold">Password baru</label>
                                        <div className='flex w-full relative'>
                                            <Field name='password' type={passwordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                                            <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={togglePasswordVisibility}>
                                                {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                            <ErrorMessage component='div' className='text-red-600 absolute text-sm right-3 top-[-25px]' name='password' />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2 py-2">
                                        <label htmlFor="confirmPassword" className="font-semibold">Ulangi password baru</label>
                                        <div className='flex w-full relative'>
                                            <Field name='confirmPassword' type={confirmPasswordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                                            <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={toggleConfirmPasswordVisibility}>
                                                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                            <ErrorMessage component='div' className='text-red-600 absolute text-sm right-3 top-[-25px]' name='confirmPassword' />
                                        </div>
                                    </div>
                                    <div className='py-2'>
                                        <ButtonCustom disabled={isPendingChangePasswordGoogleRegister || isDisableSucces} rounded='rounded-2xl' btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
                                    </div>
                                </Form>
                            </Formik>
                        </TabPanel>
                        :
                        <TabPanel value="2" className="w-full p-6 bg-gray-50 rounded-xl">
                            <Formik initialValues={{
                                existingPassword: '',
                                password: '',
                                confirmPassword: ''
                            }} validationSchema={userChangePasswordValidationSchema}
                                onSubmit={(values, { resetForm }) => handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password }, {
                                    onSuccess: () => { resetForm() }
                                })}>
                                <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                    confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                    isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                    toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                            </Formik>
                        </TabPanel>
                    }
                </TabContext>
            </ContentWebLayout>
        </>
    );
}