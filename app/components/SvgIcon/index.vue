<template>
	<svg class="svg-icon" :style="iconStyle" aria-hidden="true">
		<use :href="`#${symbolId}`" />
	</svg>
</template>

<script setup lang="ts">
	import { computed } from 'vue'
	import { useSvgIconLoader } from './useSvgIconLoader'

	const props = defineProps({
		prefix: {
			type: String,
			default: 'icon',
		},
		name: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default: '1em',
		},
	})

	const symbolId = computed(() => `${props.prefix}-${props.name}`)

	const iconStyle = computed(() => ({
		width: props.size,
		height: props.size,
		fill: 'currentColor',
		overflow: 'hidden',
	}))

	useSvgIconLoader(props, symbolId)
</script>
