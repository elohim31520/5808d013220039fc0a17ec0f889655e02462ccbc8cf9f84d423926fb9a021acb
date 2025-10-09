<template>
	<div class="p-2">
		<div v-for="symbol in allSymbols" :key="symbol">
			<div :ref="(el) => setChartRef(el, symbol)" class="min-h-[420px]">
				<LineChart
					v-if="metrics[symbol].length"
					:title="`${symbol} ${$t('company_metrics.pe_forwards_title')}`"
					:chart-data="metrics[symbol]"
					x-axis-key="ct"
					series-key="fpe"
				/>
				<div v-else class="flex-y-center justify-center h-420">Loading {{ symbol }}...</div>
			</div>
		</div>
		<HotCompanies />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, reactive, ref } from 'vue'
	import { useIntersectionObserver } from '@vueuse/core'
	import { metricsApi } from '@/api/metrics'
	import LineChart from '@/components/LineChart.vue'
	import HotCompanies from '@/components/HotCompanies.vue'

	const metrics = reactive({
		TSLA: [] as any[],
		NVDA: [] as any[],
		MSFT: [] as any[],
		GOOG: [] as any[],
		AMZN: [] as any[],
		PLTR: [] as any[],
	})

	const allSymbols = Object.keys(metrics) as (keyof typeof metrics)[]

	const getMetrics = async (symbol: keyof typeof metrics, days: number = 60) => {
		if (metrics[symbol].length > 0) return
		const response = await metricsApi.getStatementBySymbol(symbol, days)
		metrics[symbol] = _reverse(_get(response, 'data', []))
	}

	const chartRefs = ref<Record<string, HTMLElement | null>>({})
	const setChartRef = (el: Element | ComponentPublicInstance | null, symbol: keyof typeof metrics) => {
		if (el instanceof HTMLElement) {
			chartRefs.value[symbol] = el
		}
	}

	onMounted(() => {
		allSymbols.forEach((symbol) => {
			const target = chartRefs.value[symbol]
			if (!target) return

			const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
				if (isIntersecting) {
					getMetrics(symbol)
					stop()
				}
			})
		})
	})
</script>
