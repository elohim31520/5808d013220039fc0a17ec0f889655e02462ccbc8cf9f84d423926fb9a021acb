<template>
	<div>
		<div id="heatmap-container" class="tradingview-widget-container">
			<div class="tradingview-widget-container__widget"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue'

	onMounted(() => {
		const script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js'
		script.async = true
		script.innerHTML = JSON.stringify({
			exchanges: [],
			dataSource: 'SPX500',
			grouping: 'sector',
			blockSize: 'market_cap_basic',
			blockColor: 'change',
			locale: 'zh_TW',
			symbolUrl: '',
			colorTheme: 'dark',
			hasTopBar: false,
			isDataSetEnabled: false,
			isZoomEnabled: true,
			hasSymbolLogo: true,
			width: '100%',
			height: '100%',
		})

		const container = document.getElementById('heatmap-container')
		if (container) {
			container.appendChild(script)
		}
	})
</script>
