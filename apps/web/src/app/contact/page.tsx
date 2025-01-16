import SendMessageComponent from '@/features/contact/components/actionSendMessage';
import CaptionComponent from '@/features/contact/components/captionComponent';

export default function Page() {
    return (
        <main className="flex w-full bg-white pt-[120px] md:pt-[90px] py-0 md:pb-0 pb-20 md:py-10">
            <section className="flex w-full items-center px-10 py-3 gap-2">
                <div className="flex w-full flex-col justify-center pr-5">
                    <h1 className="mb-6 text-2xl font-bold text-gray-800">Formulir Kontak</h1>
                    <SendMessageComponent />
                </div>
                <CaptionComponent />
            </section>
        </main>
    );
}
