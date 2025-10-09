<template>
	<div class="bg-gray-50">
		<div class="mx-2 bg-white p-2 rounded-15 shadow-lg">
			<h1 class="text-[24px] font-bold mb-2 text-gray-800">{{ $t('records.transaction_records') }}</h1>
			<Waterfall ref="waterfallRef" :apiFunction="transactionApi.getAllTransactions">
				<template #default="{ list }">
					<van-swipe-cell
						v-for="item in list"
						:key="item.id"
						:right-width="65"
						:left-width="65"
						@close="(details) => onClose(details, item)"
					>
						<div class="mb-4 rounded-lg p-4 transition-shadow duration-300 hover:shadow-md">
							<div class="flex justify-between items-start mb-3">
								<div>
									<span class="text-[14px] text-gray-500">{{ $t('records.stock_id') }}</span>
									<p class="font-semibold text-[18px] text-gray-900">{{ item.stock_id }}</p>
								</div>
								<span
									:class="[
										'px-3 py-1 rounded-full text-[12px] font-semibold tracking-wide',
										item.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
									]"
								>
									{{ item.type === 'buy' ? $t('records.buy') : $t('records.sell') }}
								</span>
							</div>

							<div class="grid grid-cols-2 gap-1 text-[14px] mb-3">
								<div>
									<span class="text-gray-500">{{ $t('records.quantity') }}</span>
									<p class="text-gray-800">{{ item.quantity }}</p>
								</div>
								<div>
									<span class="text-gray-500">{{ $t('records.price') }}</span>
									<p class="text-gray-800">{{ item.price }}</p>
								</div>
							</div>

							<div class="text-right text-[12px] text-gray-400">
								{{ format(item.date, 'yyyy-MM-dd') }}
							</div>
						</div>
						<template #left>
							<div class="h-full flex items-center justify-center bg-pink-400 text-white w-65px">
								{{ $t('records.update') }}
							</div>
						</template>
						<template #right>
							<div class="h-full flex items-center justify-center bg-red-500 text-white w-65px">
								{{ $t('records.delete') }}
							</div>
						</template>
					</van-swipe-cell>
				</template>
			</Waterfall>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, useTemplateRef } from 'vue'
	import { transactionApi } from '../api/transaction'
	import { showConfirmDialog } from 'vant'
	import { format } from 'date-fns'
	import Waterfall from '@/components/Waterfall/index.vue'
	import { useI18n } from 'vue-i18n'
	import type { Transaction } from '@/types/transactions'

	const { t } = useI18n()

	defineOptions({
		name: 'records',
	})

	const waterfallRef = useTemplateRef<InstanceType<typeof Waterfall>>('waterfall')

	const onClose = (details: any, item: Transaction) => {
		const { position, instance } = details
		switch (position) {
			case 'left':
			case 'cell':
				break
			case 'right':
				showConfirmDialog({
					title: t('records.confirm_title'),
					message: t('records.confirm_delete_message'),
				})
					.then(() => {
						if (item.id) {
							return transactionApi.deleteTransaction(item.id)
						}
					})
					.then(() => {
						waterfallRef.value?.refresh()
					})
				break
		}
	}
</script>

<style scoped>
	.van-swipe-cell {
		border-bottom: 1px solid #f5f5f5;
		padding-top: 10px;
	}
</style>
