import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/cineverse' : undefined,
  images: {
    unoptimized: isGithubPages ? true : undefined,
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'media.themoviedb.org' },
      { protocol: 'https', hostname: 'img.ophim.live' },
    ],
  },
};

export default nextConfig;
