import type { Metadata } from 'next'
import { Staatliches, Inter, Barlow_Condensed, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'
import { SITE_URL } from "@/lib/site"

// Isometra and Anton (tried first) didn't match the tall, flat-edged stencil look the
// reference site uses. Staatliches is the closest free equivalent — it's the --font-display
// face (hero + every section heading, via globals.css). Single weight (400).
const staatliches = Staatliches({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-staatliches',
  display: 'swap',
})

// Navbar text specifically: the reference uses a bold, non-condensed sans (a licensed font
// we can't use), so Inter at weight 700 is the closest free match — see .font-nav in globals.css.
const inter = Inter({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-inter',
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

const SITE_NAME = "Gayduo Management Agency"
const SITE_TAGLINE = "Talent Management & Brand Partnerships"
const SITE_DESCRIPTION =
  "Gayduo Management Agency connects talent with brands. We represent individuals across sports, lifestyle, and campus culture — including footballers and basketball players — and build the commercial partnerships that deliver value for both sides."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "talent management agency", "talent management", "athlete representation",
    "football agent", "basketball agent", "brand partnerships", "commercial partnerships",
    "player representation", "Gayduo Management Agency", "campus culture talent",
    "lifestyle talent management", "African football", "Liberia football", "Rwanda football",
    "Kigali talent agency", "Monrovia talent agency", "sports marketing agency",
    "Alvin Martor", "Daniel Parker",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    creator: "@gayduosa",
  },
  icons: { icon: "/Favicon.svg", shortcut: "/Favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
}

// Organization structured data — helps Google's Knowledge Panel and AI answer engines
// (Search Generative Experience, ChatGPT, Perplexity, etc.) identify and describe the agency.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "GSA",
  url: SITE_URL,
  logo: `${SITE_URL}/Web_Logo.svg`,
  description: SITE_DESCRIPTION,
  email: "info@gayduoma.com",
  sameAs: [
    "https://www.instagram.com/gayduosa/",
    "https://www.facebook.com/people/Gayduo-Sports-Agency/61581585638795/",
  ],
  address: [
    { "@type": "PostalAddress", addressLocality: "Kigali", addressCountry: "RW" },
    { "@type": "PostalAddress", addressLocality: "Monrovia", addressCountry: "LR" },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables must live on <html>: globals.css's `@theme inline` block resolves
    // var(--font-staatliches) etc. on :root (= <html>). Setting them on <body> instead means
    // :root can never see them — a custom property only flows down the tree, never up — so
    // every `font-display`/`font-heading` class silently falls back to the browser's default sans.
    <html lang="en" className={`${barlowCondensed.variable} ${dmSans.variable} ${staatliches.variable} ${inter.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
