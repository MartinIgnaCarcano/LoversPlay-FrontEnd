/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out", // Carpeta de salida
  basePath: "", // Vacío para dominio raíz
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
}

export default nextConfig