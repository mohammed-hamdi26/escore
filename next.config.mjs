/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source:
          "/dashboard/:slug(\\matches-management|player-management|teams-management|games-management|users|support-center)",
        destination: "/dashboard/:slug/add",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
