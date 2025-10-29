"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Shield } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function InstagramShowcase() {
  const profilePic = "/images/minizudo-logo.png"
  const followers = "36.102"
  const following = "24"
  const posts = "51"
  const username = "@minizudo"
  const profileUrl = "https://meu-hotwheels.com/"

  const photos = [
    "/images/instagram-1.png", // Man in SPFC soccer jersey
    "/images/instagram-2.png", // Woman in business suit
    "/images/instagram-3.png", // Boy in Palmeiras jersey in box
    "/images/instagram-4.png", // Woman chef with whisk
    "/images/instagram-5.png", // Man in beach tennis outfit
    "/images/instagram-6.png", // Woman with paddle tennis racket
  ]

  return (
    <div className="flex justify-center items-center min-h-[60vh] py-0">
      <Card className="w-full max-w-md rounded-2xl shadow-xl p-6 bg-white/70 backdrop-blur">
        <div className="flex flex-col items-center gap-4">
          <Image
            src={profilePic || "/placeholder.svg"}
            alt="Logo MINIZUDO"
            width={96}
            height={96}
            className="rounded-full border-4 border-blue-300 shadow-md bg-white p-2"
          />
          <div className="flex items-center gap-2">
            <Instagram className="text-blue-600" />
            <span className="text-xl font-bold">{username}</span>
          </div>
        </div>
        <div className="flex justify-around mt-6 mb-4 text-center">
          <div>
            <div className="text-lg font-bold">{followers}</div>
            <div className="text-xs text-gray-500">Seguidores</div>
          </div>

          <div>
            <div className="text-lg font-bold">{posts}</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
        </div>
        <CardContent className="mt-4">
          <div className="space-y-2">
            {/* Top row - 3 images */}
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 3).map((photo, i) => (
                <Image
                  key={i}
                  src={photo || "/placeholder.svg"}
                  alt={`Miniatura minizudo ${i + 1}`}
                  width={120}
                  height={120}
                  className="aspect-square object-cover rounded-xl shadow-sm"
                />
              ))}
            </div>
            {/* Bottom row - 3 images */}
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(3, 6).map((photo, i) => (
                <Image
                  key={i + 3}
                  src={photo || "/placeholder.svg"}
                  alt={`Miniatura minizudo ${i + 4}`}
                  width={120}
                  height={120}
                  className="aspect-square object-cover rounded-xl shadow-sm"
                />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <a
                href="https://www.instagram.com/minizudo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Visitar Instagram
              </a>
            </Button>
          </div>
        </CardContent>
        <div className="mt-4 space-y-3">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 bg-green-100 px-4 py-2 rounded-full">
              + de 15.000 miniaturas entregues para o Brasil todo! 🇧🇷
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">EMPRESA CERTIFICADA</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-medium">CNPJ:</span>
                  <span className="font-mono">52.776.882/0001-85</span>
                </div>
                <div className="text-green-600 font-medium">✓ Empresa Ativa na Receita Federal</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
