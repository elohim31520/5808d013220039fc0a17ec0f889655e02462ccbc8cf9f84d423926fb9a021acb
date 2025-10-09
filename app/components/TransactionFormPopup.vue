<template>
	<van-popup v-model:show="show" position="bottom" round>
		<div class="p-2">
			<div class="text-base font-bold mb-4 text-#656565 text-center">
				{{ $t('transaction_form_popup.update_holding') }}
			</div>
			<van-form ref="formRef" @submit="onSubmit">
				<van-cell-group class="!rounded-xl overflow-hidden">
					<van-field
						v-model="form.stock_id"
						name="stock_id"
						:label="$t('transaction.stock_id')"
						:placeholder="$t('transaction.enter_stock_id')"
						:rules="[{ required: true, message: $t('transaction.enter_stock_id') }]"
						readonly
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
							{
								pattern: /^[1-9]\d*$/,
								message: $t('transaction.enter_positive_integer'),
							},
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
							{
								pattern: /^\d+(\.\d{1,2})?$/,
								message: $t('transaction.enter_correct_price_format'),
							},
						]"
					/>

					<van-field
						v-model="form.transaction_date"
						type="date"
						name="transaction_date"
						:label="$t('transaction.transaction_date')"
						:placeholder="$t('transaction.select_transaction_date')"
						:rules="[
							{
								required: true,
								message: $t('transaction.select_transaction_date'),
							},
						]"
					/>
				</van-cell-group>
				<div class="px-2 py-5">
					<van-button round block type="primary" color="#f472b6" native-type="submit">
						{{ $t('transaction.record') }}
					</van-button>
				</div>
			</van-form>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
	import { ref, watch, computed } from 'vue'
	import type { FormInstance } from 'vant'
	import type { PortfolioItem } from '@/types/portfolio'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()

	interface TransactionForm {
		stock_id: string
		transaction_type: 'buy' | 'sell'
		quantity: string
		price: string
		transaction_date: string
	}

	const props = defineProps<{
		modelValue: boolean
		item: PortfolioItem | null
		apiFunction: (payload: any) => Promise<any>
	}>()

	const emit = defineEmits(['update:modelValue', 'submitSuccess'])

	const show = computed({
		get: () => props.modelValue,
		set: (val) => emit('update:modelValue', val),
	})

	const formRef = ref<FormInstance>()
	const form = ref<TransactionForm>({
		stock_id: '',
		transaction_type: 'buy',
		quantity: '',
		price: '',
		transaction_date: new Date().toISOString().split('T')[0],
	})

	watch(
		() => props.item,
		(newItem) => {
			if (newItem) {
				form.value.stock_id = newItem.stock_id
				form.value.transaction_type = 'buy'
				form.value.quantity = ''
				form.value.price = ''
				form.value.transaction_date = new Date().toISOString().split('T')[0]
			}
		}
	)

	const onSubmit = async () => {
		if (!formRef.value) return

		try {
			await formRef.value?.validate()
			const payload = {
				...form.value,
				quantity: Number(form.value.quantity),
				price: Number(form.value.price),
			}
			await props.apiFunction(payload)
			showToast({
				type: 'success',
				message: t('transaction.transaction_saved'),
			})

			emit('submitSuccess')
			show.value = false
		} catch (error) {
			console.error(error)
			showToast({
				type: 'fail',
				message: t('transaction.check_input_data'),
			})
		}
	}
</script>
