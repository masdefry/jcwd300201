'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Image from 'next/image';
import authStore from '@/zustand/authstore';
import { Field, Form, Formik } from 'formik';
import ButtonCustom from '@/components/core/button';
import { FaTrash } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import { instance } from '@/utils/axiosInstance';
import { toast } from '@/components/hooks/use-toast';
import { ConfirmAlert } from '@/components/core/confirmAlert';

const profilePict = process.env.NEXT_PUBLIC_PHOTO_PROFILE || ''
export default function Page() {
    const token = authStore((state) => state?.token)
    const [value, setValue] = React.useState('1')
    const [tempProfilePict, setTempProfilePict] = React.useState('')
    const profilePicture = authStore((state) => state?.profilePicture)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    }

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

    const { mutate: handleUpdateProfile } = useMutation({
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

            window.location.reload()
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

    const { mutate: handleDeleteProfilePicture } = useMutation({
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

            window.location.reload()
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

    if (isFetching) return <div></div>

    return (
        <>

            {/* web ssi */}
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
                                    <Tab label="Notif" value="3" />
                                </TabList>
                            </Box>
                            <TabPanel value="1" className="w-full p-6 bg-gray-50 rounded-xl">
                                <Formik
                                    initialValues={{
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

                                        if (values?.images) {
                                            fd.append('images', values?.images)
                                        }

                                        handleUpdateProfile(fd)
                                    }}>
                                    {({ setFieldValue, values }) => (
                                        <Form className="w-full">
                                            <div className="flex justify-between items-center mb-4">
                                                <h1 className="font-bold text-xl">Foto Profile</h1>
                                            </div>
                                            <div className="flex flex-col gap-4 mb-6">
                                                <div className="flex gap-6 items-center">
                                                    <Image
                                                        height={100}
                                                        width={100}
                                                        alt="profile"
                                                        src={getDataWorker?.profilePicture?.includes('https://') ? getDataWorker?.profilePicture : `http://localhost:5000/api/src/public/images/${getDataWorker?.profilePicture}` || profilePict}
                                                        className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
                                                    />
                                                    <div className='w-full justify-between flex'>
                                                        <div className="flex items-center gap-4">
                                                            <label htmlFor="images" className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium text-sm rounded-xl">
                                                                {tempProfilePict ? tempProfilePict : "Pilih foto"}
                                                                <input onChange={(e: any) => {
                                                                    setFieldValue('images', e?.currentTarget.files[0])
                                                                    setTempProfilePict(e?.target?.value)
                                                                }} id="images" type="file" accept="image/*" className="hidden" />
                                                            </label>
                                                            {tempProfilePict && (
                                                                <div className='flex items-center gap-2'>
                                                                    <FaTrash className='text-sm text-red-500' />
                                                                    <span onClick={() => setTempProfilePict('')} className="cursor-pointer text-red-500">Remove</span>
                                                                </div>
                                                            )}
                                                            {!tempProfilePict && (
                                                                <div className='flex items-center gap-2'>
                                                                    <h1 className='text-neutral-500 font-medium'>JPG/PNG, 3MB Max.</h1>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ConfirmAlert type='button' caption='menghapus foto profil' onClick={() => handleDeleteProfilePicture()} description='Menghapus foto profil akan menghilangkan gambar yang saat ini digunakan untuk akun Anda. Apakah Anda ingin melanjutkan?'>
                                                            <button type='button' className='text-red-500 hover:text-red-600 flex items-center gap-1'><FaTrash className='text-sm text-red-500' /> Hapus Foto Profile</button>
                                                        </ConfirmAlert>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full flex gap-4 mb-6">
                                                <div className="w-full flex flex-col gap-2">
                                                    <label htmlFor="firstName" className="font-semibold">Nama Depan</label>
                                                    <Field name='firstName' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nama depan..' />
                                                </div>
                                                <div className="w-full flex flex-col gap-2">
                                                    <label htmlFor="lastName" className="font-semibold">Nama Belakang</label>
                                                    <Field name='lastName' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nama belakang..' />
                                                </div>
                                            </div>

                                            <div className="w-full flex gap-4 mb-6">
                                                <div className="w-full flex flex-col gap-2">
                                                    <label htmlFor="email" className="font-semibold">Email</label>
                                                    <Field name='email' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Email..' />
                                                </div>
                                                <div className="w-full flex flex-col gap-2">
                                                    <label htmlFor="phoneNumber" className="font-semibold">Nomor Telepon</label>
                                                    <Field name='phoneNumber' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nomor telepon..' />
                                                </div>
                                            </div>
                                            <ButtonCustom rounded='rounded-2xl' btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
                                        </Form>
                                    )}
                                </Formik>
                            </TabPanel>
                            <TabPanel value="2">
                                <h2 className="font-bold text-xl">Change Password</h2>
                                <p className="text-sm">Formulir untuk mengganti password Anda akan ditampilkan di sini.</p>
                            </TabPanel>
                            <TabPanel value="3">
                                <h2 className="font-bold text-xl">Notif</h2>
                                <p className="text-sm">Pengaturan notifikasi Anda dapat diatur di sini.</p>
                            </TabPanel>
                        </TabContext>
                    </div>
                </section>
            </main>
        </>
    );
}
