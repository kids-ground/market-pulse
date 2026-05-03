import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:      '#F2F4F6',
        card:    '#FFFFFF',
        'card-2': '#F7F8FA',
        t1:      '#191F28',
        t2:      '#6B7684',
        t3:      '#ADB5BD',
        green:   '#12B76A',
        blue:    '#3B7FE8',
        red:     '#E53E4D',
        accent:  '#3182F6',
      },
      fontFamily: {
        sans:  ['var(--font-inter)', 'var(--font-noto)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        noto:  ['var(--font-noto)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
