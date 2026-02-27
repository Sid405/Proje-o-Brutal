/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite chamadas à OpenAI API (servidor)
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
}

module.exports = nextConfig
