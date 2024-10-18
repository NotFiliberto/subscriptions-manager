/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tailwindui.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: "https",
                hostname: "subscription-manager.notfiliberto.xyz",
                port: '',
                pathname: "**"
            }
        ],
        dangerouslyAllowSVG: true
    },
    webpack: (config) => {
        config.experiments = config.experiments || {}
        config.experiments.topLevelAwait = true
        return config
    },
    output: "standalone"
}

module.exports = nextConfig
