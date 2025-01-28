import Image from "next/image"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa6"
import { GrMail } from "react-icons/gr"
import { IContactMobile } from "./type"

export default function ContactWeb({ message, formatDistanceToNow, messageWhatsapp, id, i }: IContactMobile) {
    return (
        <div key={i} className="w-full h-fit py-4 px-5 border rounded-2xl flex flex-col bg-white">
            <div className="w-full flex justify-between gap-2 items-center">
                <div className="flex">
                    <div className="w-12 h-12 rounded-full">
                        <Image
                            width={500}
                            height={500}
                            src={message?.User?.profilePicture?.includes('https://') ?
                                message?.User?.profilePicture :
                                `http://localhost:5000/api/src/public/images/${message?.User?.profilePicture}`}
                            alt="profil"
                            className="w-12 h-12 border-2 object-cover rounded-full"
                        />
                    </div>
                    <div className="px-2 flex items-center gap-2">
                        <h1 className="font-sans font-semibold">{message?.User?.firstName} {message?.User?.lastName}</h1>
                        <span className="text-neutral-400 w-2 h-2 bg-neutral-300 rounded-full"></span>
                        <h1 className="italic text-sm">
                            {formatDistanceToNow(new Date(message?.createdAt), { addSuffix: true, locale: id })}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2 text-sm">
                    <Link target='_blank' href={`mailto:${message?.email}?subject=${encodeURIComponent('Terimakasih talah menghubungi Clean & Click')}`} className="py-1 px-2 flex gap-1 items-center bg-orange-500 hover:bg-orange-500 text-white bg-opacity-75 rounded-full">
                        <span><GrMail /> </span><h1>Gmail</h1>
                    </Link>
                    <Link target='_blank' href={`https://wa.me/${message?.phoneNumber?.charAt(0) === '0' ? '62' + message?.phoneNumber?.slice(1) : message?.phoneNumber}?text=${encodeURIComponent(messageWhatsapp.trim())}`} className="py-1 px-2 flex gap-1 items-center bg-green-500 hover:bg-green-500 text-white bg-opacity-75 rounded-full">
                        <span><FaWhatsapp /> </span><h1>Whatsapp</h1>
                    </Link>
                </div>
            </div>
            <h1 className="pt-4 font-bold">Pesan Customer:</h1>
            <div className="py-2">
                <h1 className="text-lg text-neutral-700">{message?.textHelp}</h1>
            </div>
        </div>
    )
}