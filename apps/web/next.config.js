/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@ikigai/shared'],
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const destination = apiUrl.startsWith('http') ? apiUrl : `http://${apiUrl}`;

        return [
            {
                source: '/api/:path*',
                destination: `${destination}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
