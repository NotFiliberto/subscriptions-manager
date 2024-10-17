namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: "development" | "production"
        NEXTAUTH_SECRET: string
        DASHBOARD_USER: string
        DASHBOARD_PASSWORD: string
        NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS: string //must prefix with NEXT_PUBLIC in order to be able to access the env variable from components
        OUTLOOK_EMAIL_PASSWORD: string
        LOG_LEVEL: string
        LOG_DIR: string
        RENDER_INTERNAL_HOSTNAME: string
        PORT: number
    }
}
