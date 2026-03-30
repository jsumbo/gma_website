import type { Metadata } from 'next'
import { Bebas_Neue, Barlow_Condensed, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  display: 'swap',
})

const SITE_NAME = "Gayduo Sports Agency"
const SITE_DESCRIPTION =
  "Gayduo Sports Agency provides tailored, long-term career management for elite African football talent. We represent fewer players to do more for each one."
const SITE_URL = "https://gayduosa.org"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | African Football Agency`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "football agent", "soccer agency", "African football", "player representation",
    "Gayduo Sports Agency", "GSA", "football management", "Liberia football",
    "Rwanda football", "elite players", "Kigali football agent", "Monrovia football agent",
    "African footballer agent", "Vasco Jacobs", "Alvin Martor", "Daniel Parker",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | African Football Agency`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | African Football Agency`,
    description: SITE_DESCRIPTION,
    creator: "@gayduosa",
  },
  icons: { icon: "/Favicon.svg", shortcut: "/Favicon.svg" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${barlowCondensed.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
