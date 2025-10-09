<template>
	<div class="w-full mx-auto pt-2">
		<van-form ref="formRef" @submit="onSubmit" class="shadow-2xl">
			<van-cell-group class="!rounded-xl overflow-hidden">
				<van-field
					v-model="form.stock_id"
					name="stock_id"
					:label="$t('transaction.stock_id')"
					:placeholder="$t('transaction.enter_stock_id')"
					:rules="[{ required: true, message: $t('transaction.enter_stock_id') }]"
				/>

				<van-field name="transaction_type" :label="$t('transaction.transaction_type')">
					<template #input>
						<van-radio-group v-model="form.transaction_type" direction="horizontal">
							<van-radio name="buy" checked-color="#f472b6">
								<span class="text-green-600">{{ $t('transaction.buy') }}</span>
							</van-radio>
							<van-radio name="sell" checked-color="#f472b6">
								<span class="text-red-600">{{ $t('transaction.sell') }}</span>
							</van-radio>
						</van-radio-group>
					</template>
				</van-field>

				<van-field
					v-model="form.quantity"
					type="digit"
					name="quantity"
					:label="$t('transaction.quantity')"
					:placeholder="$t('transaction.enter_quantity')"
					:rules="[
						{ required: true, message: $t('transaction.enter_quantity') },
						{ pattern: /^[1-9]\d*$/, message: $t('transaction.enter_positive_integer') },
					]"
				/>

				<van-field
					v-model="form.price"
					type="number"
					name="price"
					:label="$t('transaction.price')"
					:placeholder="$t('transaction.enter_price')"
					:rules="[
						{ required: true, message: $t('transaction.enter_price') },
						{ pattern: /^\d+(\.\d{1,2})?$/, message: $t('transaction.enter_correct_price_format') },
					]"
				/>

				<van-field
					v-model="form.transaction_date"
					is-link
					readonly
					name="transaction_date"
					:label="$t('transaction.transaction_date')"
					:placeholder="$t('transaction.select_transaction_date')"
					:rules="[{ required: true, message: $t('transaction.select_transaction_date') }]"
					@click="showDatePicker = true"
				/>
			</van-cell-group>
			<van-popup v-model:show="showDatePicker" position="bottom" round>
				<van-date-picker
					v-model="currentDate"
					:title="$t('transaction.select_transaction_date')"
					:min-date="minDate"
					:max-date="maxDate"
					@confirm="onConfirmDate"
					@cancel="showDatePicker = false"
				/>
			</van-popup>
			<!-- button要放這裡才能讓van-form的驗證生效 -->
			<div class="px-2 py-5">
				<van-button round block type="primary" color="#f472b6" native-type="submit">
					{{ $t('transaction.record') }}
				</van-button>
			</div>

			<!-- TODO: 暫時關閉 -->
			<!-- <div
				class="rounded-30 flex-y-center justify-center text-pink-400 bd-1 border-#f472b6 mt-2 w-95% h-44 mx-auto"
				@click="$router.push('/image-to-json')"
			>
				{{ $t('transaction.upload_screenshot') }}
			</div> -->
		</van-form>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { FormInstance } from 'vant'
	import { transactionApi } from '../api/transaction'
	import emitter from '@/modules/emitter'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { useUserStore } from '@/stores/user'
	import type { TransactionForm } from '@/types/transactions'

	const { t } = useI18n()
	const router = useRouter()
	const userStore = useUserStore()

	const getInitialFormState = (): TransactionForm => ({
		stock_id: '',
		transaction_type: 'buy',
		quantity: '',
		price: '',
		transaction_date: new Date().toISOString().split('T')[0],
	})

	const formRef = ref<FormInstance>()
	const form = ref<TransactionForm>(getInitialFormState())

	const showDatePicker = ref(false)
	const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
	const maxDate = new Date()
	const currentDate = ref(form.value.transaction_date.split('-'))

	const onConfirmDate = ({ selectedValues }: { selectedValues: string[] }) => {
		form.value.transaction_date = selectedValues.join('-')
		showDatePicker.value = false
	}

	const onSubmit = async () => {
		if (!formRef.value) return
		if (!userStore.isLogin) {
			showToast(t('transaction.please_login_first'))
			return
		}

		try {
			await formRef.value?.validate()
			const payload = {
				...form.value,
				quantity: Number(form.value.quantity),
				price: Number(form.value.price),
			}
			await transactionApi.recordMyTransactions(payload)
			showToast({
				type: 'success',
				message: t('transaction.transaction_saved'),
			})

			// 刷新交易紀錄和投資組合頁面
			emitter.emit('refresh', 'records')
			emitter.emit('refresh', 'portfolio')
			form.value = getInitialFormState()
			formRef.value?.resetValidation()
		} catch (error) {
			console.error(error)
			showFailToast(t('transaction.check_input_data'))
		}
	}
</script>
