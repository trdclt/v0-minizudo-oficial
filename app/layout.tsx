import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "minizudo - Miniaturas Personalizadas",
  description: "Miniaturas personalizadas de pessoas - Designer Antonio Marlon Santos",
  generator: "minizudo",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}

        {/* UTMify Pixel */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {
            window.pixelId = "69026068078670b1a887fecb";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          }
        </Script>

        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids
          async
          defer
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
