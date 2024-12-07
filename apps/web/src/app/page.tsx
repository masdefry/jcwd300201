'use client'

import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { locationStore } from "@/zustand/locationStore";
import Image from "next/image";
import axios from "axios";
import ButtonCustom from "@/components/core/button";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const latitude = locationStore((state) => state?.latitude)
  const longitude = locationStore((state) => state?.longitude)
  const [isFade, setIsFade] = useState<boolean>(false)
  const { ref: clickCleanRef, inView: clickCleanTextSection } = useInView()
  const { ref: laundryCaptionRef, inView: laundryCaptionInView } = useInView()
  const { ref: imageLaundryCaptionRef, inView: imageCaptionInView } = useInView()
  const { ref: whyUsRef, inView: whyUsInView } = useInView()
  const { ref: deliveryRef, inView: deliveryInView } = useInView()

  const imageCarousell = [
    '/images/New Project (1).jpg',
    '/images/New Project (2).jpg'
  ]

  const captionCarousell = [
    'Laundry made easy, just for you.',
    'Fresh laundry, delivered to you.'
  ]

  const captionCarousel = [
    'WE DO LAUNDRY FOR YOU',
    'FRESH & CLEAN, JUST FOR YOU'
  ]

  const testimonialData = [
    {
      id: 1,
      name: 'John Doe',
      position: 'CEO, Clean&Click',
      testimonial:
        'Clean&Clicks service has been exceptional. The laundry is always clean, and the delivery is super quick. Highly recommend!',
      imageSrc: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Manager, ABC Corp',
      testimonial:
        'Weve been using Clean&Click for all our office laundry needs. Their professional service and timely deliveries are unmatched.',
      imageSrc: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Mark Johnson',
      position: 'Client, Local Business',
      testimonial:
        'The convenience of pickup and delivery is fantastic. My clothes are always handled with care. Clean&Click is the best laundry service!',
      imageSrc: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  ];

  const whyUsData = [
    {
      id: 1,
      imageSrc: "https://static.wixstatic.com/media/d20fa7_30ca74a8eec1460587b7afd4c27c59a4~mv2.png/v1/crop/x_0,y_0,w_472,h_512/fill/w_120,h_126,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Aplikasi%20Laundry%20Mobile.png",
      altText: "Mengapa Kami 1",
      title: "Order Online",
      description: "Pesan via Website atau dapatkan promo menarik melalui Laundry Kami",
    },
    {
      id: 2,
      imageSrc: "https://static.wixstatic.com/media/d20fa7_e06ca9bf0010464d86916d9b305b2677~mv2.png",
      altText: "Mengapa Kami 2",
      title: "Professional",
      description: "Karyawan Clean&Click yang melalui pelatihan profesional dan berpengalaman",
    },
    {
      id: 3,
      imageSrc: "https://static.wixstatic.com/media/d20fa7_4982d494602b4876b42311814864b701~mv2.png/v1/fill/w_130,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/trust.png",
      altText: "Mengapa Kami 3",
      title: "Terpercaya",
      description: "Terpercaya dan bekerja sesuai SOP dalam laundry Clean&Click",
    },
  ];



  useEffect(() => {
    const interval = setInterval(() => {
      setIsFade(true)

      setTimeout(() => {
        setCurrentIndex((prevIdx) => (prevIdx + 1) % imageCarousell?.length)
        setIsFade(false)
      }, 1000)

    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="w-full h-fit pt-0 md:pt-[62px]">
      <section className="w-full h-fit py-5 md:flex flex-col">
        <div className="w-full h-[50vh] lg:h-[80vh] my-2 relative bg-white">
          <Image
            width={2000}
            height={2000}
            src={imageCarousell[currentIndex]}
            alt="hero"
            className={`w-full h-[50vh] lg:h-[80vh] object-left lg:object-center object-cover bg-white transition-opacity duration-1000 ease-in-out ${isFade ? 'opacity-0' : 'opacity-100'}`}
          />
          <div className={`absolute top-16 right-20 transition-opacity duration-1000 ease-in-out ${isFade ? 'opacity-0' : 'opacity-100'}`}>
            <div className="">
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent text-shad drop-shadow-2xl leading-tight" style={{ color: 'white', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)' }}>WE DO</h1>
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight" style={{ color: 'white', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)' }}>LAUNDRY</h1>
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight" style={{ color: 'white', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)' }}>FOR YOU</h1>
            </div>
            <div className="flex flex-col gap-2 justify-start mt-4">
              <p className="text-lg text-white font-medium" style={{ color: 'white', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.5)' }}>&quot;{captionCarousell[currentIndex]}&quot;</p>
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">O R D E R H E R E</ButtonCustom>
            </div>
          </div>
        </div>

        <div className="w-full h-fit flex flex-col lg:flex-row my-2">
          <div className="w-full lg:w-1/2 h-[80vh] bg-white flex flex-col justify-center px-10 py-6">
            <h1 className={`text-5xl font-bold text-gray-900 mb-4 transition-opacity duration-1000 ease-in-out ${clickCleanTextSection ? 'opacity-100' : 'opacity-0'}`} ref={clickCleanRef}>CLEAN & CLICK</h1>
            <p className={`text-lg text-gray-600 font-medium leading-relaxed transition-opacity duration-1000 ease-in-out ${laundryCaptionInView ? 'opacity-100' : 'opacity-0'}`} ref={laundryCaptionRef}>Nikmati layanan laundry berkualitas dengan perhatian khusus pada setiap cucian. Kami memastikan pakaian Anda bersih, wangi, dan terawat dengan proses yang cepat dan efisien.</p>
            <div className="py-5">
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">O R D E R H  E R E</ButtonCustom>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-[80vh] relative">
            <Image
              ref={imageLaundryCaptionRef}
              width={2000}
              height={2000}
              src="https://img.okezone.com/content/2022/03/16/12/2562573/ini-tips-mencuci-dengan-mesin-cuci-yang-benar-dan-hemat-XjnK5p6qex.jpg"
              alt="hero"
              className={`w-full h-[80vh] object-cover object-top transition-opacity duration-1000 ease-in-out ${imageCaptionInView ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>

        <div className='w-full h-fit flex my-2'>
          <div className="w-full h-fit py-20 text-black flex flex-col items-center text-center bg-indigo-100 px-10 lg:px-60">
            <h2 className={`text-4xl font-bold mb-14 transition-opacity duration-1000 ease-in-out ${whyUsInView ? 'opacity-100' : 'opacity-0'}`} ref={whyUsRef}>Mengapa Kami?</h2>
            <div ref={whyUsRef} className={`flex flex-col md:flex-row justify-center gap-8 transition-opacity duration-1000 ease-in-out ${whyUsInView ? 'opacity-100' : 'opacity-0'}`} >
              {whyUsData.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <div className="bg-blue-300 rounded-full p-4 mb-4">
                    <Image
                      src={item.imageSrc}
                      alt={item.altText}
                      width={200}
                      height={200}
                      className="w-16 h-16"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="w-full h-fit flex my-2 px-10 lg:px-0">
          <div className="w-full h-fit flex flex-col lg:flex-row justify-center items-center gap-5">
            <div className="w-[65vw] lg:w-[80vw] relative h-fit flex justify-center">
              <div className="w-[150px] lg:w-[250px] h-fit text-black text-center">
                <Image
                  width={1000}
                  height={1000}
                  src='/images/basic-map.png'
                  alt="delivery"
                  className="w-[150px] lg:w-[250px] h-fit object-cover animate-fade-right"

                />
              </div>
              <div className="absolute left-[30px] lg:left-[120px] bottom-0 w-[130px] lg:w-[230px] h-fit text-black text-center">
                <Image
                  width={1000}
                  height={1000}
                  src='/images/basic-map.png'
                  alt="delivery"
                  className="w-[130px] lg:w-[230px] h-fit object-cover animate-fade-right"
                />
              </div>
            </div>
            <div className="w-full h-fit">
              <div className="w-full">
                <p className={`font-semibold text-neutral-400 transition-opacity duration-1000 ease-in-out ${deliveryInView ? 'opacity-100' : 'opacity-0'}`} ref={deliveryRef}>Memberikan Layanan Terbaik</p>
                <h1 className={`transition-opacity duration-1000 ease-in-out ${deliveryInView ? 'opacity-100' : 'opacity-0'} text-2xl md:text-5xl font-extrabold text-blue-950`} ref={deliveryRef}>Layanan Pickup dan Delivery</h1>
                <p className={`transition-opacity duration-1000 ease-in-out ${deliveryInView ? 'opacity-100' : 'opacity-0'} font-semibold text-neutral-400 py-2`} ref={deliveryRef}>Nikmati kemudahan dalam mengirimkan barang dengan layanan Pickup dan Delivery kami. Cepat, aman, dan terpercaya, kami siap melayani Anda kapan saja dan di mana saja.</p>
                <div className="py-3">
                  <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">O R D E R H E R E</ButtonCustom>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-fit flex my-2">
          <div className="w-full h-fit py-20 text-black flex flex-col items-center text-center bg-neutral-100 px-10">
            <h2 className="text-4xl font-bold mb-14">Testimonial</h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonialData.map((item) => (
                <div
                  key={item.id}
                  className="w-full h-fit bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={item?.imageSrc}
                      alt={item?.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{item?.name}</h3>
                  <p className="text-lg text-gray-600 mb-4">{item?.position}</p>
                  <p className="text-gray-500">{item?.testimonial}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
