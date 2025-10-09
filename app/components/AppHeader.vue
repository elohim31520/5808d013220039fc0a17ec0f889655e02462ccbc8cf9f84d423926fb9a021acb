<template>
	<header class="w-100% flex-y-center bg-white h-15 shadow-primary">
		<div
			class="bg-[url('/logo.webp')] bg-no-repeat bg-center bg-contain scale-up"
			style="height: 3.75rem; width: 7rem"
			@click="router.push('/')"
		></div>
		<div @click.prevent="uiStore.showMenu" class="p-2 ml-auto mr-2.5">></div>
	</header>
</template>

<script lang="ts" setup>
	import { useUIStore } from '@/stores/ui'
	import { useRouter } from 'vue-router'

	const uiStore = useUIStore()
	const router = useRouter()
</script>

<style scoped>
	.scale-up {
		background-size: 130%;
	}
</style>
