import type { NextConfig } from "next";

// ─── Lê domínios e IPs do .env ────────────────────────────────────────────────
const rawDomains = process.env.ALLOWED_DOMAINS ?? "localhost";
const rawIPs = process.env.ALLOWED_IPS ?? "127.0.0.1,::1";

const allowedDomains = rawDomains.split(",").map((d) => d.trim()).filter(Boolean);
const allowedIPs = rawIPs.split(",").map((ip) => ip.trim()).filter(Boolean);

const allAllowedHosts = [...allowedDomains, ...allowedIPs];

const allowedOrigins = allAllowedHosts
  .flatMap((host) => [`https://${host}`, `http://${host}`])
  .join(" ");

// ─── remotePatterns para next/image ───────────────────────────────────────────
const imageRemotePatterns: NextConfig["images"] = {
  remotePatterns: allAllowedHosts.map((host) => ({
    protocol: "https",
    hostname: host,
    port: "",
    pathname: "/**",
  })),
};

// ─── Configuração principal ────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  // Fixa o root do Turbopack para evitar conflito com package.json da pasta pai
  turbopack: {
    root: __dirname,
  },

  // Libera HMR / dev resources para IPs e domínios da rede local
  allowedDevOrigins: allAllowedHosts,

  images: imageRemotePatterns,

  async headers() {
    return [
      {
        // Aplica os headers em todas as rotas
        source: "/(.*)",
        headers: [
          // ── Content-Security-Policy ────────────────────────────────────
          {
            key: "Content-Security-Policy",
            value: [
              `default-src 'self'`,
              `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
              `font-src 'self' https://fonts.gstatic.com`,
              `img-src 'self' data: blob: ${allowedOrigins}`,
              `connect-src 'self' ${allowedOrigins}`,
              `frame-ancestors 'none'`,
            ].join("; "),
          },
          // ── CORS ───────────────────────────────────────────────────────
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          // ── Segurança adicional ────────────────────────────────────────
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
