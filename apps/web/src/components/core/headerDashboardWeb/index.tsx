import Image from "next/image"
import { FaStore } from "react-icons/fa6"

export default function HeaderDashboardWeb({ isDayArr, isDay, isDate, name, storeName, message }: HeaderDashboardWebProps) {
    return (
        <div className="w-full rounded-xl h-full flex items-center bg-orange-500 p-5">
            <div className="w-full h-fit">
                <div className="w-fit h-fit pb-5">
                    <h1 className='font-bold border-b text-xl text-white pb-2'>Welcome, {name && name?.length > 10 ? name?.slice(0, 10) : name || 'Admin'}!</h1>
                </div>
                <div className="w-full">
                    <p className="text-white">{message}</p>
                    <p className="text-white pt-2">{isDayArr[isDay]} {isDate || '00/00/0000'}</p>
                    <p className="text-white pt-2 flex gap-2 items-center"><span><FaStore className='text-lg' /></span> {storeName || 'CNC'}</p>
                </div>
            </div>
            <div className="w-full h-full items-center flex justify-end">
                <Image
                    className="h-[80%] w-fit"
                    width={500}
                    height={500}
                    loading="lazy"
                    alt="logo"
                    src={'/images/charr.png'}
                />
            </div>
        </div>
    )
}