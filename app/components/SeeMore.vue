<template>
	<div class="flex-y-center justify-center text-pink-400" @click="router.push(to)" v-bind="$attrs">
		{{ $t('see_more.text') }}
		<SvgIcon name="icon_arrow_right" size="1rem" />
	</div>
</template>

<script setup lang="ts">
	import { useRouter } from 'vue-router'

	const router = useRouter()

	defineProps<{
		to: string
	}>()
</script>
