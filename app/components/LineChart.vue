<template>
	<v-chart class="chart" :style="{ height }" :option="option" autoresize />
</template>

<script setup lang="ts">
	import { computed, provide } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { LineChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
	import VChart, { THEME_KEY } from 'vue-echarts'
	import type { EChartsOption } from 'echarts'

	use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

	provide(THEME_KEY, '#fff')

	const {
		title,
		lineColor,
		chartData,
		height = '400px',
		smooth = true,
		xAxisKey,
		seriesKey,
	} = defineProps<{
		title: string
		lineColor?: string
		chartData: any[]
		height?: string
		smooth?: boolean | number
		xAxisKey?: string
		seriesKey?: string
	}>()

	const xAxisData = computed(() => {
		return chartData.map((item) => new Date(item[xAxisKey as keyof typeof item]).toLocaleDateString())
	})

	const seriesData = computed(() => {
		return chartData.map((item) => parseFloat(item[seriesKey as keyof typeof item]))
	})

	const option = computed<EChartsOption>(() => ({
		title: {
			text: title,
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		xAxis: {
			type: 'category',
			data: xAxisData.value,
		},
		yAxis: {
			type: 'value',
			scale: true,
		},
		series: [
			{
				type: 'line',
				smooth,
				data: seriesData.value,
				itemStyle: {
					color: lineColor || '#f472b6',
				},
			},
		],
	}))
</script>
