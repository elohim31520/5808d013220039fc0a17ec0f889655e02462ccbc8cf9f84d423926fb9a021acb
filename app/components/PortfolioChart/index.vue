<template>
	<div v-if="chartOptions" class="w-full h-450px">
		<v-chart :option="chartOptions" autoresize />
	</div>
	<div v-else class="text-center text-gray-500 pt-2">正在載入資料或無持股...</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { PieChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
	import VChart from 'vue-echarts'
	import type { EChartsOption } from 'echarts'
	import { usePortfolioStore } from '@/stores/portfolio'
	import { formatNumber } from '@/modules/util'

	const portfolioStore = usePortfolioStore()

	use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

	defineOptions({
		name: 'PortfolioChart',
	})

	const chartOptions = ref<EChartsOption | null>(null)

	const setChartOptions = () => {
		const data = portfolioStore.portfolioData
		if (!data || data.length === 0) {
			chartOptions.value = null
			return
		}
		chartOptions.value = {
			title: {
				text: '投資組合佔比',
				left: 'center',
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)',
			},
			legend: {
				orient: 'horizontal',
				bottom: '5%',
				left: 'center',
				data: data.map((item) => item.stock_id),
			},
			series: [
				{
					name: '持股價值',
					type: 'pie',
					radius: ['35%', '60%'],
					center: ['50%', '40%'],
					data: data.map((item) => ({
						name: item.stock_id,
						value: formatNumber(item.quantity * item.avg),
					})),
					label: {
						show: true,
						formatter: '{b}\n({d}%)',
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
			],
		}
	}

	onMounted(() => {
		setChartOptions()
	})

	watch(
		() => portfolioStore.portfolioData,
		() => {
			setChartOptions()
		},
		{ deep: true }
	)

	defineExpose({
		setChartOptions,
	})
</script>
