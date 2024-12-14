'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Formik } from 'formik';
import * as Yup from 'yup'
import ProfileSettings from '@/components/core/profileSettings';
import ChangePassword from '@/components/core/changePassword';
import { useAdminOutletSettingsHooks } from '@/features/adminOutlet/hooks/useAdminOutletSettingsHooks';

const profilePict = process.env.NEXT_PUBLIC_PHOTO_PROFILE || ''
export default function Page() {
    const { token, value, tempProfilePict, setTempProfilePict, oldPasswordVisible,
        passwordVisible, confirmPasswordVisible, handleChange, togglePasswordVisibility,
        toggleOldPasswordVisibility, toggleConfirmPasswordVisibility, getDataWorker, isFetching,
        handleUpdateProfile, isPendingUpdate, handleDeleteProfilePicture, isPendingDelete,
        handleChangePassword, isPendingChangePassword, isDisableSucces, isChangePassword } = useAdminOutletSettingsHooks()

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

            {/* web sesi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Pengaturan</h1>
                        </div>

                        {/* Tabs */}
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
                                }}
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

                                        // profile settings
                                        <ProfileSettings disabledProfilePhoto={isPendingDelete} isDisabledSucces={isDisableSucces}
                                            disabledSubmitButton={isPendingUpdate} getDataWorker={getDataWorker}
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
                                    validationSchema={Yup.object().shape({
                                        existingPassword: Yup.string().required('Password lama harus diisi'),
                                        password: Yup.string().required('Password baru harus diisi'),
                                        confirmPassword: Yup.string().required('Konfirmasi password harus diisi').oneOf([Yup.ref('password')], 'Konfirmasi password tidak cocok')
                                    })}
                                    onSubmit={(values) => {
                                        handleChangePassword({ existingPassword: values?.existingPassword, password: values?.password })
                                        console.log(values)
                                    }}>

                                    {/* change password setting */}
                                    <ChangePassword togglePasswordVisibility={togglePasswordVisibility} isDisableSucces={isChangePassword}
                                        confirmPasswordVisible={confirmPasswordVisible} oldPasswordVisible={oldPasswordVisible}
                                        isPendingChangePassword={isPendingChangePassword} passwordVisible={passwordVisible}
                                        toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility} toggleOldPasswordVisibility={toggleOldPasswordVisibility} />
                                </Formik>
                            </TabPanel>
                        </TabContext>
                    </div>
                </section>
            </main>
        </>
    );
}
