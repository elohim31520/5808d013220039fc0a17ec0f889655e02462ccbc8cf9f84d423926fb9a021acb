<template>
	<ClientOnly>
		<div class="p-1 bg-white rounded-lg shadow-primary">
			<div class="flex justify-center gap-5 my-5">
				<div
					v-for="day in timeRanges"
					:key="day"
					@click="fetchData(day)"
					:class="[
						'px-2 py-2 rounded-md w-[3rem] text-center',
						selectedDays === day ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
					]"
				>
					{{ $t('momentum_chart.days_unit', { count: day }) }}
				</div>
			</div>
			<div class="h-[400px]">
				<v-chart class="chart" :option="option" autoresize />
			</div>
		</div>
	</ClientOnly>
</template>

<script lang="ts" setup>
	import { ref, onMounted } from 'vue'
	import { use } from 'echarts/core'
	import { CanvasRenderer } from 'echarts/renderers'
	import { BarChart } from 'echarts/charts'
	import { TitleComponent, TooltipComponent, GridComponent, DataZoomComponent } from 'echarts/components'
	import VChart from 'vue-echarts'
	import { marketApi } from '../api/market'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { useUserStore } from '@/stores/user'

	const { t } = useI18n()
	const router = useRouter()
	const userStore = useUserStore()

	use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, DataZoomComponent])

	const timeRanges = [1, 3, 7, 30]
	const selectedDays = ref(1)
	const option = ref({})

	const fetchData = async (days: number): Promise<void> => {
		if (selectedDays.value == days && !_isEmpty(option.value)) {
			// 如果選擇的時間範圍相同且已經初始化時，則不重取api
			return
		}
		if (days != 1 && !userStore.isLogin) {
			router.push('/login')
			return
		}
		selectedDays.value = days
		try {
			const res = await marketApi.getMomentumByRange(days)
			if (!res.success) return
			const data = res.data
			//ct: createdAt 為了省流量，後端key直接簡寫	，v: volume
			const dates = data.map((item: any) => item.ct)
			const volumes = data.map((item: any) => item.v)

			option.value = {
				title: {
					text: t('momentum_chart.title', { days }),
					left: 'center',
				},
				tooltip: {
					trigger: 'axis',
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'category',
					data: dates,
				},
				yAxis: {
					type: 'value',
				},
				series: [
					{
						data: volumes,
						type: 'bar',
						itemStyle: {
							color: '#f472b6',
							borderRadius: [4, 4, 0, 0],
						},
						animationDelay: function (idx: number) {
							// 根據當前選擇的天數動態調整延遲時間
							const days = selectedDays.value
							const baseDelay = days >= 30 ? 2 : days >= 7 ? 10 : 50
							return idx * baseDelay
						},
						animationDelayUpdate: function (idx: number) {
							const days = selectedDays.value
							const baseDelay = days >= 30 ? 2 : days >= 7 ? 10 : 50
							return idx * baseDelay
						},
					},
				],
				animation: true,
				animationDuration: 1000,
				animationEasing: 'cubicOut',
			}
		} catch (error) {
			console.error(`Failed to fetch ${days}-day momentum data:`, error)
		}
	}

	onMounted(() => {
		fetchData(selectedDays.value)
	})
</script>
