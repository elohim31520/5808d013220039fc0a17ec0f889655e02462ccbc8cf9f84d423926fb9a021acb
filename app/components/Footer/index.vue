<template>
	<div class="bg-white w-full-limited fixed left-0 bottom-0 z-50 grid cols-5 px-2.5">
		<div class="grid grid-cols-5 w-[100vw]">
			<div
				v-for="(tab, index) in tabItems"
				:key="index"
				class="flex-center flex-col py-1"
				:class="{
					'bg-gradient-to-r from-[#EC09F8] to-[#B732FF] bg-clip-text text-transparent': activeTab === tab.name,
				}"
				@click="handleClick(tab.to)"
			>
				<SvgIcon size="1.5rem" :name="activeTab === tab.name ? tab.activeIcon : tab.defaultIcon" class="mb-0.5" />
				<span class="text-xs">
					{{ $t(tab.label) }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'

	import SvgIcon from '@/components/SvgIcon/index.vue'

	const route = useRoute()
	const router = useRouter()

	const activeTab = computed(() => {
		return (route.name as string) || 'index'
	})

	const tabItems = [
		{
			name: 'index',
			label: 'footer.home',
			defaultIcon: 'icon_voice',
			activeIcon: 'icon_voice_a',
			to: '/',
		},
		{
			name: 'portfolio',
			label: 'footer.portfolio',
			defaultIcon: 'icon_gift',
			activeIcon: 'icon_gift_a',
			to: '/portfolio',
		},
		{
			name: 'add-transaction',
			label: 'footer.record',
			defaultIcon: 'icon_follow2',
			activeIcon: 'icon_follow',
			to: '/add-transaction',
		},
		{
			name: 'info',
			label: 'footer.info',
			defaultIcon: 'icon_message',
			activeIcon: 'icon_message_a',
			to: '/info',
		},
		{
			name: 'my',
			label: 'footer.my',
			defaultIcon: 'icon_user',
			activeIcon: 'icon_user_a',
			to: '/my',
		},
	]

	const handleClick = (to: string) => {
		// TODO: 同路由不跳轉
		router.push(to)
	}
</script>
