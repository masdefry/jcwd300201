'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { FaCalendar, FaRegClock, FaRocket, FaUsers } from "react-icons/fa6";
import { FaHandsWash, FaTshirt, FaUsersCog } from "react-icons/fa";
import { GrDeliver } from "react-icons/gr";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/core/heroSection";
import ButtonCustom from "@/components/core/button";
import HeroSectionMobile from "../components/core/heroSectionMobile";

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

  const boxContent = [
    { boxCaption: 'Pengalaman Bertahun-tahun di Layanan Laundry', icon: <FaRegClock /> },
    { boxCaption: 'Fokus pada Kualitas dan Kecepatan', icon: <FaRocket /> },
    { boxCaption: 'Dipercaya oleh Banyak Pelanggan', icon: <FaUsers /> },
    { boxCaption: 'Tim Profesional yang Berdedikasi', icon: <FaUsersCog /> },
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

  return (
    <main className="w-full h-fit pt-0 pb-28 md:pb-0 md:pt-[62px]">
      <section className="w-full h-fit pt-0 md:pt-5 md:flex flex-col">
        <HeroSection />
        <HeroSectionMobile />
        <div className="w-full h-fit py-5 md:py-10 mt-2 md:mt-6 bg-gradient-to-t from-sky-100 via-orange-100 to-white px-4 md:px-10 rounded-tl-full">
          <div className="flex flex-wrap justify-between items-start w-full">
            <div className="text-left space-y-4">
              <h1 className="text-orange-500 font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">Layanan Kami</h1>
              <p className="text-neutral-600 text-base md:text-lg">Temukan berbagai layanan terbaik kami yang siap membantu kebutuhan Anda.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href='/service' className="border-b-2 border-transparent text-neutral-700 font-medium hover:border-orange-500 transition-all">
                Lihat Selengkapnya
              </Link>
            </div>
          </div>
          <div className='w-full py-16 flex justify-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {productArr?.map((prod, index) => (
                <Link href='/service' key={index} className='w-full relative rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 group'>
                  <div className='w-full h-60 relative'>
                    <Image src={prod?.img} width={500} height={500}
                      alt={prod?.caption} className='w-full h-full object-cover rounded-2xl transition-opacity' />
                    <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-50 transition-opacity'></div>
                  </div>
                  <div className='absolute bottom-5 left-5 right-5 py-4 px-6 bg-neutral-300 rounded-2xl shadow-md bg-opacity-80 border-b-4 border-orange-500 group-hover:bg-opacity-90 transition-all'>
                    <h1 className='font-semibold text-sm text-neutral-700 flex items-center gap-2'>
                      <FaHandsWash className='text-xl' />
                      {prod?.caption}
                    </h1>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>


        <div className='w-full h-fit flex bg-gradient-to-b from-sky-100 via-sky-50 to-white px-4 md:px-10 pb-5'>
          <div className='w-full h-fit text-black flex flex-col items-center text-center'>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-orange-500 mb-4">Pelanggan Kami</h1>
            <p className="lg:text-lg text-gray-600 mb-14 max-w-3xl">Kami bangga memiliki berbagai pelanggan yang puas dengan layanan kami. Berikut adalah beberapa testimoni dari mereka yang telah merasakan kualitas terbaik dari produk dan layanan kami.</p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonialData.map((item) => (
                <div key={item.id} className="w-full border-b-2 border-orange-500 bg-white rounded-3xl p-8 transform hover:scale-105 transition-all duration-300 ease-in-out">
                  <div className="flex justify-center mb-6">
                    <Image
                      src={item?.imageSrc}
                      alt={item?.name}
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{item?.name}</h3>
                  <p className="text-md text-gray-600 mb-4">{item?.position}</p>
                  <p className="text-gray-500 text-sm">{item?.testimonial}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex md:flex-row flex-col w-full px-4 md:px-10 gap-2 h-fit bg-gradient-to-b from-white via-white rounded-br-full pb-10 to-orange-100">
          <section className="w-full h-fit py-10 flex flex-col text-right">
            <div className="w-full p-5">
              <h1 className="font-bold text-orange-500 text-3xl lg:text-5xl">Mengapa Kami?</h1>
            </div>
            <div className="w-full px-5">
              <h2 className="text-lg text-neutral-600">Alasan Kami Menjadi Pilihan Tepat untuk Layanan Anda</h2>
            </div>

            <div className="flex md:flex-row flex-col w-full gap-2 h-fit mt-6">
              <section className="h-fit md:w-1/2 md:block hidden w-full py-5">
                <div className="h-fit w-full bg-white space-y-2 rounded-2xl">
                  <div className="h-[350px] w-full">
                    <div className="w-full p-5">
                      <h1 className="text-xl pt-5 text-orange-500 font-sans font-semibold hidden md:block">Kami Bangga Menjadi Bagian dari Perjalanan Anda</h1>
                    </div>
                    <div className="w-full p-5">
                      <h1 className="text-xl md:text-5xl font-bold text-neutral-700">Bersama, Kami Mewujudkan Impian dengan <span className="text-orange-500">Pelayanan Terbaik dan Dedikasi</span></h1>
                    </div>
                  </div>
                  <div className="h-[250px] w-full flex items-center p-5">
                    <p className="text-neutral-600 mt-2 leading-relaxed">
                      Tim kami terdiri dari individu-individu yang berdedikasi tinggi untuk
                      memberikan pelayanan laundry terbaik. Dengan semangat profesionalisme dan kerja sama, kami terus berusaha melebihi harapan pelanggan kami.
                      Bergabunglah dengan kami untuk menikmati layanan laundry yang cepat, terpercaya, dan berkualitas tinggi.
                    </p>
                  </div>
                </div>
              </section>
              <section className="h-fit md:w-1/2 w-full py-5 space-y-2">
                <div className="h-[350px] w-full bg-white rounded-2xl">
                  <Image width={500} height={500} alt="our-team" src='/images/our-team.jpg' className="w-full h-[350px] rounded-2xl object-cover" />
                </div>
                <div className="h-[250px] md:block hidden w-full bg-white rounded-2xl p-5">
                  <div className="w-full flex justify-center items-center h-full">
                    <div className="w-full h-full grid grid-cols-2 gap-2">
                      {boxContent?.map((content, i) => (
                        <div key={i} className="h-full text-neutral-700 w-full gap-3 flex items-center p-5 bg-gradient-to-r from-neutral-200 to-white rounded-full">
                          <span className="text-base md:text-5xl">{content?.icon} </span><p className="flex items-center">{content?.boxCaption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>

        <div className="flex md:flex-row flex-col w-full px-4 md:px-10 gap-2 h-fit bg-white">
          <section className="w-full h-fit py-10 flex flex-col">
            <div className="w-full p-5">
              <h1 className="text-3xl md:text-5xl font-bold text-orange-500">Tim Profesional</h1>
            </div>
            <div className="px-5">
              <h1 className="text-lg text-neutral-700">Kenali Tim Profesional Kami yang Berdedikasi untuk Layanan Laundry Terbaik</h1>
            </div>

            <div className="w-full h-fit flex justify-center items-center">
              <div className="grid grid-cols-1 lg:grid-cols-4 w-full gap-2 px-5 py-10">
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

        <div className="w-full px-4 md:px-10 h-fit pb-5 bg-opacity-80 flex flex-col justify-center items-center">
          <div className="w-full rounded-2xl bg-blue-600 flex py-20 justify-center items-center flex-col">
            <div className="text-center pb-5">
              <h1 className="text-white text-3xl font-bold mb-2">Solusi Terbaik untuk <span className="text-white">Kebutuhan Laundry Anda</span></h1>
              <p className="text-neutral-300 text-lg">Kami menghadirkan layanan laundry berkualitas tinggi, cepat, dan terpercaya.</p>
            </div>
            <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-full" btnColor="bg-orange-500 hover:bg-orange-500 font-bold" type="button">Pesan Sekarang</ButtonCustom>
          </div>
        </div>

      </section>
    </main >
  )
}
