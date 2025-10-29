"use client"

import type React from "react"

import { useMemo, useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Upload, X, Plus, Minus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

type TamanhoMiniatura = "20cm" | "30cm" | "50cm"

type ItemCarrinho = {
  id: string
  tamanho: TamanhoMiniatura
  quantidade: number
  fotos: File[]
  detalhes?: string
  nomePessoa?: string
  roupasAcessorios?: string
}

const PRECOS = {
  "20cm": { original: 169.9, promocional: 67.9 },
  "30cm": { original: 244.9, promocional: 97.9 },
  "50cm": { original: 294.9, promocional: 117.9 },
}

const TAMANHOS = [
  {
    id: "20cm" as TamanhoMiniatura,
    nome: "Miniatura 20cm",
    descricao: "Perfeita para coleções",
    comprimento: "20cm de altura",
  },
  {
    id: "30cm" as TamanhoMiniatura,
    nome: "Miniatura 30cm",
    descricao: "Tamanho ideal para detalhes",
    comprimento: "30cm de altura",
  },
  {
    id: "50cm" as TamanhoMiniatura,
    nome: "Miniatura 50cm",
    descricao: "Máximo detalhamento",
    comprimento: "50cm de altura",
  },
]

const CHECKOUT_URLS: Record<string, string> = {
  "1x20cm": "https://checkout.meumini.com/VCCL1O8SBTNJ",
  "2x20cm": "https://checkout.meumini.com/VCCL1O8SBTPG",
  "3x20cm": "https://checkout.meumini.com/VCCL1O8SBTPH",
  "4x20cm": "https://checkout.meumini.com/VCCL1O8SBTPI",
  "5x20cm": "https://checkout.meumini.com/VCCL1O8SBTPJ",
  "6x20cm": "https://checkout.meumini.com/VCCL1O8SBTPK",
  "1x30cm": "https://checkout.meumini.com/VCCL1O8SBTOW",
  "2x30cm": "https://checkout.meumini.com/VCCL1O8SBTPL",
  "3x30cm": "https://checkout.meumini.com/VCCL1O8SBTPM",
  "4x30cm": "https://checkout.meumini.com/VCCL1O8SBTPN",
  "5x30cm": "https://checkout.meumini.com/VCCL1O8SBTPO",
  "6x30cm": "https://checkout.meumini.com/VCCL1O8SBTPP",
  "1x50cm": "https://checkout.meumini.com/VCCL1O8SBTP9",
  "2x50cm": "https://checkout.meumini.com/VCCL1O8SBTPQ",
  "3x50cm": "https://checkout.meumini.com/VCCL1O8SBTPR",
  "4x50cm": "https://checkout.meumini.com/VCCL1O8SBTPS",
  "5x50cm": "https://checkout.meumini.com/VCCL1O8SBTPT",
  "6x50cm": "https://checkout.meumini.com/VCCL1O8SBTPU",
  "1x20cm+1x30cm": "https://checkout.meumini.com/VCCL1O8SCEUD",
  "1x30cm+1x50cm": "https://checkout.meumini.com/VCCL1O8SCEUE",
  "1x20cm+1x50cm": "https://checkout.meumini.com/VCCL1O8SCEUF",
  "2x20cm+1x30cm": "https://checkout.meumini.com/VCCL1O8SCEUH",
  "1x20cm+2x50cm": "https://checkout.meumini.com/VCCL1O8SCEUI",
  "1x20cm+2x30cm": "https://checkout.meumini.com/VCCL1O8SCEUL",
  "1x30cm+2x50cm": "https://checkout.meumini.com/VCCL1O8SCEUM",
  "2x30cm+1x50cm": "https://checkout.meumini.com/VCCL1O8SCEUN",
  "1x20cm+1x30cm+1x50cm": "https://checkout.meumini.com/VCCL1O8SCEUG",
  "1x20cm+1x30cm+2x50cm": "https://checkout.meumini.com/VCCL1O8SCEUJ",
  "2x20cm+1x30cm+1x50cm": "https://checkout.meumini.com/VCCL1O8SCEUK",
  "1x20cm+2x30cm+2x50cm": "https://checkout.meumini.com/VCCL1O8SCEUO",
}

export default function CarBuilderStep1() {
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<TamanhoMiniatura | null>(null)
  const [quantidade, setQuantidade] = useState<number>(1)
  const [fotosSelecionadas, setFotosSelecionadas] = useState<File[]>([])
  const [detalhesAdicionais, setDetalhesAdicionais] = useState<string>("")

  const [nomePessoa, setNomePessoa] = useState<string>("")
  const [roupasAcessorios, setRoupasAcessorios] = useState<string>("")

  const [nomePessoaValid, setNomePessoaValid] = useState<boolean | null>(null)
  const [roupasAcessoriosValid, setRoupasAcessoriosValid] = useState<boolean | null>(null)
  const [detalhesAdicionaisValid, setDetalhesAdicionaisValid] = useState<boolean | null>(null)

  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [erro, setErro] = useState<string | null>(null)

  const imageWrapRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)
  const step2Ref = useRef<HTMLDivElement>(null)
  const step3Ref = useRef<HTMLDivElement>(null)
  const addToCartRef = useRef<HTMLDivElement>(null)

  const [fly, setFly] = useState<{ style: React.CSSProperties; src: string } | null>(null)
  const [cartPulse, setCartPulse] = useState(false)
  const [showCartEmoji, setShowCartEmoji] = useState(false)

  const isStep1Complete = tamanhoSelecionado !== null
  const isStep2Complete = nomePessoa.trim() !== "" && fotosSelecionadas.length > 0

  useEffect(() => {
    if (isStep1Complete && step2Ref.current) {
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }, [isStep1Complete])

  useEffect(() => {
    if (isStep2Complete && addToCartRef.current) {
      setTimeout(() => {
        addToCartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }, [isStep2Complete])

  useEffect(() => {
    if (detalhesAdicionaisValid === true && addToCartRef.current) {
      setTimeout(() => {
        addToCartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }, [detalhesAdicionaisValid])

  useEffect(() => {
    if (nomePessoa.trim().length === 0) {
      setNomePessoaValid(null)
      return
    }

    const timer = setTimeout(() => {
      setNomePessoaValid(nomePessoa.trim().length >= 2)
    }, 500)

    return () => clearTimeout(timer)
  }, [nomePessoa])

  useEffect(() => {
    if (roupasAcessorios.trim().length === 0) {
      setRoupasAcessoriosValid(null)
      return
    }

    const timer = setTimeout(() => {
      setRoupasAcessoriosValid(roupasAcessorios.trim().length >= 3)
    }, 500)

    return () => clearTimeout(timer)
  }, [roupasAcessorios])

  useEffect(() => {
    if (detalhesAdicionais.trim().length === 0) {
      setDetalhesAdicionaisValid(null)
      return
    }

    const timer = setTimeout(() => {
      setDetalhesAdicionaisValid(detalhesAdicionais.trim().length >= 10 ? true : null)
    }, 500)

    return () => clearTimeout(timer)
  }, [detalhesAdicionais])

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getCheckoutUrlWithUTM = (): string | null => {
    const baseUrl = getCheckoutUrl()
    if (!baseUrl) return null

    if (typeof window !== "undefined") {
      const currentParams = new URLSearchParams(window.location.search)
      const utmParams = new URLSearchParams()

      for (const [key, value] of currentParams.entries()) {
        if (key.startsWith("utm_") || key === "fbclid" || key === "gclid") {
          utmParams.append(key, value)
        }
      }

      if (utmParams.toString()) {
        const separator = baseUrl.includes("?") ? "&" : "?"
        return `${baseUrl}${separator}${utmParams.toString()}`
      }
    }

    return baseUrl
  }

  const getCheckoutUrl = (): string | null => {
    if (carrinho.length === 0) return null

    const quantities: Record<TamanhoMiniatura, number> = {
      "20cm": 0,
      "30cm": 0,
      "50cm": 0,
    }

    carrinho.forEach((item) => {
      quantities[item.tamanho] += item.quantidade
    })

    const parts: string[] = []
    if (quantities["20cm"] > 0) parts.push(`${quantities["20cm"]}x20cm`)
    if (quantities["30cm"] > 0) parts.push(`${quantities["30cm"]}x30cm`)
    if (quantities["50cm"] > 0) parts.push(`${quantities["50cm"]}x50cm`)

    const checkoutKey = parts.join("+")

    return CHECKOUT_URLS[checkoutKey] || null
  }

  const checkoutUrl = getCheckoutUrlWithUTM()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setFotosSelecionadas((prev) => [...prev, ...files])
      setErro(null)
    }
  }

  const removePhoto = (index: number) => {
    setFotosSelecionadas((prev) => prev.filter((_, i) => i !== index))
  }

  const totalCarrinho = useMemo(() => {
    return carrinho.reduce((total, item) => {
      const preco = PRECOS[item.tamanho].promocional
      return total + preco * item.quantidade
    }, 0)
  }, [carrinho])

  const adicionarAoCarrinho = () => {
    if (!tamanhoSelecionado) {
      setErro("Selecione um tamanho")
      return
    }

    if (fotosSelecionadas.length === 0) {
      setErro("É obrigatório enviar pelo menos uma foto da pessoa")
      return
    }

    const totalItensNoCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0)
    if (totalItensNoCarrinho + quantidade > 6) {
      setErro(`Máximo de 6 itens por pedido. Você já tem ${totalItensNoCarrinho} item(s) no carrinho.`)
      return
    }

    const novoItem: ItemCarrinho = {
      id: Date.now().toString(),
      tamanho: tamanhoSelecionado,
      quantidade: quantidade,
      fotos: fotosSelecionadas,
      detalhes: detalhesAdicionais.trim() || undefined,
      nomePessoa: nomePessoa.trim() || undefined,
      roupasAcessorios: roupasAcessorios.trim() || undefined,
    }

    setCarrinho((prev) => [...prev, novoItem])

    setTamanhoSelecionado(null)
    setQuantidade(1)
    setFotosSelecionadas([])
    setDetalhesAdicionais("")
    setNomePessoa("")
    setRoupasAcessorios("")
    setNomePessoaValid(null)
    setRoupasAcessoriosValid(null)
    setDetalhesAdicionaisValid(null)
    setErro(null)

    animateToCart()
  }

  const animateToCart = () => {
    setShowCartEmoji(true)

    setTimeout(() => {
      setShowCartEmoji(false)
    }, 2000)

    if (fotosSelecionadas.length > 0 && cartRef.current) {
      const firstPhoto = fotosSelecionadas[0]
      const photoUrl = URL.createObjectURL(firstPhoto)

      const flyingImg = document.createElement("img")
      flyingImg.src = photoUrl
      flyingImg.style.cssText = `
        position: fixed;
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        z-index: 9999;
        pointer-events: none;
        transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      `

      const startX = window.innerWidth / 2
      const startY = window.innerHeight / 2

      const cartRect = cartRef.current.getBoundingClientRect()
      const endX = cartRect.left + cartRect.width / 2
      const endY = cartRect.top + cartRect.height / 2

      flyingImg.style.left = `${startX - 30}px`
      flyingImg.style.top = `${startY - 30}px`

      document.body.appendChild(flyingImg)

      setTimeout(() => {
        flyingImg.style.left = `${endX - 30}px`
        flyingImg.style.top = `${endY - 30}px`
        flyingImg.style.transform = "scale(0.3)"
        flyingImg.style.opacity = "0.8"
      }, 100)

      setTimeout(() => {
        document.body.removeChild(flyingImg)
        setCartPulse(true)
        setTimeout(() => setCartPulse(false), 1000)
      }, 1300)

      setTimeout(() => {
        cartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 800)
    } else {
      setCartPulse(true)
      setTimeout(() => setCartPulse(false), 1000)
      setTimeout(() => {
        cartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 500)
    }
  }

  const removerDoCarrinho = (id: string) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== id))
  }

  const getMaxQuantidadePermitida = () => {
    const totalItensNoCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0)
    return Math.max(1, 6 - totalItensNoCarrinho)
  }

  const handleFinalizarPedido = async () => {
    console.log("[v0] Finalizar Pedido clicked - Total:", formatBRL(totalCarrinho))

    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }

    try {
      const webhookUrl = "https://www.n8n.meuminizin.shop/webhook/fdc8dee9-9935-461c-baa3-67b6f7139306"

      const webhookData = {
        event: "checkout_initiated",
        timestamp: new Date().toISOString(),
        total: totalCarrinho,
        currency: "BRL",
        itemCount: carrinho.reduce((total, item) => total + item.quantidade, 0),
        items: carrinho.map((item) => ({
          id: item.id,
          tamanho: item.tamanho,
          quantidade: item.quantidade,
          preco: PRECOS[item.tamanho].promocional,
          total: PRECOS[item.tamanho].promocional * item.quantidade,
          nomePessoa: item.nomePessoa,
          roupasAcessorios: item.roupasAcessorios,
          detalhes: item.detalhes,
          fotosCount: item.fotos.length,
        })),
      }

      console.log("[v0] Sending webhook to n8n:", webhookData)

      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      })
        .then(async (response) => {
          if (response.ok) {
            console.log("[v0] Webhook sent successfully")
          } else {
            const errorText = await response.text().catch(() => "Unknown error")
            console.error("[v0] Webhook failed:", response.status, response.statusText, errorText)
          }
        })
        .catch((error) => {
          console.error("[v0] Error sending webhook:", error instanceof Error ? error.message : String(error))
        })
    } catch (error) {
      console.error("[v0] Error preparing webhook:", error instanceof Error ? error.message : String(error))
    }

    // Track with Google Ads
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "begin_checkout", {
        currency: "BRL",
        value: totalCarrinho,
        items: carrinho.map((item) => ({
          item_id: item.id,
          item_name: `Miniatura ${item.tamanho}`,
          quantity: item.quantidade,
          price: PRECOS[item.tamanho].promocional,
        })),
      })
      console.log("[v0] Google Ads checkout event sent")
    }

    // Track with TikTok Pixel
    if (typeof window !== "undefined" && (window as any).ttq) {
      ;(window as any).ttq.track("InitiateCheckout", {
        content_type: "product",
        quantity: carrinho.reduce((total, item) => total + item.quantidade, 0),
        value: totalCarrinho,
        currency: "BRL",
      })
      console.log("[v0] TikTok checkout event sent")
    }
  }

  return (
    <section
      id="car-builder"
      className="py-8 sm:py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 relative overflow-hidden"
    >
      {showCartEmoji && (
        <div className="fixed inset-0 pointer-events-none z-[10000] flex justify-center">
          <div className="animate-fall text-8xl">🛒</div>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-fall {
          animation: fall 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 backdrop-blur-sm rounded-lg py-4 px-6 mx-auto max-w-fit border border-white/20 bg-sidebar-primary font-heading">
            Monte seu pedido
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <Card className="border-2 border-white/20 bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between font-heading">
                  <span className="text-lg sm:text-xl">Configure sua miniatura</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Size Selection */}
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-gray-900">1. Escolha o tamanho da miniatura</div>

                  <div className="space-y-3">
                    {TAMANHOS.map((tamanho) => {
                      const preco = PRECOS[tamanho.id]
                      const isSelected = tamanhoSelecionado === tamanho.id

                      return (
                        <button
                          key={tamanho.id}
                          onClick={() => setTamanhoSelecionado(tamanho.id)}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                            isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{tamanho.nome}</div>
                              <div className="text-sm text-gray-600">{tamanho.comprimento}</div>
                              <div className="text-xs text-gray-500">{tamanho.descricao}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm line-through text-gray-400">{formatBRL(preco.original)}</div>
                              <div className="text-lg font-bold text-blue-600">{formatBRL(preco.promocional)}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {isStep1Complete ? (
                  <div ref={step2Ref} className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">2. Informações da pessoa</div>

                    <div className="relative">
                      <label htmlFor="nomePessoa" className="text-xs font-medium text-gray-700 block mb-1">
                        Nome da Pessoa *
                      </label>
                      <div className="relative">
                        <Input
                          id="nomePessoa"
                          value={nomePessoa}
                          onChange={(e) => setNomePessoa(e.target.value)}
                          placeholder="Ex: João Silva"
                          style={{ fontSize: "16px" }}
                          className={`pr-10 transition-all ${
                            nomePessoaValid === true
                              ? "border-green-500 bg-green-50/50"
                              : nomePessoaValid === false
                                ? "border-blue-400"
                                : ""
                          }`}
                        />
                        {nomePessoaValid === true && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-green-600 animate-pulse" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <label htmlFor="roupasAcessorios" className="text-xs font-medium text-gray-700 block mb-1">
                        Descrição de Roupas e Acessórios
                      </label>
                      <div className="relative">
                        <Input
                          id="roupasAcessorios"
                          value={roupasAcessorios}
                          onChange={(e) => setRoupasAcessorios(e.target.value)}
                          placeholder="Ex: Camisa azul, calça jeans, óculos, relógio..."
                          style={{ fontSize: "16px" }}
                          className={`pr-10 transition-all ${
                            roupasAcessoriosValid === true
                              ? "border-green-500 bg-green-50/50"
                              : roupasAcessoriosValid === false
                                ? "border-blue-400"
                                : ""
                          }`}
                        />
                        {roupasAcessoriosValid === true && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Check className="w-5 h-5 text-green-600 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Descreva as roupas e acessórios que a pessoa está usando nas fotos
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg space-y-4">
                      <div className="text-sm font-semibold text-gray-900">Envie fotos da pessoa *</div>

                      <p className="text-xs text-gray-600">
                        <span className="font-medium text-blue-700">OBRIGATÓRIO:</span> Envie fotos nítidas da pessoa de
                        diferentes ângulos (frente, perfil, corpo inteiro). Quanto mais fotos, melhor será o resultado!
                      </p>

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="photo-upload"
                          key={fotosSelecionadas.length}
                        />
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">Clique para selecionar fotos ou arraste aqui</p>
                          <p className="text-xs text-gray-500">Formatos aceitos: JPG, PNG, WEBP</p>
                        </label>
                      </div>

                      {fotosSelecionadas.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-gray-700">
                            Fotos selecionadas ({fotosSelecionadas.length}):
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {fotosSelecionadas.map((foto, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(foto) || "/placeholder.svg"}
                                  alt={`Foto ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border"
                                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(foto))}
                                />
                                <button
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">⬆️ Complete a etapa 1 para continuar</p>
                  </div>
                )}

                {/* Step 3: Additional Details */}
                {isStep1Complete && (
                  <div ref={step3Ref} className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-900">3. Descrição adicional</div>
                    <label htmlFor="detalhes" className="text-sm font-medium text-gray-700 block">
                      Tem algum detalhe a mais que devemos saber sobre a miniatura?
                    </label>
                    <div className="relative">
                      <textarea
                        id="detalhes"
                        value={detalhesAdicionais}
                        onChange={(e) => setDetalhesAdicionais(e.target.value)}
                        placeholder="Ex: Pose específica, expressão facial, detalhes especiais de cabelo, tatuagens, cicatrizes, etc..."
                        style={{ fontSize: "16px" }}
                        className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          detalhesAdicionaisValid === true
                            ? "border-green-500 bg-green-50/50 pr-10"
                            : detalhesAdicionaisValid === false
                              ? "border-blue-400"
                              : "border-gray-300"
                        }`}
                        rows={4}
                        maxLength={500}
                      />
                      {detalhesAdicionaisValid === true && (
                        <div className="absolute right-3 top-3">
                          <Check className="w-5 h-5 text-green-600 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 text-right">{detalhesAdicionais.length}/500 caracteres</div>
                  </div>
                )}

                {/* Quantity Selection */}
                {isStep2Complete && (
                  <div ref={addToCartRef} className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900 mb-3">Quantidade</div>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        disabled={quantidade <= 1}
                        className="h-10 w-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">{quantidade}</div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantidade(Math.min(getMaxQuantidadePermitida(), quantidade + 1))}
                        disabled={quantidade >= getMaxQuantidadePermitida()}
                        className="h-10 w-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Máximo de {getMaxQuantidadePermitida()} unidades
                    </p>
                  </div>
                )}

                {erro && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-700">{erro}</AlertDescription>
                  </Alert>
                )}

                {!isStep1Complete || !isStep2Complete ? (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-700 text-sm">
                      {!isStep1Complete && "Selecione um tamanho para continuar."}
                      {isStep1Complete &&
                        !isStep2Complete &&
                        "Preencha o nome e envie pelo menos uma foto para continuar."}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <Button
                  onClick={adicionarAoCarrinho}
                  disabled={!isStep1Complete || !isStep2Complete}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div
              ref={cartRef}
              className={`space-y-6 p-4 sm:p-5 rounded-xl border border-white/20 bg-white/95 backdrop-blur-sm ${
                cartPulse ? "ring-2 ring-white ring-offset-2 ring-offset-transparent transition-all duration-1000" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-heading">Carrinho de compras</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border border-green-200">Itens: {carrinho.length}</Badge>
                <Badge variant="outline" className="ml-auto">
                  Total: {formatBRL(totalCarrinho)}
                </Badge>
              </div>

              {carrinho.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-sm text-gray-600 bg-gray-50">
                  Seu carrinho está vazio. Adicione pelo menos uma miniatura para continuar.
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {carrinho.map((item) => {
                      const preco = PRECOS[item.tamanho].promocional
                      const total = preco * item.quantidade

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-4 bg-white"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{TAMANHOS.find((t) => t.id === item.tamanho)?.nome}</Badge>
                              <span className="text-sm text-gray-600">Qtd: {item.quantidade}</span>
                              <span className="text-sm text-gray-600">{item.fotos.length} fotos</span>
                              <span className="text-sm font-semibold text-gray-900">{formatBRL(total)}</span>
                            </div>
                            {(item.nomePessoa || item.roupasAcessorios) && (
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                {item.nomePessoa && (
                                  <div>
                                    <span className="font-medium">Nome:</span> {item.nomePessoa}
                                  </div>
                                )}
                                {item.roupasAcessorios && (
                                  <div>
                                    <span className="font-medium">Roupas e Acessórios:</span> {item.roupasAcessorios}
                                  </div>
                                )}
                              </div>
                            )}
                            {item.detalhes && (
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
                                <span className="font-medium">Detalhes:</span> {item.detalhes}
                              </div>
                            )}
                          </div>

                          <Button variant="outline" onClick={() => removerDoCarrinho(item.id)} className="h-10">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </Button>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-2">
                    {carrinho.reduce((total, item) => total + item.quantidade, 0) < 6 && (
                      <Button
                        onClick={() => {
                          const carBuilder = document.getElementById("car-builder")
                          if (carBuilder) {
                            carBuilder.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        }}
                        variant="outline"
                        className="w-full h-10 mb-3 text-sm font-medium border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                      >
                        ADICIONAR MAIS MINIATURAS
                      </Button>
                    )}

                    {carrinho.reduce((total, item) => total + item.quantidade, 0) === 6 && (
                      <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 text-center">
                          Só é possível adicionar 6 itens no carrinho. Caso queira pedir mais miniaturas, terá que gerar
                          outro pedido depois de finalizar o pagamento do primeiro.
                        </p>
                      </div>
                    )}

                    {checkoutUrl ? (
                      <Button
                        onClick={handleFinalizarPedido}
                        className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      >
                        Finalizar Pedido - {formatBRL(totalCarrinho)}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-gray-400 text-white shadow-md cursor-not-allowed"
                      >
                        Finalizar Pedido - {formatBRL(totalCarrinho)}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
