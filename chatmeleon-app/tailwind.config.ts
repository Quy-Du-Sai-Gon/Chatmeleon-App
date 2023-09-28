import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lavenderLizard': {
          light: '#d4c9e3',
          DEFAULT: '#503a8f',
          dark: '#2f2465'
        },
        'crimsonCrawler': {
          light: '#e697b0',
          DEFAULT: '#9d143b',
          dark: '#5d0828'
        },
        'sunnySerpent': {
          light: '#ffedb4',
          DEFAULT: '#fed23f',
          dark: '#e18923'
        }
      }
    },
  
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: 'class'
    })
  ],
}
export default config
