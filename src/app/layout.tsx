import type { Metadata, Viewport } from 'next';
import { Anton, Space_Mono, Archivo } from 'next/font/google';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const description =
  '48 frases sobre economia e costumes para descobrir onde você fica entre esquerda e direita, progressista e conservador. Nada é salvo nem enviado.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'MAPA//BR · Onde você está no mapa político?',
  description,
  openGraph: {
    title: 'MAPA//BR · Onde você está no mapa político?',
    description,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/api/imagem?f=og', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0D',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${spaceMono.variable} ${archivo.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-ink antialiased selection:bg-uv selection:text-white">
        {children}
      </body>
    </html>
  );
}
