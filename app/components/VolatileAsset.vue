<template>
	<van-tabs v-model:active="activeTab" type="card" class="p-2" color="#f472b6">
		<van-tab :title="$t('volatile_asset.strong_stocks')">
			<div class="grid grid-cols-1 gap-1 px-1 mt-2">
				<div>
					<ul>
						<li v-for="(stock, index) in winners" :key="index" class="flex items-center py-5 px-2 shadow-primary gap-1">
							<SvgIcon name="icon_ghost" size="2.5rem" />
							<span class="text-gray-600">{{ stock.name }}</span>
							<span class="text-green-600 ml-auto">{{ stock.chg }}%</span>
						</li>
					</ul>
				</div>
			</div>
		</van-tab>

		<van-tab :title="$t('volatile_asset.weak_stocks')">
			<div class="grid grid-cols-1 gap-1 px-1 my-2">
				<ul>
					<li v-for="(stock, index) in losers" :key="index" class="flex items-center py-5 px-2 shadow-primary gap-1">
						<SvgIcon name="icon_ghost" size="2.5rem" />
						<span class="text-gray-600">{{ stock.name }}</span>
						<span class="text-red-500 ml-auto">{{ stock.chg }}%</span>
					</li>
				</ul>
			</div>
		</van-tab>
	</van-tabs>
</template>

<script lang="ts" setup>
	import { ref, onMounted, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import { stockApi } from '../api/stock'

	const winners = ref<any[]>([])
	const losers = ref<any[]>([])
	const activeTab = ref(0)
	const router = useRouter()

	onMounted(async () => {
		const winnersRes = await stockApi.getStockWinners()
		winners.value = winnersRes.data
	})

	watch(activeTab, async (newTab) => {
		// 省流：如果弱勢股沒有資料，再獲取弱勢股資料
		if (newTab === 1 && losers.value.length === 0) {
			const losersRes = await stockApi.getStockLosers()
			losers.value = _reverse(losersRes.data)
		}
	})
</script>
