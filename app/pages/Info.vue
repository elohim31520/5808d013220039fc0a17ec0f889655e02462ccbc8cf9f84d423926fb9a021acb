<template>
	<div class="w-full" :style="pageStyle">
		<iframe :src="iframeSrc" class="w-full h-full border-0"></iframe>
	</div>
</template>

<script setup lang="ts">
	import { computed, type CSSProperties } from 'vue'
	import { useI18n } from 'vue-i18n'

	defineOptions({
		name: 'info',
	})

	const { locale } = useI18n()
	const iframeSrc = computed(() => {
		if (locale.value === 'en') {
			return 'https://lazypod.org/info-en'
		}
		return 'https://lazypod.org/iframe'
	})

	const pageStyle = computed(
		(): CSSProperties => ({
			height: `calc(100vh - 60px - 67px)`,
		})
	)
</script>
