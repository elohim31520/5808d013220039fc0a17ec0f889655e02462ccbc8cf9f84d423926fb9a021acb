<template>
	<div class="tradingview-widget-container" :class="{ 'pointer-events-none': props.disabled }">
		<div id="tradingview_12345" class="w-full h-full"></div>
		<div class="tradingview-widget-copyright">
			<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
				<span class="blue-text">Track all markets on TradingView</span>
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { onMounted } from 'vue'

	const props = defineProps<{
		symbol: string
		disabled?: boolean
	}>()

	onMounted(() => {
		const script = document.createElement('script')
		script.src = 'https://s3.tradingview.com/tv.js'
		script.async = true
		script.onload = () => {
			new (window as any).TradingView.widget({
				autosize: true,
				symbol: `NASDAQ:${props.symbol}`,
				interval: 'D',
				timezone: 'Etc/UTC',
				theme: 'light',
				style: '1',
				locale: 'en',
				enable_publishing: false,
				allow_symbol_change: true,
				container_id: 'tradingview_12345',
			})
		}
		document.body.appendChild(script)
	})
</script>

<style scoped>
	.tradingview-widget-container {
		height: 500px;
		width: 100%;
	}
</style>
