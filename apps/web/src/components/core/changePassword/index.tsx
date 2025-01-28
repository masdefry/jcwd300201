import { useFormikContext, ErrorMessage, Field, Form } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import ButtonCustom from "../buttonCustom";

export default function ChangePassword({ oldPasswordVisible, passwordVisible, toggleConfirmPasswordVisibility,
    togglePasswordVisibility, toggleOldPasswordVisibility, isDisableSucces, confirmPasswordVisible, isPendingChangePassword
}: any) {
    const { values } = useFormikContext<any>()
    return (
        <Form className="w-full">
            <div className="w-full flex flex-col gap-2 py-2">
                <label htmlFor="existingPassword" className="font-semibold">Password lama</label>
                <div className='flex w-full relative'>
                    <Field name='existingPassword' type={oldPasswordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password lama..' />
                    <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={toggleOldPasswordVisibility}>
                        {oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 top-[-25px]' name='existingPassword' />
                </div>
            </div>
            <div className="w-full flex flex-col gap-2 py-2">
                <label htmlFor="password" className="font-semibold">Password baru</label>
                <div className='flex w-full relative'>
                    <Field name='password' type={passwordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                    <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 top-[-25px]' name='password' />
                </div>
            </div>
            <div className="w-full flex flex-col gap-2 py-2">
                <label htmlFor="confirmPassword" className="font-semibold">Konfirmasi password</label>
                <div className='flex w-full relative'>
                    <Field name='confirmPassword' type={confirmPasswordVisible ? 'text' : 'password'} className='w-full border px-4 py-2 rounded-lg text-sm shadow-sm focus:outline-none focus:border-orange-500' placeholder='Masukan password baru..' />
                    <span className="absolute right-3 top-3 flex items-center cursor-pointer text-gray-500" onClick={toggleConfirmPasswordVisibility}>
                        {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                    </span>
                    <ErrorMessage component='div' className='text-red-600 absolute text-[10px] md:text-sm right-3 top-[-25px]' name='confirmPassword' />
                </div>
            </div>
            <div className='py-2'>
                <ButtonCustom disabled={isPendingChangePassword || isDisableSucces || !values.existingPassword || !values.password || !values.confirmPassword} rounded='rounded-2xl' btnColor='bg-orange-500 hover:bg-orange-500' width='w-full' type='submit'>Ubah</ButtonCustom>
            </div>
        </Form>
    );
}