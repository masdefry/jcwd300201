import ContentWebLayout from "@/components/core/WebSessionContent";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { id } from 'date-fns/locale'
import { cookies } from "next/headers";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import ContactMobile from "@/features/superAdmin/components/ContactMobile";
import ContactWeb from "@/features/superAdmin/components/ContactWeb";
import { IMessage } from "./type";


const getMessageCustomer = async () => {
    const token = (await cookies()).get('__toksed')?.value
    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await response.json()

        return result
    } catch (error) {

    }
}

export default async function Contact() {
    const getData = await getMessageCustomer()
    const dataMessage = getData?.data
    const messageWhatsapp = 'Terima kasih telah menghubungi Clean & Click. Apa anda bisa bantu saya lebih lanjut?';

    if (dataMessage?.length == 0) return (
        <ContentWebLayout caption="Pesan Pelanggan">
            <div className="w-full h-full flex justify-center items-center">
                <h1>Data tidak tersedia</h1>
            </div>
        </ContentWebLayout>
    )

    return (
        <>
            <MobileSessionLayout title="Pesan Pelanggan">
                {dataMessage?.map((message: IMessage, i: number) => (
                    <ContactMobile key={i} message={message} formatDistanceToNow={formatDistanceToNow} messageWhatsapp={messageWhatsapp} id={id} i={i} />
                ))}
            </MobileSessionLayout>
            <ContentWebLayout caption="Pesan Pelanggan">
                <div className="w-full h-fit pb-4 flex flex-col gap-2">
                    {dataMessage?.map((message: IMessage, i: number) => (
                        <ContactWeb key={i} message={message} formatDistanceToNow={formatDistanceToNow} messageWhatsapp={messageWhatsapp} id={id} i={i} />
                    ))}
                </div>
            </ContentWebLayout>
        </>
    );
}