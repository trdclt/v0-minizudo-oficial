"use client"
import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

import { useState, useEffect } from "react"
import InstagramShowcase from "./components/InstagramShowcase"
import CarBuilderStep1 from "./components/car-builder-step1"
import FloatingChat from "@/components/FloatingChat"
import BlackFridayBanner from "@/components/BlackFridayBanner"
import Image from "next/image"
import Script from "next/script"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "media-id"?: string
        aspect?: string
      }
    }
  }
}

export default function Home() {
  const FloatingCountdown = () => {
    const [timeRemaining, setTimeRemaining] = useState<number>(() => {
      if (typeof window !== "undefined") {
        const savedStartTime = localStorage.getItem("promo_timer_start")
        const initialDuration = 1 * 3600 + 6 * 60 + 1 // 1:06:01 in seconds (50% of original)

        if (savedStartTime) {
          const startTime = Number.parseInt(savedStartTime, 10)
          const now = Math.floor(Date.now() / 1000)
          const elapsed = now - startTime
          const remaining = initialDuration - elapsed
          return remaining > 0 ? remaining : 0
        } else {
          // First visit - save current timestamp
          const now = Math.floor(Date.now() / 1000)
          localStorage.setItem("promo_timer_start", now.toString())
          return initialDuration
        }
      }
      return 1 * 3600 + 6 * 60 + 1 // Default: 1:06:01
    })

    useEffect(() => {
      if (timeRemaining <= 0) return

      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }, [timeRemaining])

    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const [miniaturas, setMiniaturas] = useState<number>(() => {
      // Load from localStorage on mount, default to 294 if not found
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("miniaturas_count")
        if (saved) {
          const count = Number.parseInt(saved, 10)
          return count > 7 ? count : 7
        }
      }
      return 294
    })
    const [decreaseBy, setDecreaseBy] = useState(1)

    useEffect(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("miniaturas_count", miniaturas.toString())
      }
    }, [miniaturas])

    useEffect(() => {
      const interval = setInterval(() => {
        setMiniaturas((prev) => {
          if (prev <= 7) {
            clearInterval(interval)
            return 7
          }
          const newValue = prev - decreaseBy
          return newValue < 7 ? 7 : newValue
        })
        setDecreaseBy((prev) => (prev === 1 ? 2 : 1))
      }, 6000) // Changed from 3000ms to 6000ms (6 seconds) to decrease slower

      return () => clearInterval(interval)
    }, [decreaseBy])

    const getCurrentDateInPortuguese = () => {
      const today = new Date()
      const daysOfWeek = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
      ]
      const dayOfWeek = daysOfWeek[today.getDay()]
      const day = today.getDate().toString().padStart(2, "0")
      const month = (today.getMonth() + 1).toString().padStart(2, "0")
      const year = today.getFullYear().toString().slice(-2)

      return `${dayOfWeek}, ${day}/${month}/${year}`
    }

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4">
        <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-xl">
          <div className="text-center">
            <p className="text-sm font-semibold mb-1">Promoção acaba {getCurrentDateInPortuguese()}</p>
            <p className="text-2xl font-bold font-mono text-card">{formatTime(timeRemaining)}</p>
          </div>
        </div>
      </div>
    )
  }

  // WhatsApp Modal Component
  const WhatsAppModal = ({
    showWhatsAppModal,
    setShowWhatsAppModal,
  }: { showWhatsAppModal: boolean; setShowWhatsAppModal: (show: boolean) => void }) => {
    if (!showWhatsAppModal) return null

    const handleWhatsAppRedirect = () => {
      const phoneNumber = "5545999673964"
      const message = "Vim pelo site da minizudo. Quero fazer um pedido."
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      window.open(whatsappUrl, "_blank")
      setShowWhatsAppModal(false)
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Fale Conosco no WhatsApp</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Clique no botão abaixo para ser redirecionado ao nosso WhatsApp e fazer seu pedido
            </p>
            <div className="space-y-3">
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Ir para WhatsApp
              </button>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Continuar a navegar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(0)
  const totalFeedbacks = 11

  const nextFeedback = () => {
    setCurrentFeedback((prev) => (prev + 1) % totalFeedbacks)
  }

  const prevFeedback = () => {
    setCurrentFeedback((prev) => (prev - 1 + totalFeedbacks) % totalFeedbacks)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Scripts externos */}
      <Script src="https://fast.wistia.com/player.js" async />
      <Script src="https://fast.wistia.com/embed/1wdkw3sazu.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/qk2ddb7daw.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/6m4l69io9n.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/8jqh18qdx1.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/nq8ipvh60f.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/5hk4rzyitu.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/wluuzeatb8.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/jvsuiaurzo.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/welbnu78fa.js" async type="module" />
      <Script src="https://fast.wistia.com/embed/vczs4rnse7.js" async type="module" />

      {/* Pixel UTMify (só roda em produção) */}
      {process.env.NODE_ENV === "production" && (
        <>
          <Script
            id="utmify-lib"
            src="https://cdn.utmify.com.br/scripts/utms/latest.js"
            strategy="afterInteractive"
            data-utmify-prevent-xcod-sck
            data-utmify-prevent-subids
          />
          <Script
            id="utmify-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.pixelId = "68c05d2b25d74a671ed27345";
                var a = document.createElement("script");
                a.setAttribute("async", "");
                a.setAttribute("defer", "");
                a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
                document.head.appendChild(a);
              `,
            }}
          />
        </>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto sm:px-4 sm:py-4 px-2 my-0 py-0 h-20 flex justify-center items-center">
          <Image
            src="/images/minizudo-logo.png"
            alt="MINIZUDO"
            width={560}
            height={140}
            className="h-[100px] sm:h-[140px] w-auto"
            priority
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white sm:py-12 py-3.5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Transforme QUALQUER pessoa em uma <span style={{ color: "#2563eb" }}>MINIATURA</span>
                <br />
                <span style={{ color: "#2563eb" }}>Desça a tela até Monte seu Pedido </span>
              </h1>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-blue-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                -45% ESSA SEMANA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Black Friday Banner */}
      <BlackFridayBanner />

      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-3xl mx-auto px-3 sm:px-4"></div>
      </section>

      {/* Videos Section */}
      <section className="sm:py-12 bg-gray-50 py-0">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 my-4">
          <InstagramShowcase />

          <div className="max-w-md mx-auto mb-8">
            <style jsx>{`
              wistia-player[media-id='1wdkw3sazu']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/1wdkw3sazu/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 177.78%;
              }
            `}</style>
            <wistia-player
              media-id="1wdkw3sazu"
              aspect="0.5625"
              className="w-full rounded-lg shadow-lg"
            ></wistia-player>
          </div>

          <div className="text-center py-6 sm:py-8 bg-white rounded-lg shadow-sm mb-4 mt-0">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-xs text-gray-500">R ANGELO DIAS 220 SALA 605 123, CENTRO- 89010-020, SC</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Empresa especializada em miniaturas personalizadas desde 2020
              </p>
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Veja algumas Miniaturas Prontas
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              De fotos da pessoa para uma miniatura personalizada perfeita em grande escala.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='qk2ddb7daw']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/qk2ddb7daw/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="qk2ddb7daw" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='6m4l69io9n']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/6m4l69io9n/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="6m4l69io9n" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='8jqh18qdx1']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/8jqh18qdx1/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="8jqh18qdx1" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='nq8ipvh60f']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/nq8ipvh60f/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="nq8ipvh60f" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='5hk4rzyitu']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/5hk4rzyitu/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="5hk4rzyitu" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='wluuzeatb8']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/wluuzeatb8/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="wluuzeatb8" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='jvsuiaurzo']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/jvsuiaurzo/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="jvsuiaurzo" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
            <div className="aspect-[9/16] rounded-lg overflow-hidden shadow-lg">
              <style jsx>{`
                wistia-player[media-id='welbnu78fa']:not(:defined) {
                  background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/welbnu78fa/swatch');
                  display: block;
                  filter: blur(5px);
                  padding-top: 177.78%;
                }
              `}</style>
              <wistia-player media-id="welbnu78fa" aspect="0.5625" className="w-full h-full"></wistia-player>
            </div>
          </div>
        </div>
      </section>

      <CarBuilderStep1 />

      {/* Packaging Showcase Section */}
      <section className="sm:py-12 bg-white py-px">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8"></div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Caixa Colecionável Profissional
                </h3>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600 mb-4">
                  <li className="flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Design exclusivo minizudo
                  </li>
                  <li className="flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Proteção total durante o transporte
                  </li>
                  <li className="flex items-center justify-center lg:justify-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Perfeita para colecionadores
                  </li>
                </ul>
                <p className="text-sm text-gray-500 italic">* Comparação dos tamanhos em escala real</p>
              </div>

              <div className="flex-1 w-full max-w-2xl">
                <div className="relative">
                  <Image
                    src="/images/packaging-example.png"
                    alt="Caixa colecionável minizudo com miniatura personalizada"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    GRÁTIS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Por que escolher nossas miniaturas?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Três diferenciais únicos que fazem de cada miniatura uma obra de arte personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card
              className="text-center p-4 sm:p-6 border-2 hover:shadow-lg transition-all duration-300"
              style={{ borderColor: "#FEF3C7" }}
            >
              <CardContent className="pt-4 sm:pt-6">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  100% Personalizada
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <strong>Baseada nas fotos da pessoa! </strong> Cada detalhe é reproduzido fielmente para criar uma
                  miniatura única e especial.
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center p-4 sm:p-6 border-2 hover:shadow-lg transition-all duration-300"
              style={{ borderColor: "#DBEAFE" }}
            >
              <CardContent className="pt-4 sm:pt-6">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Materiais Premium
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <strong>Resina de alta qualidade e materiais duráveis. </strong>
                  Acabamento profissional com atenção aos mínimos detalhes.
                </p>
              </CardContent>
            </Card>

            <Card
              className="text-center p-4 sm:p-6 border-2 hover:shadow-lg transition-all duration-300 sm:col-span-2 md:col-span-1"
              style={{ borderColor: "#FEE2E2" }}
            >
              <CardContent className="pt-4 sm:pt-6">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Pintura Detalhada
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  <strong>Cores e detalhes idênticos à pessoa. </strong>
                  Pintura artesanal que captura cada característica, roupas e acessórios.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-16 bg-slate-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Como funciona?
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Três passos simples para ter sua miniatura personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white"
                style={{ backgroundColor: "#dc2626" }}
              >
                1
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 mb-2">Envie as fotos</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Faça upload de várias fotos da pessoa de diferentes ângulos: frente, perfil, corpo inteiro e detalhes
                especiais como roupas e acessórios. Quanto mais fotos, melhor será o resultado da miniatura.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white"
                style={{ backgroundColor: "#2563eb" }}
              >
                2
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 mb-2">Criamos sua miniatura</h3>
              <p className="text-sm sm:text-base text-gray-600">Nossos artesãos criam cada detalhe com precisão</p>
            </div>

            <div className="text-center sm:col-span-2 md:col-span-1">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white"
                style={{ backgroundColor: "#eab308" }}
              >
                3
              </div>

              <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 mb-2">Receba em casa!</h3>
              <p className="text-sm sm:text-base text-gray-600">Sua miniatura chega pronta para colecionar</p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <button
              onClick={() => {
                const carBuilder = document.getElementById("car-builder")
                if (carBuilder) {
                  carBuilder.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }}
              className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Monte seu pedido
            </button>
          </div>
        </div>
      </section>

      {/* Customer Feedbacks */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Veja a opinião de quem já tem sua miniatura</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <button
              onClick={prevFeedback}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Feedback anterior"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextFeedback}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Próximo feedback"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentFeedback * 100}%)` }}
              >
                {/* Feedback 1 - Carlos (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-5.png"
                            alt="Miniatura personalizada"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Fiz uma miniatura minha com o uniforme de beach tennis. Ficou perfeita! Até a raquete foi
                          reproduzida nos mínimos detalhes."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Carlos Silva</p>
                        <p className="text-xs sm:text-sm text-gray-500">São Paulo, SP</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 2 - Rafael (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-1.png"
                            alt="Miniatura de jogador de futebol"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Sou torcedor fanático do São Paulo e fiz uma miniatura minha com a camisa do time. Ficou
                          idêntica! Até a bola de futebol veio perfeita."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Rafael Costa</p>
                        <p className="text-xs sm:text-sm text-gray-500">Rio de Janeiro, RJ</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 8 - Ricardo (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-2.png"
                            alt="Miniatura personalizada"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Encomendei uma miniatura minha com o terno que uso no trabalho. Ficou impecável! Perfeita
                          para colocar na minha mesa de escritório."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Ricardo Mendes</p>
                        <p className="text-xs sm:text-sm text-gray-500">Fortaleza, CE</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 9 - Patrícia (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-3.png"
                            alt="Miniatura personalizada"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Fiz uma miniatura do meu filho com a camisa do Palmeiras. Ele ficou radiante! Todos os
                          detalhes do uniforme ficaram perfeitos."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Patrícia Alves</p>
                        <p className="text-xs sm:text-sm text-gray-500">Recife, PE</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 10 - Thiago (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-4.png"
                            alt="Miniatura personalizada"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Sou chef de cozinha e encomendei uma miniatura minha com o uniforme profissional. Até o
                          batedor foi reproduzido! Ficou incrível."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Thiago Barbosa</p>
                        <p className="text-xs sm:text-sm text-gray-500">Manaus, AM</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 11 - Juliana (WITH PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 w-full max-w-xs">
                          <Image
                            src="/images/instagram-6.png"
                            alt="Miniatura personalizada"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md w-full h-auto object-cover"
                          />
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Adoro jogar paddle tennis e fiz uma miniatura minha com o uniforme e a raquete. Ficou
                          idêntica! Presente perfeito para mim mesma."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Juliana Ferreira</p>
                        <p className="text-xs sm:text-sm text-gray-500">Goiânia, GO</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 3 - Mariana (NO PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Presenteei meu marido com uma miniatura dele no dia do casamento. Ele ficou emocionado!
                          Chegou super bem embalada."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Mariana Santos</p>
                        <p className="text-xs sm:text-sm text-gray-500">Belo Horizonte, MG</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 4 - João (NO PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Fiz miniaturas de toda a família para o aniversário da minha mãe. Ela chorou de emoção!
                          Qualidade impecável."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">João Pedro</p>
                        <p className="text-xs sm:text-sm text-gray-500">Curitiba, PR</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 5 - Amanda (NO PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "A miniatura da minha gata ficou perfeita! Até as manchinhas do pelo foram reproduzidas.
                          Parece que ela está viva!"
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Amanda Lima</p>
                        <p className="text-xs sm:text-sm text-gray-500">Porto Alegre, RS</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 6 - Lucas (NO PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          " Encomendei uma miniatura minha com o uniforme do trabalho. Ficou incrível! Todos os colegas
                          querem fazer também."
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Lucas Oliveira</p>
                        <p className="text-xs sm:text-sm text-gray-500">Brasília, DF</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback 7 - Fernanda (NO PHOTO) */}
                <div className="w-full flex-shrink-0 px-2 sm:px-4">
                  <Card className="p-4 sm:p-6">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex mb-3 sm:mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 italic leading-relaxed">
                          "Fiz uma miniatura da minha avó que já faleceu. Ficou tão real que parece que ela está aqui
                          comigo. Muito emocionante!"
                        </p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Fernanda Rocha</p>
                        <p className="text-xs sm:text-sm text-gray-500">Salvador, BA</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalFeedbacks }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeedback(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFeedback ? "bg-blue-600 w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Ir para feedback ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-16 bg-slate-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Tire suas dúvidas sobre nossas miniaturas</p>
          </div>

          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                Quanto tempo leva para produzir minha miniatura?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                O prazo de produção é de 04 a 05 dias úteis após a confirmação do pedido. Cada miniatura é feita
                artesanalmente com atenção aos detalhes.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                Posso fazer miniatura de qualquer pessoa?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                Sim! Trabalhamos com miniaturas de qualquer pessoa. Basta enviar fotos nítidas de diferentes ângulos,
                incluindo detalhes de roupas e acessórios que deseja incluir.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                Como funciona o envio?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                Enviamos para todo o Brasil via Correios com código de rastreamento. A miniatura é embalada com muito
                cuidado para chegar perfeita.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                Qual o tamanho da miniatura?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                Oferecemos três tamanhos: 20cm, 30cm e 50cm de altura. Você escolhe o tamanho ideal para sua coleção ou
                presente.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                Posso fazer modificações depois de enviar as fotos?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                Sim! Nossa equipe entrará em contato via WhatsApp para confirmar todos os detalhes antes de iniciar a
                produção.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-sm p-4 sm:p-6 group">
              <summary className="font-heading font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                A miniatura vem com caixa?
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                Sim! Todas as miniaturas vêm em uma caixa colecionável exclusiva minizudo, perfeita para exposição ou
                presente.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Sobre Nós</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Especialistas em miniaturas personalizadas desde 2020. Transformamos pessoas em obras de arte
                colecionáveis.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Links Úteis</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Como Funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Galeria
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Perguntas Frequentes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Atendimento</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>Email: contato@minizudo.com</li>
                <li>Horário: Seg-Sex 9h-18h</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Pagamento Seguro</h4>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Aceitamos todas as formas de pagamento</p>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-white p-2 rounded shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#1434CB" />
                    <path d="M8 8h8M8 12h8M8 16h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#FF6B00" />
                    <circle cx="12" cy="12" r="6" fill="white" />
                  </svg>
                </div>
                <div className="bg-white p-2 rounded shadow-sm">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#00A868" />
                    <path
                      d="M7 12l3 3 7-7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">© 2025 minizudo. Todos os direitos reservados.</p>
            <p className="text-xs text-gray-500 mt-2">
              CNPJ: 52.776.882/0001-85 | R ANGELO DIAS 220 SALA 605 123, CENTRO- 89010-020, SC
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <WhatsAppModal showWhatsAppModal={showWhatsAppModal} setShowWhatsAppModal={setShowWhatsAppModal} />
      )}

      {/* Floating Countdown Timer */}
      <FloatingCountdown />

      <FloatingChat />
    </div>
  )
}
