import Image from "next/image";

export default function NotFound() {
    return (
        <main className="w-full h-screen justify-center items-center flex lg:px-32">
            <section className="w-full h-full bg-white flex justify-center items-center relative">
                <div className="w-full h-full lg:w-[75%] lg:h-[80%]">
                    <Image
                        width={500}
                        height={500}
                        alt="foto"
                        src={'https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif'}
                        className="w-full object-cover h-full object-bottom"
                    />
                </div>
                <div className="absolute md:block hidden md:bottom-5 lg:bottom-20 z-10 text-center">
                    <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-red-500">
                        404 <span className="font-normal">Page Not Found!</span>
                    </h1>
                    <p className="text-sm md:text-lg lg:text-2xl text-gray-700 mt-4">
                        Oops! It seems like the page you&apos;re looking for does&apos;nt exist.
                    </p>
                    <p className="text-xs md:text-base lg:text-lg text-gray-500 mt-2">
                        The link might be broken, or the page may have been removed.
                        Please check the URL or return to the homepage.
                    </p>
                </div>
            </section>
        </main>
    );
}