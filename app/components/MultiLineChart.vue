<template>
	<div class="w-full h-450" :style="{ height }">
		<v-chart v-if="chartData.length" class="w-full h-450" :option="option" autoresize />
	</div>
</template>

<script setup lang="ts">
	import { computed, provide, nextTick, onMounted } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { LineChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
	import VChart, { THEME_KEY } from 'vue-echarts'
	import type { EChartsOption, LineSeriesOption } from 'echarts'

	use([CanvasRenderer, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

	provide(THEME_KEY, '#fff')

	interface Series {
		name: string
		key: string
		color?: string
	}

	const props = defineProps<{
		title: string
		chartData: any[]
		height?: string
		smooth?: boolean | number
		xAxisKey: string
		series: Series[]
	}>()

	const xAxisData = computed(() => {
		return props.chartData.map((item) => new Date(item[props.xAxisKey]).toLocaleDateString())
	})

	const seriesData = computed<LineSeriesOption[]>(() => {
		return props.series.map((series) => ({
			name: series.name,
			type: 'line',
			smooth: props.smooth,
			data: props.chartData.map((item) => parseFloat(item[series.key])),
			itemStyle: {
				color: series.color || '#f472b6',
			},
		}))
	})

	const option = computed<EChartsOption>(() => ({
		title: {
			text: props.title,
			left: 'center',
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: props.series.map((s) => s.name),
			top: 30,
		},
		xAxis: {
			type: 'category',
			data: xAxisData.value,
		},
		yAxis: {
			type: 'value',
			scale: true,
		},
		series: seriesData.value,
	}))
</script>
