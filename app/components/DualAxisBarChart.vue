<template>
	<div class="chart-container">
		<div class="flex-y-center justify-center font-[500] mb-1">
			{{ title }}
		</div>
		<div ref="chartRef" style="width: 100%; height: 400px"></div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue'
	import * as echarts from 'echarts'
	import type { EChartsOption, BarSeriesOption } from 'echarts'

	interface Props {
		title: string
		chartData: any[]
		xAxisKey: string
		firstSeriesKey: string
		secondSeriesKey: string
		firstSeriesName?: string
		secondSeriesName?: string
		firstSeriesColor?: string
		secondSeriesColor?: string
	}

	const props = withDefaults(defineProps<Props>(), {
		firstSeriesName: '',
		secondSeriesName: '',
		firstSeriesColor: '#5470c6',
		secondSeriesColor: '#91cc75',
	})

	const chartRef = ref<HTMLElement>()
	let chart: echarts.ECharts | null = null

	const initChart = () => {
		if (!chartRef.value) return

		chart = echarts.init(chartRef.value)
		updateChart()
	}

	const updateChart = () => {
		if (!chart) return

		const xAxisData = props.chartData.map((item) => item[props.xAxisKey])
		const firstSeriesData = props.chartData.map((item) => item[props.firstSeriesKey])
		const secondSeriesData = props.chartData.map((item) => item[props.secondSeriesKey])

		const option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
				},
			},
			grid: {
				right: '20%',
			},
			legend: {
				data: [props.firstSeriesName || props.firstSeriesKey, props.secondSeriesName || props.secondSeriesKey],
			},
			xAxis: [
				{
					type: 'category',
					data: xAxisData,
					axisPointer: {
						type: 'shadow',
					},
				},
			],
			yAxis: [
				{
					type: 'value',
					name: props.firstSeriesName || props.firstSeriesKey,
					position: 'left',
				},
				{
					type: 'value',
					name: props.secondSeriesName || props.secondSeriesKey,
					position: 'right',
				},
			],
			series: [
				{
					name: props.firstSeriesName || props.firstSeriesKey,
					type: 'bar',
					data: firstSeriesData,
					itemStyle: {
						color: props.firstSeriesColor,
					},
				},
				{
					name: props.secondSeriesName || props.secondSeriesKey,
					type: 'bar',
					yAxisIndex: 1,
					data: secondSeriesData,
					itemStyle: {
						color: props.secondSeriesColor,
					},
				},
			],
		}

		chart.setOption(option)
	}

	watch(
		() => props.chartData,
		() => {
			updateChart()
		},
		{ deep: true }
	)

	onMounted(() => {
		initChart()
	})

	// 處理組件銷毀時的清理
	onBeforeUnmount(() => {
		if (chart) {
			chart.dispose()
			chart = null
		}
	})

	// 處理視窗大小變化
	window.addEventListener('resize', () => {
		chart?.resize()
	})
</script>

<style scoped>
	.chart-container {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>
