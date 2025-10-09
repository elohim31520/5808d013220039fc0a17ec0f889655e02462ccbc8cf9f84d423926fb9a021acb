<template>
	<van-popup v-model:show="show" position="bottom" round>
		<div class="p-2">
			<div class="text-base font-bold mb-4 text-#656566 text-center">
				{{ isUpdateMode ? $t('update_usd_form_popup.update_title') : $t('update_usd_form_popup.add_title') }}
			</div>
			<van-form ref="formRef" @submit="onSubmit">
				<van-cell-group class="!rounded-xl overflow-hidden">
					<van-field
						v-model="form.balance"
						type="number"
						name="balance"
						:label="$t('update_usd_form_popup.usd_balance_label')"
						:placeholder="$t('update_usd_form_popup.usd_balance_placeholder')"
						:rules="[
							{
								required: true,
								message: $t('update_usd_form_popup.usd_balance_placeholder'),
							},
							{
								pattern: /^\d+(\.\d{1,2})?$/,
								message: $t('update_usd_form_popup.correct_format_required'),
							},
						]"
					/>
				</van-cell-group>
				<div class="px-2 py-5">
					<van-button round block type="primary" color="#f472b6" native-type="submit">
						{{ isUpdateMode ? $t('update_usd_form_popup.update_button') : $t('update_usd_form_popup.add_button') }}
					</van-button>
				</div>
			</van-form>
		</div>
	</van-popup>
</template>

<script setup lang="ts">
	import { ref, watch, computed } from 'vue'
	import type { FormInstance } from 'vant'
	import { balancesApi } from '@/api/balances'
	import { useBalanceStore } from '@/stores/balance'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
	const balanceStore = useBalanceStore()

	interface BalanceForm {
		balance: string
	}

	const props = defineProps<{
		modelValue: boolean
	}>()

	const emit = defineEmits(['update:modelValue', 'submitSuccess'])

	const show = computed({
		get: () => props.modelValue,
		set: (val) => emit('update:modelValue', val),
	})

	const usdInfo = computed(() => balanceStore.usdInfo)
	const isUpdateMode = computed(() => !!usdInfo.value)

	const formRef = ref<FormInstance>()
	const form = ref<BalanceForm>({
		balance: '0',
	})

	watch(
		usdInfo,
		(newItem) => {
			if (newItem) {
				form.value.balance = String(_get(newItem, 'balance'))
			} else {
				form.value.balance = '0'
			}
		},
		{ immediate: true }
	)

	const onSubmit = async () => {
		if (!formRef.value) return

		try {
			await formRef.value?.validate()
			if (+_get(form.value, 'balance') === +balanceStore.usdBalance) {
				showFailToast(t('update_usd_form_popup.enter_balance_to_update'))
				return
			}
			const payload = {
				balance: Number(form.value.balance),
			}
			if (isUpdateMode.value) {
				await balancesApi.updateMyBalances(payload)
			} else {
				await balancesApi.createMyBalances(payload)
			}
			showToast({
				type: 'success',
				message: isUpdateMode.value
					? t('update_usd_form_popup.update_success')
					: t('update_usd_form_popup.add_success'),
			})

			await balanceStore.fetchMyBalance()
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
