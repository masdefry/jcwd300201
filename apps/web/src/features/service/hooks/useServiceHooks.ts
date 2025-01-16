'use client'

import { useRouter } from "next/navigation";

export const useServiceHooks = () => {
    const router = useRouter()
    const services = [
        {
            title: "Dry Cleaning",
            description: "Layanan dry cleaning profesional untuk kain halus dan pakaian khusus.",
            button: "Pelajari Lebih Lanjut"
        },
        {
            title: "Cuci & Lipat",
            description: "Layanan pencucian dan pelipatan yang praktis untuk kebutuhan sehari-hari Anda.",
            button: "Pelajari Lebih Lanjut"
        },
        {
            title: "Setrika",
            description: "Dapatkan pakaian rapi tanpa kerutan dengan layanan setrika profesional kami.",
            button: "Pelajari Lebih Lanjut"
        }
    ];

    const productArr = [
        { img: '/images/wash.jpg', caption: 'Layanan Mencuci' },
        { img: '/images/ironing.jpg', caption: 'Layanan Setrika' },
        { img: 'https://img.okezone.com/content/2022/03/16/12/2562573/ini-tips-mencuci-dengan-mesin-cuci-yang-benar-dan-hemat-XjnK5p6qex.jpg', caption: 'Layanan Mencuci dan Setrika' },
        { img: '/images/laundry-img.webp', caption: 'Layanan Mencuci dan Setrika' },
        { img: '/images/wash.jpg', caption: 'Layanan Mencuci' },
        { img: '/images/ironing.jpg', caption: 'Layanan Setrika' },
    ]

    return { router, productArr, services }
}