'use client'

import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { locationStore } from "@/zustand/locationStore";
import Image from "next/image";
import axios from "axios";
import ButtonCustom from "@/components/core/button";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa6";
import { FaHandsWash, FaTshirt } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { useRouter } from "next/navigation";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isFade, setIsFade] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { ref: clickCleanRef, inView: clickCleanTextSection } = useInView()
  const { ref: laundryCaptionRef, inView: laundryCaptionInView } = useInView()
  const { ref: imageLaundryCaptionRef, inView: imageCaptionInView } = useInView()
  const { ref: whyUsRef, inView: whyUsInView } = useInView()
  const { ref: deliveryRef, inView: deliveryInView } = useInView()

  const teamContent = [
    { img: '/images/ceo.png', name: 'Andi Setiawan', position: 'CEO' },
    { img: '/images/manager.png', name: 'Budi Santoso', position: 'Manager' },
    { img: '/images/assisten.png', name: 'Rina Dewi', position: 'Asisten Manager' },
    { img: '/images/worker.png', name: 'Agus Pratama', position: 'Akuntan' },
    { img: '/images/admin-outlet.png', name: 'Hani Hanifah', position: 'Admin Outlet' },
    { img: '/images/petugas-pencuci.png', name: 'Farel Putra', position: 'Petugas Pencuci' },
    { img: '/images/ironing-w.png', name: 'Indri', position: 'Petugas Setrika' },
    { img: '/images/kurir.png', name: 'Miftah', position: 'Petugas Pengantar' },
  ]

  const imageCarousell = [
    '/images/people.png',
    '/images/people-new.png'
  ]

  const productArr = [
    { img: '/images/wash.jpg', caption: 'Layanan Mencuci' },
    { img: '/images/ironing.jpg', caption: 'Layanan Setrika' },
    { img: 'https://img.okezone.com/content/2022/03/16/12/2562573/ini-tips-mencuci-dengan-mesin-cuci-yang-benar-dan-hemat-XjnK5p6qex.jpg', caption: 'Layanan Mencuci dan Setrika' },
    { img: '/images/laundry-img.webp', caption: 'Layanan Mencuci dan Setrika' },
    { img: '/images/wash.jpg', caption: 'Layanan Mencuci' },
    { img: '/images/ironing.jpg', caption: 'Layanan Setrika' },
  ]

  const testimonialData = [
    {
      id: 1,
      name: 'Asep Surasep',
      position: 'CEO, PT YAOP',
      testimonial: 'Layanan Clean&Click sangat luar biasa. Laundry selalu bersih, dan pengirimannya sangat cepat. Sangat saya rekomendasikan!',
      imageSrc: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Imas Suningsih',
      position: 'Manajer, PT YAHUT',
      testimonial: 'Kami telah menggunakan Clean&Click untuk semua kebutuhan laundry kantor kami. Layanan profesional dan pengiriman tepat waktu mereka tak tertandingi.',
      imageSrc: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Sabni Oke',
      position: 'Pelanggan, Pengusaha',
      testimonial: 'Kenyamanan layanan jemput dan antar sangat luar biasa. Pakaian saya selalu ditangani dengan hati-hati. Clean&Click adalah layanan laundry terbaik!',
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

  const processSteps = [{ icon: <FaCalendar />, title: "Proses Pemesanan", description: "Ajukan permintaan layanan dan jadwalkan waktu pengambilan." },
  { icon: <FaTshirt />, title: "Pengambilan", description: "Kami mengambil barang Anda di lokasi yang telah ditentukan." },
  { icon: <FaHandsWash />, title: "Proses Pembersihan", description: "Barang Anda dicuci dengan teknologi modern dan higienis." },
  { icon: <GrDeliver />, title: "Proses Antar", description: "Barang bersih diantarkan kembali ke lokasi Anda tepat waktu." }]

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        setIsFade(true);

        setTimeout(() => {
          setCurrentIndex((prevIdx) => (prevIdx + 1) % imageCarousell?.length);
          setIsFade(false);
        }, 1000);
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [imageCarousell?.length, currentIndex, isLoading])
  const handleImageLoad = () => setIsLoading(false)

  return (
    <main className="w-full h-fit pt-0 md:pt-[62px]">
      <section className="w-full h-fit pt-5 md:flex flex-col">
        <div className="w-full h-[50vh] lg:h-fit mt-1 relative bg-gradient-to-r from-sky-100 via-orange-100 to-white">
          <Image
            width={2000}
            height={2000}
            src={imageCarousell[currentIndex]}
            onLoad={handleImageLoad}
            alt="hero"
            className={`w-full h-[50vh] ${isFade ? 'opacity-0' : 'opacity-100'} lg:h-fit object-left lg:object-top object-cover transition-opacity duration-1000 ease-in-out`}
          />
          <div className={`absolute inset-0 w-full items-center ${currentIndex === 0 ? 'justify-start' : 'justify-end'} ${isFade ? 'opacity-0' : 'opacity-100'} right-0 flex transition-opacity duration-1000 ease-in-out`}>
            <div className={`lg:w-1/2 px-10 text-center ${currentIndex === 0 ? 'lg:text-left' : 'lg:text-left'}`}>
              <div className="w-full flex flex-col gap-2">
                {currentIndex === 0 ? (
                  <>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">Permudah Semua dengan</h1>
                    <div className="flex gap-2">
                      <span className="text-blue-500 text-3xl md:text-5xl font-extrabold leading-tight">Clean&Click</span>
                      <span className="text-orange-500 text-3xl md:text-5xl font-extrabold leading-tight">Laundry</span>
                    </div>
                    <p className="text-gray-600 mt-4 text-lg">Kami telah berkomitmen untuk memberikan layanan pelanggan yang luar biasa dan layanan cuci kering serta laundry berkualitas tinggi.</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight">Cepat dan Tepat dengan</h1>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-blue-500 leading-tight">Clean&Click <span className="text-orange-500">Delivery</span></h1>
                    <p className="text-gray-600 mt-4 text-lg">Kami memastikan pakaian Anda sampai di depan pintu dengan cepat dan dalam kondisi sempurna. Hemat waktu Anda bersama kami!</p>
                  </>
                )}
              </div>
              <div className={`flex gap-4 mt-6 justify-center items-center ${currentIndex === 0 ? 'lg:justify-start' : 'lg:justify-start'}`}>
                <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-full" btnColor="bg-orange-500 hover:bg-orange-500">Pelajari Selengkapnya</ButtonCustom>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-xl">{'⭐'.repeat(5)}</span>
                  <p className="text-gray-600 font-medium">4.8 Total Ulasan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-fit py-10 bg-white">
          <div className="w-full h-fit flex justify-center">
            <h1 className="text-4xl font-bold max-w-[60%] text-neutral-700 text-center border-b-[1px] border-neutral-500 pb-5">Kami hadir untuk memberikan solusi cepat dan praktis dengan <span className="text-orange-500">layanan kami</span></h1>
          </div>
          <div className="w-full py-20 h-fit flex">
            <div className="grid grid-cols-3 w-full gap-2 px-10">
              {productArr?.map((prod, i) => (
                <Link href='/' key={i} className="w-full lg:h-[250px] rounded-2xl relative">
                  <div className="w-full lg:h-60">
                    <Image
                      src={prod?.img}
                      width={500}
                      height={500}
                      alt="wash"
                      className="rounded-2xl w-full lg:h-[250px] object-cover"
                    />
                  </div>
                  <div className="absolute flex bottom-5 py-4 px-2 inset-0 items-end">
                    <div className="py-2 px-4 bg-white">
                      <h1 className="font-semibold text-sm text-neutral-500">{prod?.caption}</h1>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-fit flex">
          <div className="w-full h-fit text-black flex flex-col items-center pb-20 pt-20 text-center bg-gradient-to-r from-slate-100 via-orange-50 to-white px-10">
            <h2 className="text-4xl font-bold mb-2">Pelanggan Kami</h2>
            <p className="text-lg text-gray-600 mb-14 max-w-[80%]">Kami bangga memiliki berbagai pelanggan yang puas dengan layanan kami. Berikut adalah beberapa testimoni dari mereka yang telah merasakan kualitas terbaik dari produk dan layanan kami.</p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonialData.map((item) => (
                <div key={item.id}
                  className="w-full h-fit bg-white shadow-md rounded-lg p-6 transform hover:scale-105 transition-all duration-300">
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

        <div className='w-full h-fit py-32 bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col gap-10'>
          <div className='w-full flex justify-center items-center text-center pb-10'>
            <h1 className="font-extrabold text-4xl sm:text-5xl text-neutral-700">
              Proses Kerja <span className="text-orange-500">Clean&Click</span>
            </h1>
          </div>
          <div className="flex w-full h-fit justify-center">
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
              {processSteps.map((step, i) => (
                <div key={i} className="w-full flex flex-col justify-center h-fit space-y-3">
                  <div className="w-full justify-center items-center flex h-fit">
                    <div className="border-[3px] border-dashed border-orange-500 h-fit w-fit p-1 rounded-full">
                      <div className="h-32 w-32 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg hover:scale-105 transition-transform duration-300">
                        <span className="text-5xl text-white">{step.icon}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center max-w-52">
                    <h1 className="text-lg font-bold text-neutral-800">{step.title}</h1>
                    <p className="text-sm text-neutral-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full h-fit flex'>
          <div className="w-full h-fit py-44 text-black flex flex-col items-center text-center bg-white px-10 lg:px-60">
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
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col w-full px-10 gap-2 h-fit bg-white">
          <section className="w-full h-fit py-10 flex flex-col">
            <div className="w-full p-5">
              <h1 className="text-xl text-orange-500 font-sans font-semibold">Tim Kami</h1>
            </div>
            <div className="w-1/2 px-5">
              <h1 className="text-2xl font-bold text-neutral-700">Kenali Tim Profesional Kami yang Berdedikasi untuk Layanan Laundry Terbaik</h1>
            </div>

            <div className="w-full h-fit flex justify-center items-center">
              <div className="grid grid-cols-4 w-full gap-2 px-5 py-10">
                {teamContent.map((team, i) => (
                  <div key={i} className="h-[330px] relative bg-blue-300 w-full rounded-2xl">
                    <Image width={500} height={500} alt="our-team" src={team?.img} className="w-full shadow-md h-[330px] rounded-2xl object-cover object-top" />
                    <div className="p-4 absolute inset-0 flex flex-col items-end bottom-0 w-full justify-end">
                      <h3 className="text-lg font-semibold text-neutral-700 bg-neutral-50 px-2">{team?.name}</h3>
                      <p className="text-sm text-neutral-600 bg-neutral-50 px-2">{team?.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
