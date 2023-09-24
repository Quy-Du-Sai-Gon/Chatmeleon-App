import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparant: 'transparant',
      white: '#ffffff',
      black: '#000000',
      'lavenderLizard': {
        light: '#d4c9e3',
        DEFAULT: '#503a8f',
        dark: '#2f2465'
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: 'class'
    })
  ],
}
export default config
