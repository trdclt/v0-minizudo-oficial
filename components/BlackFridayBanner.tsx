"use client"

export default function BlackFridayBanner() {
  return (
    <div className="relative bg-black text-white overflow-hidden py-3 z-40">
      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-text text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap px-8">
            Esquenta Black Friday somente em 1.000 miniaturas essa semana 
          </span>
          <span className="marquee-text text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap px-8">
            Esquenta Black Friday somente em 1.000 miniaturas essa semana 
          </span>
                    <span className="marquee-text text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap px-8">
            Esquenta Black Friday somente em 1.000 miniaturas essa semana 
          </span>
                    <span className="marquee-text text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap px-8">
            Esquenta Black Friday somente em 1.000 miniaturas essa semana 
          </span>
                    <span className="marquee-text text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap px-8">
            Esquenta Black Friday somente em 1.000 miniaturas essa semana 
          </span>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-text {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}
