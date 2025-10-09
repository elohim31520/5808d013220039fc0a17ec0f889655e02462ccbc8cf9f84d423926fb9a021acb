<template>
	<div class="max-w-800px mx-auto font-sans p-4">
		<h1 class="text-lg font-bold text-center my-4 text-gray-700">{{ $t('image_to_json.title') }}</h1>

		<van-notice-bar left-icon="info-o" wrapable :scrollable="false" type="warning" class="mb-2">
			{{ $t('image_to_json.notice_title') }}
			<br />
			{{ $t('image_to_json.step1') }}
			<br />
			{{ $t('image_to_json.step2') }}
			<br />
			{{ $t('image_to_json.step3') }}
			<br />
			{{ $t('image_to_json.step4') }}
		</van-notice-bar>

		<van-collapse v-model="activeCollapse" inset class="mb-2">
			<van-collapse-item name="1">
				<template #title>
					<div>{{ $t('image_to_json.copy_prompt_title') }}</div>
				</template>
				<template #value>
					<van-button @click.stop="copy(promptText)" type="primary">
						{{ copied ? $t('image_to_json.copied') : $t('image_to_json.copy') }}
					</van-button>
				</template>
				<pre class="text-sm font-mono whitespace-pre-wrap break-all bg-gray-100 p-2 rounded">{{
					promptText.trim()
				}}</pre>
			</van-collapse-item>
		</van-collapse>

		<van-cell-group inset :title="$t('image_to_json.go_to_ai_service')" class="mt-6">
			<van-cell title="ChatGPT" is-link url="https://chat.openai.com/" target="_blank" />
			<van-cell title="Google Gemini" is-link url="https://gemini.google.com/" target="_blank" />
			<van-cell title="Grok (xAI)" is-link url="https://grok.x.ai/" target="_blank" />
		</van-cell-group>

		<van-cell-group inset :title="$t('image_to_json.paste_json_title')" class="mt-6">
			<van-field
				v-model="transactionsJsonString"
				rows="5"
				autosize
				type="textarea"
				:placeholder="$t('image_to_json.paste_json_placeholder')"
			/>
		</van-cell-group>

		<div class="p-4 mt-4">
			<van-button
				@click="submitTransactions"
				:loading="isSubmitting"
				:loading-text="$t('image_to_json.saving')"
				type="success"
				block
				round
			>
				{{ $t('image_to_json.submit_and_save') }}
			</van-button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useClipboard } from '@vueuse/core'
	import { transactionApi } from '@/api/transaction'
	import type { Transaction } from '@/types/transactions'
	import { useI18n } from 'vue-i18n'
	import { useUserStore } from '@/stores/user'

	const { t } = useI18n()

	const userStore = useUserStore()

	const transactionsJsonString = ref('')
	const isSubmitting = ref(false)
	const activeCollapse = ref([])

	const promptText = computed(
		() => `
		${t('image_to_json.prompt_text')}

		${t('image_to_json.json_format_example')}:
		[
			{
				"stock_id": "TSLA",
				"transaction_type": "buy",
				"quantity": 5,
				"price": 200.83,
				"transaction_date": "2024-01-01"
			}
		]
	`
	)
	const { copy, copied } = useClipboard({ source: promptText })

	async function submitTransactions() {
		if (!transactionsJsonString.value) {
			showToast(t('image_to_json.fill_transaction_data'))
			return
		}
		if (!userStore.isLogin) {
			showToast(t('image_to_json.login_first'))
			return
		}

		isSubmitting.value = true
		try {
			const transactions: Transaction[] = JSON.parse(transactionsJsonString.value)
			if (!_isArray(transactions)) {
				throw new Error(t('image_to_json.incorrect_data_format'))
			}

			const promises = transactions.map((tx) => transactionApi.recordMyTransactions(tx))
			await Promise.all(promises)

			showSuccessToast(t('image_to_json.successfully_recorded', { count: transactions.length }))
			transactionsJsonString.value = ''
		} catch (error: any) {
			console.error('Failed to submit transactions:', error)
			let message = t('image_to_json.submission_failed')
			if (error instanceof SyntaxError) {
				message = t('image_to_json.json_format_error')
			} else if (error.message) {
				message = error.message
			}
			showFailToast(message)
		} finally {
			isSubmitting.value = false
		}
	}
</script>
