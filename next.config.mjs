// const createNextIntlPlugin = require("next-intl/plugin");
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  async redirects(parm) {
    return [
      {
        source:
          "/dashboard/:slug(\\matches-management|player-management|teams-management|games-management)",
        destination: "/dashboard/:slug/add",
        permanent: true,
      },
      {
        source: "/:slug(en|ar)",
        destination: "/:slug/dashboard",
        permanent: true,
      },
      {
        source: "/:locale(en|ar)/dashboard/news/edit",
        destination: "/:locale/dashboard/news",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "51.20.123.246",
      },
      {
        protocol: "https",
        hostname: "51.20.123.246",
      },
      {
        protocol: "https",
        hostname: "www.esports.net",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      // {
      //   protocol: "https",
      //   hostname: "digitalhub.fifa.com",
      //   // port: "8000",
      //   // pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "b1fd0acd5715.ngrok-free.app",
      //   // port: "8000",
      //   // pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "th.bing.com",
      //   // port: "8000",
      //   // pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      //   // port: "8000",
      //   // pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      //   // port: "8000",
      //   // pathname: "/**",
      // },
    ],
  },
};

export default withNextIntl(nextConfig);
// export default nextConfig;
