<template>
	<div class="p-4 space-y-4">
		<div class="mb-60">
			<TradingviewGadget :symbol="symbol" :disabled="uiStore.isMenuShown" />
		</div>

		<van-notice-bar
			v-if="showNotice"
			left-icon="info-o"
			wrapable
			:scrollable="false"
			type="warning"
			:mode="'closeable'"
			@close="showNotice = false"
		>
			{{ $t('company_metrics.pe_forwards_notice') }}
		</van-notice-bar>

		<template v-if="metrics.length">
			<MultiLineChart
				:title="`${bigSymbol} PE Ratios`"
				:chart-data="metrics"
				x-axis-key="ct"
				:series="[
					{
						name: $t('company_metrics.pe_forwards_title'),
						key: 'fpe',
						color: '#FF5733',
					},
					{
						name: $t('company_metrics.pe_history_title'),
						key: 'pe',
						color: '#00CED1',
					},
				]"
			/>

			<van-notice-bar
				v-if="showNotice"
				left-icon="info-o"
				wrapable
				:scrollable="false"
				type="warning"
				:mode="'closeable'"
				@close="showNotice = false"
			>
				{{ $t('company_metrics.eps_notice') }}
			</van-notice-bar>

			<DualAxisBarChart
				:title="`${bigSymbol} ${$t('company_metrics.eps_comparison')}`"
				:chart-data="metrics"
				x-axis-key="ct"
				first-series-key="feps"
				second-series-key="eps"
				:first-series-name="$t('company_metrics.feps_title')"
				:second-series-name="$t('company_metrics.eps_history_title')"
				firstSeriesColor="#ED6A0C"
				secondSeriesColor="#00CED1"
			/>

			<BarChart
				:title="`${bigSymbol} ${$t('company_metrics.volume_title')}`"
				:chart-data="metrics"
				x-axis-key="ct"
				series-key="v"
			/>
		</template>

		<div v-else>
			<div class="flex-y-center justify-center font-[500] mb-2">
				{{ `${bigSymbol} ${$t('company_metrics.pe_forwards_title')}` }}...
			</div>
			<div class="flex-y-center justify-center text-pink-400" @click="$router.push('/login')">
				{{ $t('company_metrics.login_to_see_data') }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { metricsApi } from '@/api/metrics'
	import { useUIStore } from '@/stores/ui'
	import { HOT_COMPANIES } from '@/constants/hotCompanies'
	import { useUserStore } from '@/stores/user'
	import { toUpper as _toUpper, reverse as _reverse, get as _get } from 'lodash-es'

	const uiStore = useUIStore()
	const router = useRouter()
	const route = useRoute()
	const userStore = useUserStore()

	const symbol = computed(() => {
		return route.params.symbol as string
	})

	const bigSymbol = computed(() => {
		return symbol.value?.toUpperCase()
	})

	const showNotice = ref(true)

	const metrics = ref<any[]>([])

	const getMetrics = async (symbol: string, days: number = 60) => {
		// 只有熱門股票的資料可以不做認證就可以看
		if (!HOT_COMPANIES.includes(_toUpper(symbol)) && !userStore.isLogin) return
		const response = await metricsApi.getStatementBySymbol(symbol, days)
		metrics.value = _reverse(_get(response, 'data', []))
	}

	onMounted(() => {
		getMetrics(symbol.value)
	})
</script>
