import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Ubuntu } from 'next/font/google';
import './globals.css';
// import { Footer } from '@/components/Footer';
import TanstackProviders from '@/providers/tanstackProviders';
import Header from '@/components/core/navbar'
import Footer from '@/components/core/footer'
// import HOCLoading from '@/providers/hocLoading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clean & Click | Home',
  description: 'Welcome to Clean & Click',
};

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ubuntu',
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>

        <TanstackProviders>
          <Header />
          {/* <HOCLoading> */}
          {children}
          {/* </HOCLoading> */}
          <Footer />
        </TanstackProviders>

      </body>
    </html>
  );
}
