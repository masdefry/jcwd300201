'use client'

import { FaRegClock, FaRocket, FaUsers, FaUsersCog } from 'react-icons/fa'
export const useAboutUsHooks = () => {
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
        { boxCaption: 'Pengalaman Bertahun-tahun di Layanan Laundry', icon: FaRegClock },
        { boxCaption: 'Fokus pada Kualitas dan Kecepatan', icon: FaRocket },
        { boxCaption: 'Dipercaya oleh Banyak Pelanggan', icon: FaUsers },
        { boxCaption: 'Tim Profesional yang Berdedikasi', icon: FaUsersCog },
    ]

    return { boxContent, teamContent }
}