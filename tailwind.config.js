const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app/app.vue",
  ],
  theme: {
    // 您在 UnoCSS 中定義的 'pc' breakpoint 需要在這裡合併或替換
    screens: {
      'pc': '480px', // 自定義 breakpoint
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // 2. 轉換動畫 (bg-skeleton)
      keyframes: {
        gray: {
          '0%': { 'background-color': '#e5e7eb' },
          '100%': { 'background-color': '#f3f4f6' },
        }
      },
      animation: {
        gray: 'gray 1s ease-in-out infinite alternate forwards',
      },
      // 3. 轉換 max-w-480px (w-full-limited 快捷方式用)
      maxWidth: {
        '480px': '480px', // 定義 max-w-480px 
      },
      // 4. 轉換 shadow-primary
      shadow: {
        'primary': '0 0 1rem 0 #0000001A',
      }
    },
  },
  plugins: [
    // 5. 轉換 truncate-x-lines 規則
    plugin(function({ addUtilities }) {
      const newUtilities = {
        // Tailwind 已經內建了 truncate，但您的規則更詳細
        // 您可以創建一個名為 'truncate-lines-x' 的工具類
        '.truncate-lines-3': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'normal',
          'word-break': 'break-all',
        },
      }
      addUtilities(newUtilities)
    }),
    // 6. 處理複雜的 border 規則 (b(t|r|b|l|d)) - 這個會非常複雜，建議用 Tailwind 內建的
  ],
}