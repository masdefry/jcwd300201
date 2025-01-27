import { ErrorMessage, Field, Form } from "formik"
import Image from "next/image"
import { ConfirmAlert } from "../confirmAlertCustom"
import ButtonCustom from "../buttonCustom"
import { FaPhotoFilm, FaTrash } from "react-icons/fa6"

export default function ProfileSettingsMobile({ tempProfilePict, getData, profilePict, isDisabledSucces, disabledProfilePhoto, disabledSubmitButton, setFieldValue, setTempProfilePict, handleDeleteProfilePicture }: any) {
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
                            className="w-20 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                        /> :
                        <Image
                            height={100}
                            width={100}
                            alt="profile"
                            src={getData?.profilePicture?.includes('https://') ? getData?.profilePicture : `http://localhost:5000/api/src/public/images/${getData?.profilePicture}` || profilePict}
                            className="w-20 h-16 rounded-full object-cover border border-gray-300 shadow-sm"
                        />}
                    <div className='w-full justify-between flex items-center'>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="img" className="cursor-pointer inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium text-xs rounded-xl">
                                {tempProfilePict ? '1 foto terpilih' : <span className="flex gap-2 items-center"><FaPhotoFilm /> Pilih foto</span>}
                                <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = e?.currentTarget?.files ? e?.currentTarget?.files[0] : null;
                                    if (file) {
                                        setFieldValue('img', file);
                                        setTempProfilePict(URL?.createObjectURL(file));
                                    }
                                }} id="img" type="file" accept="image/*" className="hidden" />
                            </label>
                            {tempProfilePict && (
                                <div className='flex items-center gap-2'>
                                    <FaTrash className='text-xs text-red-500' />
                                    <span onClick={() => {
                                        setFieldValue('img', null)
                                        setTempProfilePict('')
                                    }} className="cursor-pointer text-red-500 text-xs">Remove</span>
                                </div>
                            )}
                            {!tempProfilePict && (
                                <div className='flex items-center gap-2'>
                                    <h1 className='text-neutral-500 md:text-base text-xs font-medium'>JPG/PNG/GIF, 1MB Max.</h1>
                                </div>
                            )}
                        </div>
                        {getData?.profilePicture !== profilePict && (
                            <ConfirmAlert type='button' caption='Apakah anda yakin ingin menghapus foto profil?' onClick={() => handleDeleteProfilePicture()} description='Menghapus foto profil akan menghilangkan gambar yang saat ini digunakan untuk akun Anda. Apakah Anda ingin melanjutkan?'>
                                <button type='button' disabled={disabledProfilePhoto} className='text-red-500 hover:text-red-600 text-xs flex items-center gap-1'><FaTrash className='text-xs text-red-500' /> <span className='md:block hidden'>Hapus Foto Profile</span></button>
                            </ConfirmAlert>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full flex gap-4 mb-6">
                <div className="w-full flex flex-col gap-2 relative">
                    <div className="w-full flex justify-between">
                        <label htmlFor="firstNames" className="font-semibold">Nama Depan</label>
                        <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 bottom-[-15px]' name='firstNames' />
                    </div>
                    <Field name='firstNames' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nama depan..' />
                </div>
                <div className="w-full flex flex-col gap-2 relative">
                    <div className="w-full flex justify-between">
                        <label htmlFor="lastNames" className="font-semibold">Nama Belakang</label>
                        <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 bottom-[-15px]' name='lastNames' />
                    </div>
                    <Field name='lastNames' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nama belakang..' />
                </div>
            </div>

            <div className="w-full flex gap-4 mb-6">
                <div className="w-full flex flex-col gap-2 relative">
                    <div className="w-full flex justify-between">
                        <label htmlFor="emails" className="font-semibold">Email</label>
                        <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 bottom-[-15px]' name='emails' />
                    </div>
                    <Field name='emails' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Email..' />
                </div>
                <div className="w-full flex flex-col gap-2 relative">
                    <div className="w-full flex justify-between">
                        <label htmlFor="phoneNumbers" className="font-semibold">Nomor Telepon</label>
                        <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 bottom-[-15px]' name='phoneNumbers' />
                    </div>
                    <Field name='phoneNumbers' type="text" className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Nomor telepon..' />
                </div>
            </div>
            <ButtonCustom rounded='rounded-2xl' disabled={disabledSubmitButton || isDisabledSucces} btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
        </Form>
    )
}