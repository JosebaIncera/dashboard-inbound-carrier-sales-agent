/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    // Disable static generation for pages that need runtime environment variables
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
}

module.exports = nextConfig