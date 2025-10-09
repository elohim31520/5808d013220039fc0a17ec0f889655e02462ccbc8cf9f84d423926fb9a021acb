<template>
	<div class="bg-white p-2 shadow-primary">
		<div class="text-lg font-bold mb-4 text-#434343">
			{{ $t('market_breadth.title') }}
		</div>
		<div class="text-base font-bold text-pink-400">{{ marketBreadth }}%</div>
		<v-chart class="chart" :option="chartOption" style="height: 400px" />
	</div>
</template>

<script setup lang="ts">
	import { onMounted, ref, computed } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { PieChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
	import VChart from 'vue-echarts'
	import { stockApi } from '../api/stock'
	import { formatNumber } from '@/modules/util'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
	use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

	const marketBreadth = ref<number>(0)

	async function fetchMarketBreadth() {
		const res = await stockApi.getMarketBreadth()
		if (res.success) {
			if (_isNumber(res.data)) {
				marketBreadth.value = formatNumber(res.data * 100)
			}
		}
	}

	fetchMarketBreadth()

	const chartOption = computed(() => {
		return {
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)',
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: [t('market_breadth.advancers'), t('market_breadth.decliners')],
			},
			series: [
				{
					name: t('market_breadth.advancers'),
					type: 'pie',
					radius: '50%',
					center: ['50%', '60%'],
					color: ['#f472b6', '#FDF3F4'],
					data: [
						{
							value: formatNumber(marketBreadth.value),
							name: t('market_breadth.advancers'),
						},
						{
							value: formatNumber(100 - marketBreadth.value),
							name: t('market_breadth.decliners'),
						},
					],
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
	})
</script>
