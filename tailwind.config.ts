import type { Config } from "tailwindcss"
const defaultTheme = require("tailwindcss/defaultTheme")

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",

        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
        "./node_modules/react-tailwindcss-select/dist/index.esm.js",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("tailwindcss-debug-screens"),
    ],
    darkMode: "class",
} satisfies Config
