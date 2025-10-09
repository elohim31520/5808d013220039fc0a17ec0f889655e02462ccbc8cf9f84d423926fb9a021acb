<template>
	<van-image :src="logoUrl" width="40" height="40" fit="cover" lazy-load :alt="altText">
		<template #error>
			<SvgIcon name="icon_ghost" size="2.5rem" />
		</template>
	</van-image>
</template>

<script setup lang="ts">
	import { computed } from 'vue'

	defineOptions({
		name: 'CompanyIcon',
	})

	const props = defineProps<{
		symbol: string
		name?: string
	}>()

	const altText = computed(() => {
		return props.name ? `${props.name} Logo` : `${props.symbol} Logo`
	})

	const logoUrl = computed(() => {
		const symbol = props.symbol?.toLowerCase()
		return `/logo/${symbol}.svg`
	})
</script>
