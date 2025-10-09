<template>
	<div class="flex items-center justify-end py-4 pr-10" :class="{ 'bg-#787878': isDark }">
		<van-switch v-model="isDark" size="20px" />
		<span class="text-sm font-[400] text-#656565 ml-8" :class="{ 'text-#ffffff': isDark }">
			{{ isDark ? '深色' : '淺色' }}
		</span>
	</div>
	<van-grid :column-num="5" :class="{ dark: isDark }">
		<van-grid-item v-for="(icon, index) in items" :key="index" class="w-20% cursor-pointer" @click="dolog(icon)">
			<SvgIcon :name="icon" size="2rem" />
			<span class="text-xs name">
				{{ truncate(icon, { length: 10, separator: '...' }) }}
			</span>
		</van-grid-item>
	</van-grid>
</template>

<script setup lang="ts">
	import { truncate } from 'lodash-es'
	import { ref } from 'vue'

	const icons = import.meta.glob('@/icons/svg/*.svg')
	const items = Object.keys(icons)
		.map((vo) => {
			const match = vo.match(/\/icons\/svg\/(.*)\.svg/)
			return match ? match[1] : null
		})
		.filter((item): item is string => item !== null)
	const isDark = ref(false)

	const dolog = (icon: string) => {
		console.log(icon)
	}
</script>

<style lang="scss">
	.dark {
		.van-grid-item__content {
			background-color: #787878;
		}
		.name {
			color: #fff;
		}
	}
</style>
