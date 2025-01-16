'use client'

import React from "react";
import HeroSection from "@/components/core/heroSection";
import HeroSectionMobile from "../components/core/heroSectionMobile";
import { useLandingHooks } from "@/features/landing/hooks/useLandingHooks";
import LayananComponent from "@/features/landing/components/layanan";
import PelangganComponent from "@/features/landing/components/pelanggan";
import MengapaKamiComponent from "@/features/landing/components/mengapaKami";
import TimProfessionalComponent from "@/features/landing/components/tim";
import NavigationSection from "@/features/landing/components/navigationSection";

export default function Home() {
  const { teamContent,
    boxContent,
    productArr,
    testimonialData } = useLandingHooks()
  return (
    <main className="w-full h-fit pt-0 pb-28 md:pb-0 md:pt-[62px]">
      <section className="w-full h-fit pt-0 md:pt-5 md:flex flex-col">
        <HeroSection />
        <HeroSectionMobile />
        <LayananComponent productArr={productArr} />
        <PelangganComponent testimonialData={testimonialData} />
        <MengapaKamiComponent boxContent={boxContent} />
        <TimProfessionalComponent teamContent={teamContent} />
        <NavigationSection />
      </section>
    </main >
  )
}
