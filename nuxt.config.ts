const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID
console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: [
		'@vant/nuxt',
		'@nuxtjs/tailwindcss',
		'nuxt-echarts',
		'@pinia/nuxt',
		'@nuxtjs/i18n',
		'@vueuse/nuxt',
		'./modules/nuxt4-lodash',
		[
			'nuxt-vue3-google-signin',
			{
				clientId: GOOGLE_CLIENT_ID,
			},
		],
	],
	i18n: {
		locales: [
			{ code: 'en', file: 'en.json', language: 'en-US' },
			{ code: 'zh', file: 'zh-TW.json', language: 'zh-TW' },
		],
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
	},
	devServer: {
		port: 5177,
	},
	vant: {
		lazyload: true,
		importStyle: true,
	},
	lodash4: {
		prefix: '_',
		upperAfterPrefix: false,
	},
	// css: ['~/assets/css/main.css'],
	vite: {
		vue: {
			script: {
				defineModel: true,
			},
		},
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				module: 'esnext',
			},
		},
	},
	css: ['./app/assets/main.css'],
	nitro: {
		preset: 'cloudflare_pages',
	},
})
