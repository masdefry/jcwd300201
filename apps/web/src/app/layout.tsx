import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import TanstackProviders from '@/providers/tanstackProviders';
import HOCLoading from '@/providers/hocLoading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clean & Click | Home',
  description: 'Welcome to Clean & Click',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <TanstackProviders>
          <Header />
          <HOCLoading>
            {children}
          </HOCLoading>
          <Footer />
        </TanstackProviders>

      </body>
    </html>
  );
}
