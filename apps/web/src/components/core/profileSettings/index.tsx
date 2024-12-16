import { Field, Form } from "formik"
import Image from "next/image"
import { ConfirmAlert } from "../confirmAlert"
import ButtonCustom from "../button"
import { FaTrash } from "react-icons/fa6"

export default function ProfileSettings({ tempProfilePict, getData, profilePict, isDisabledSucces, disabledProfilePhoto, disabledSubmitButton, setFieldValue, setTempProfilePict, handleDeleteProfilePicture }: any) {
    return (
        <Form className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-xl">Foto Profile</h1>
            </div>
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex gap-6 items-center">
                    {tempProfilePict ?
                        <Image
                            height={100}
                            width={100}
                            alt="profile"
                            src={tempProfilePict}
                            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
                        /> :
                        <Image
                            height={100}
                            width={100}
                            alt="profile"
                            src={getData?.profilePicture?.includes('https://') ? getData?.profilePicture : `http://localhost:5000/api/src/public/images/${getData?.profilePicture}` || profilePict}
                            className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
                        />}
                    <div className='w-full justify-between flex'>
                        <div className="flex items-center gap-4">
                            <label htmlFor="images" className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium text-sm rounded-xl">
                                {tempProfilePict ? '1 foto terpilih' : "Pilih foto"}
                                <input onChange={(e: any) => {
                                    const file = e?.currentTarget?.files[0]

                                    setFieldValue('images', e?.currentTarget.files[0])
                                    setTempProfilePict(URL?.createObjectURL(file))
                                }} id="images" type="file" accept="image/*" className="hidden" />
                            </label>
                            {tempProfilePict && (
                                <div className='flex items-center gap-2'>
                                    <FaTrash className='text-sm text-red-500' />
                                    <span onClick={() => {
                                        setFieldValue('images', null)
                                        setTempProfilePict('')
                                    }} className="cursor-pointer text-red-500">Remove</span>
                                </div>
                            )}
                            {!tempProfilePict && (
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-neutral-500 font-medium'>JPG/PNG, 3MB Max.</h1>
                                </div>
                            )}
                        </div>
                        {getData?.profilePicture !== profilePict && (
                            <ConfirmAlert type='button' caption='menghapus foto profil' onClick={() => handleDeleteProfilePicture()} description='Menghapus foto profil akan menghilangkan gambar yang saat ini digunakan untuk akun Anda. Apakah Anda ingin melanjutkan?'>
                                <button type='button' disabled={disabledProfilePhoto} className='text-red-500 hover:text-red-600 flex items-center gap-1'><FaTrash className='text-sm text-red-500' /> Hapus Foto Profile</button>
                            </ConfirmAlert>
                        )}
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
            <ButtonCustom rounded='rounded-2xl' disabled={disabledSubmitButton || isDisabledSucces} btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
        </Form>
    )
}