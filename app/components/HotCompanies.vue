<template>
	<div class="space-y-4 p-2">
		<div class="text-xl font-bold text-#434343 mb-2">
			{{ $t('hot_companies.explore_hot_companies') }}
		</div>
		<div class="grid grid-cols-3 gap-5 mb-5 mx-2">
			<div
				v-for="company in companies"
				:key="company.id"
				@click="handleClick(company.id)"
				class="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
			>
				<img
					:src="`/hot/${company.id}.webp`"
					class="h-full w-full transition-transform duration-300 group-hover:scale-110 object-cover bg-#fff"
				/>
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				></div>
				<div
					class="absolute bottom-0 left-0 w-full p-4 transform-gpu translate-y-4 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
				>
					<div class="text-base font-bold uppercase tracking-wider text-white">
						{{ company.id }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const companies = ref([
		{ id: 'tsla' },
		{ id: 'nvda' },
		{ id: 'pltr' },
		{ id: 'amzn' },
		{ id: 'goog' },
		{ id: 'meta' },
		{ id: 'msft' },
	])

	const router = useRouter()

	const handleClick = (symbol: string) => {
		router.push(`/company-metrics/${symbol}`)
	}
</script>
