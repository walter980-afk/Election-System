"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  life: number
  maxLife: number
  originalX: number
  originalY: number
  pathIndex: number
}

interface PathData {
  path: string
  color: string
  opacity: number
  points: { x: number; y: number }[]
}

export default function LogoParticle() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Particle[]>([])
  const [pathData, setPathData] = useState<PathData[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isReforming, setIsReforming] = useState(false)

  // Extract path data from SVG
  const extractSVGPaths = () => {
    const svgElement = svgRef.current
    if (!svgElement) return

    const paths = svgElement.querySelectorAll("path")
    const extractedPaths: PathData[] = []

    paths.forEach((path, index) => {
      const fill = path.getAttribute("fill") || "#000000"
      const opacity = Number.parseFloat(path.getAttribute("opacity") || "1")
      const pathString = path.getAttribute("d") || ""

      // Sample points along the path
      const points = samplePathPoints(path, 20) // Sample 20 points per path

      extractedPaths.push({
        path: pathString,
        color: fill,
        opacity,
        points,
      })
    })

    setPathData(extractedPaths)
  }

  // Sample points along an SVG path
  const samplePathPoints = (path: SVGPathElement, numSamples: number): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = []
    const pathLength = path.getTotalLength()

    for (let i = 0; i < numSamples; i++) {
      const distance = (pathLength * i) / numSamples
      const point = path.getPointAtLength(distance)

      // Scale points to canvas size (SVG is 268x320, canvas is 600x400)
      const scaleX = 600 / 268
      const scaleY = 400 / 320
      const offsetX = (600 - 268 * scaleX) / 2
      const offsetY = (400 - 320 * scaleY) / 2

      points.push({
        x: point.x * scaleX + offsetX,
        y: point.y * scaleY + offsetY,
      })
    }

    return points
  }

  const createParticleFromPath = (pathIndex: number, point: { x: number; y: number }, color: string): Particle => ({
    x: point.x,
    y: point.y,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 8,
    size: Math.random() * 4 + 1,
    color,
    opacity: 1,
    life: 0,
    maxLife: Math.random() * 180 + 120,
    originalX: point.x,
    originalY: point.y,
    pathIndex,
  })

  const generateParticlesFromSVG = () => {
    const newParticles: Particle[] = []

    pathData.forEach((path, pathIndex) => {
      path.points.forEach((point) => {
        // Create multiple particles per point for denser effect
        for (let i = 0; i < 3; i++) {
          const jitteredPoint = {
            x: point.x + (Math.random() - 0.5) * 10,
            y: point.y + (Math.random() - 0.5) * 10,
          }
          newParticles.push(createParticleFromPath(pathIndex, jitteredPoint, path.color))
        }
      })
    })

    setParticles(newParticles)
  }

  const reformLogo = () => {
    setIsReforming(true)

    setParticles((prevParticles) =>
      prevParticles.map((particle) => ({
        ...particle,
        vx: (particle.originalX - particle.x) * 0.02,
        vy: (particle.originalY - particle.y) * 0.02,
        life: 0,
        maxLife: 300,
      })),
    )

    setTimeout(() => {
      setIsReforming(false)
    }, 3000)
  }

  const animate = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    setParticles((prevParticles) => {
      const updatedParticles = prevParticles
        .map((particle) => {
          if (isReforming) {
            // Move particles back to original positions
            const dx = particle.originalX - particle.x
            const dy = particle.originalY - particle.y
            particle.vx = dx * 0.05
            particle.vy = dy * 0.05
            particle.opacity = Math.min(1, particle.opacity + 0.02)
          } else {
            // Normal physics
            particle.vx += (Math.random() - 0.5) * 0.1
            particle.vy += 0.08 // gravity
            particle.vx *= 0.98 // air resistance
            particle.vy *= 0.98
          }

          particle.x += particle.vx
          particle.y += particle.vy

          particle.life++
          if (!isReforming) {
            particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)
          }

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.vx *= -0.7
            particle.x = Math.max(0, Math.min(canvas.width, particle.x))
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.vy *= -0.7
            particle.y = Math.max(0, Math.min(canvas.height, particle.y))
          }

          return particle
        })
        .filter((particle) => isReforming || particle.life < particle.maxLife)

      // Draw particles with path-specific colors
      updatedParticles.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 3
        ctx.fill()
        ctx.restore()
      })

      return updatedParticles
    })

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  const startAnimation = () => {
    if (pathData.length === 0) {
      extractSVGPaths()
      setTimeout(() => {
        generateParticlesFromSVG()
        setIsAnimating(true)
      }, 100)
    } else {
      generateParticlesFromSVG()
      setIsAnimating(true)
    }
  }

  const stopAnimation = () => {
    setIsAnimating(false)
    setIsReforming(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setParticles([])

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => {
    if (isAnimating) {
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, isReforming])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = 600
      canvas.height = 400
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">SVG Path Particle System</h1>
        <p className="text-slate-300">Particles generated from actual SVG geometry</p>
      </div>

      {/* Hidden SVG for path extraction */}
      <svg
        ref={svgRef}
        className="hidden"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="268px"
        height="320px"
        viewBox="0 0 268 320"
      >
        <g>
          <path
            style={{ opacity: 0.557 }}
            fill="#cd6163"
            d="M 145.5,12.5 C 150.457,13.3569 155.124,13.3569 159.5,12.5C 167.22,16.0223 174.553,20.0223 181.5,24.5C 179.436,24.313 177.436,23.813 175.5,23C 170.841,19.7738 165.841,17.1071 160.5,15C 158.741,14.2025 157.074,14.3691 155.5,15.5C 156.91,16.5695 157.91,17.9028 158.5,19.5C 154.835,18.1581 151.169,16.6581 147.5,15C 146.619,14.2917 145.953,13.4584 145.5,12.5 Z"
          />
        </g>
        <g>
          <path
            style={{ opacity: 1 }}
            fill="#92718c"
            d="M 127.5,10.5 C 127.586,11.4959 127.252,12.3292 126.5,13C 118.627,16.2881 110.96,19.9548 103.5,24C 102.207,24.49 100.873,24.6567 99.5,24.5C 100.574,23.1154 101.907,21.9487 103.5,21C 110.089,19.0388 116.089,16.0388 121.5,12C 123.436,11.187 125.436,10.687 127.5,10.5 Z"
          />
        </g>
        <g>
          <path
            style={{ opacity: 1 }}
            fill="#7479a1"
            d="M 139.5,10.5 C 141.5,11.1667 143.5,11.8333 145.5,12.5C 145.953,13.4584 146.619,14.2917 147.5,15C 151.169,16.6581 154.835,18.1581 158.5,19.5C 163.784,20.9827 168.451,23.4827 172.5,27C 173.793,27.49 175.127,27.6567 176.5,27.5C 177.29,28.7942 178.29,29.9609 179.5,31C 182.881,31.9149 185.881,33.4149 188.5,35.5C 181.022,34.3242 174.356,31.4909 168.5,27C 160.207,22.3647 151.707,18.198 143,14.5C 141.598,13.3551 140.431,12.0217 139.5,10.5 Z"
          />
        </g>
        <g>
          <path
            style={{ opacity: 1 }}
            fill="#ea5755"
            d="M 181.5,24.5 C 183.153,24.6596 184.486,25.3263 185.5,26.5C 185.5,27.8333 185.5,29.1667 185.5,30.5C 183.801,30.6602 182.134,30.4935 180.5,30C 179.529,28.5187 178.196,27.6854 176.5,27.5C 175.127,27.6567 173.793,27.49 172.5,27C 168.451,23.4827 163.784,20.9827 158.5,19.5C 157.91,17.9028 156.91,16.5695 155.5,15.5C 157.074,14.3691 158.741,14.2025 160.5,15C 165.841,17.1071 170.841,19.7738 175.5,23C 177.436,23.813 179.436,24.313 181.5,24.5 Z"
          />
        </g>
      </svg>

      <div className="relative">
        {!isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <img src="/logo.svg" alt="Logo" className="w-64 h-80 opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="border border-slate-600 rounded-lg bg-black/20 backdrop-blur-sm"
          style={{ width: "600px", height: "400px" }}
        />
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isAnimating ? "Exploding..." : "Explode Logo"}
        </button>

        <button
          onClick={reformLogo}
          disabled={!isAnimating || isReforming}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isReforming ? "Reforming..." : "Reform Logo"}
        </button>

        <button
          onClick={stopAnimation}
          disabled={!isAnimating}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Stop & Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-slate-400 text-sm max-w-4xl">
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2">🎯 Path Extraction</h3>
          <p>Particles are generated from actual SVG path coordinates, preserving the logo's geometry</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2">🎨 Color Matching</h3>
          <p>Each particle uses the exact fill color from its corresponding SVG path element</p>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2">🔄 Reform Animation</h3>
          <p>Particles can return to their original positions to reconstruct the logo</p>
        </div>
      </div>

      <div className="text-slate-500 text-xs">
        Paths extracted: {pathData.length} | Active particles: {particles.length}
      </div>
    </div>
  )
}
