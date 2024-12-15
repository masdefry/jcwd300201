import { ReactNode } from 'react'
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Clean & Click | Data Pekerja',
    description: 'Welcome to Clean & Click',
}

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}