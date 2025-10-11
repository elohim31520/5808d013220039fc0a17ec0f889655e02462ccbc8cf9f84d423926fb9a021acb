<template>
	<div class="min-h-screen flex flex-col max-w-[480px] mx-auto bg-gray-100 pb-[6rem]">
		<AppHeader class="mb-2" v-if="showHeader" />

		<SideMenu />

		<main class="flex-grow">
			<NuxtRouteAnnouncer />
			<NuxtPage />
		</main>

		<Footer />
	</div>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	const route = useRoute()

	const showHeader = computed(() => {
		if (['/my', '/my/'].includes(route.path)) return false
		return true
	})
</script>
