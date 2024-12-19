import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import TanstackProviders from '@/providers/tanstackProviders';
import Header from '@/components/core/navbar'
import Footer from '@/components/core/footer'
import AuthProviders from '@/providers/authProviders'
import { Toaster } from "@/components/ui/toaster"
import FloatingWhatsappIcon from '@/components/core/floatingWhatsapp';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clean & Click | Beranda',
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
          <AuthProviders>
            <Header />
            {/* <HOCLoading> */}
            {children}
            <Toaster />
            {/* </HOCLoading> */}
            <FloatingWhatsappIcon />
            <Footer />
          </AuthProviders>
        </TanstackProviders>

      </body>
    </html>
  );
}
