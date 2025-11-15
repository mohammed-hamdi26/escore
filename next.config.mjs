// const createNextIntlPlugin = require("next-intl/plugin");
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects(parm) {
    // console.log(parm);
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
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d421d3a6bcd2.ngrok-free.app",
        // port: "8000",
        // pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
// export default nextConfig;
