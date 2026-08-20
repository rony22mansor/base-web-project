import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = BASE_PATH ? `/${BASE_PATH}` : undefined;

const nextConfig: NextConfig = {
  output: "standalone",

  ...(basePath && { basePath }),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.shamlogix.tech",
        pathname: `${basePath ?? ""}/**`,
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },

  async redirects() {
    if (!basePath) {
      return [
        {
          source: "/",
          destination: "/ar",
          permanent: false,
        },
      ];
    }

    return [
      {
        source: basePath,
        destination: `${basePath}/ar`,
        basePath: false,
        permanent: false,
      },
      {
        source: "/",
        destination: `${basePath}/ar`,
        basePath: false,
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/core/i18n/request.ts");
export default withNextIntl(nextConfig);
