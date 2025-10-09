<template>
	<van-popup
		:show="uiStore.isMenuShown"
		@update:show="uiStore.isMenuShown = $event"
		position="left"
		:style="{ width: '80%', height: '100%' }"
		z-index="99"
	>
		<div class="pt-5">
			<nav class="flex flex-col space-y-15">
				<template v-for="item in menuItems" :key="item.to">
					<NuxtLink
						v-if="
							item.auth === 'always' ||
							(item.auth === 'auth' && userStore.isLogin) ||
							(item.auth === 'guest' && !userStore.isLogin)
						"
						:to="item.to"
						@click="closeMenu"
						class="flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
						active-class="text-pink-400"
					>
						<SvgIcon :name="item.icon" size="1.2rem" class="mr-5" />
						<span class="text-xl">{{ $t(item.text) }}</span>
					</NuxtLink>
				</template>
				<div
					v-if="userStore.isLogin"
					@click="logout"
					class="flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
					active-class="text-pink-400"
				>
					<SvgIcon name="icon_quit" size="1.2rem" class="mr-5" />
					<span class="text-xl">{{ $t('sidemenu.logout') }}</span>
				</div>
			</nav>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
	import { removeToken } from '@/modules/auth'
	import { useUIStore } from '@/stores/ui'
	import { useRouter } from 'vue-router'
	import { useUserStore } from '@/stores/user'

	const router = useRouter()
	const uiStore = useUIStore()
	const userStore = useUserStore()

	const menuItems = [
		{ to: '/', icon: 'icon_settings_Name2', text: 'sidemenu.home', auth: 'always' },
		{ to: '/about', icon: 'icon_settings_about_us', text: 'sidemenu.about', auth: 'always' },
		{ to: '/add-transaction', icon: 'icon_menu_Opinion', text: 'sidemenu.add_record', auth: 'always' },
		{ to: '/records', icon: 'money', text: 'sidemenu.my_records', auth: 'always' },
		{
			to: '/portfolio',
			icon: 'icon_gift',
			text: 'sidemenu.my_portfolio',
			auth: 'always',
		},
		{
			to: '/companies',
			icon: 'icon_menu_Query',
			text: 'sidemenu.stock_list',
			auth: 'always',
		},
		{
			to: '/m7',
			icon: 'side-bar-no1',
			text: 'sidemenu.hot_stocks',
			auth: 'always',
		},
		{ to: '/market-metrics', icon: 'media', text: 'sidemenu.market_indicators', auth: 'always' },
		{ to: '/volatile-stock', icon: 'icon_ghost', text: 'sidemenu.todays_volatility', auth: 'always' },
		{ to: '/login', icon: 'icon_user2', text: 'sidemenu.login', auth: 'guest' },
		{ to: '/register', icon: 'icon_settings_invite', text: 'sidemenu.register', auth: 'guest' },
	]

	const closeMenu = () => {
		uiStore.hideMenu()
	}

	const logout = () => {
		removeToken()
		closeMenu()
		router.push('/login').then(() => {
			window.location.reload()
		})
	}
</script>

<style scoped lang="scss"></style>
