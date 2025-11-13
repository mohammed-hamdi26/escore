// const createNextIntlPlugin = require("next-intl/plugin");
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects(parm) {
    console.log(parm);
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
};

export default withNextIntl(nextConfig);
// export default nextConfig;
