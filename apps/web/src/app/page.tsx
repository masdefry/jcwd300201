'use client'

import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { locationStore } from "@/zustand/locationStore";
import Image from "next/image";
import axios from "axios";
import ButtonCustom from "@/components/core/button";

export default function Home() {
  const setLocationUser = locationStore((state) => state?.setLocationUser)
  const latitude = locationStore((state) => state?.latitude)
  const longitude = locationStore((state) => state?.longitude)
  const [dataUser, setDataUser] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 10000,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationUser({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude
          })

          console.log("location>>", position);
        },
        (error) => {
          console.log("??", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [coords, setLocationUser])

  useEffect(() => {
    const getLocation = async (): Promise<void> => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude?.toString()}&lon=${longitude?.toString()}&format=json`)
        setDataUser(response?.data?.display_name)

      } catch (error) {
        console.log(error)
      }
    }
    if (latitude && longitude) {
      getLocation()
    }

  }, [latitude, longitude])

  const imageCarousell = [
    '/images/New Project (1).jpg',
    'https://img.okezone.com/content/2022/03/16/12/2562573/ini-tips-mencuci-dengan-mesin-cuci-yang-benar-dan-hemat-XjnK5p6qex.jpg'
  ]

  const captionCarousell = []

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIdx) => (prevIdx + 1) % imageCarousell?.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="w-full h-fit">

      {/* Mobile Section */}
      <section className="w-full max-w-[765px] md:hidden flex bg-gradient-to-tr from-black to-purple-900 h-screen"></section>

      {/* Web Section */}
      <section className="w-full h-fit py-5 md:flex flex-col hidden">

        {/* Hero */}
        <div className="w-full h-[80vh] bg-neutral-500 my-2 relative">
          <Image
            width={2000}
            height={2000}
            src={imageCarousell[currentIndex]}
            alt="hero"
            className="w-full h-[80vh] object-cover"
          // https://img.freepik.com/premium-photo/high-angle-view-pink-shoes-blue-background_1048944-7110164.jpg?w=826
          />
          <div className="absolute top-20 right-20">
            <div className="">
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                WE DO
              </h1>
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                LAUNDRY
              </h1>
              <h1 className="text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
                FOR YOU
              </h1>
            </div>
            <div className="flex gap-2 items-center mt-4">
              <p className="text-lg text-white font-medium">"Laundry made easy, just for you."</p>
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">O R D E R H E R E</ButtonCustom>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-fit flex my-2">
          <div className="w-full lg:w-1/2 h-96 bg-white flex flex-col justify-center px-10 py-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">CLEAN & CLICK</h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Nikmati layanan laundry berkualitas dengan perhatian khusus pada setiap cucian. Kami memastikan pakaian Anda bersih, wangi, dan terawat dengan proses yang cepat dan efisien.
            </p>
            <div className="py-5">
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">CUCI GA?</ButtonCustom>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-96 bg-neutral-500 relative">
            <Image
              width={2000}
              height={2000}
              src="https://img.okezone.com/content/2022/03/16/12/2562573/ini-tips-mencuci-dengan-mesin-cuci-yang-benar-dan-hemat-XjnK5p6qex.jpg"
              alt="hero"
              className="w-full h-96 object-cover object-top"
            />
            <span className="absolute h-96 bg-white rounded-r-full w-20 top-0"></span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-fit flex my-2">
          <div className="w-full h-96 bg-cyan-300"></div>
          <div className="w-full h-96 flex flex-col gap-2">
            <div className="w-full h-full bg-green-500"></div>
            <div className="w-full h-full bg-pink-800"></div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-fit flex my-2">
          <div className="w-full h-[80vh] bg-indigo-600"></div>
        </div>
      </section>
    </main>
  )
}
