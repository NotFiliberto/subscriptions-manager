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
        ],
        domains: ["subscription-manager.notfiliberto.xyz"],
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
