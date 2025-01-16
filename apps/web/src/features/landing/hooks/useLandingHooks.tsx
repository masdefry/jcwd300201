'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaCalendar, FaHandsWash, FaRegClock, FaRocket, FaTshirt, FaUsers, FaUsersCog } from "react-icons/fa"
import { GrDeliver } from "react-icons/gr"

export const useLandingHooks = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isFade, setIsFade] = useState<boolean>(false)

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

    return {
        router,
        isLoading,
        setIsLoading,
        currentIndex,
        setCurrentIndex,
        isFade,
        setIsFade,
        teamContent,
        boxContent,
        productArr,
        testimonialData,
        whyUsData,
        processSteps
    }
}