<template>
	<van-list
		ref="listRef"
		v-model:loading="loading"
		:finished="finished"
		:finished-text="finished ? finishedText : ''"
		:loading-text="loadingText"
		:immediate-check="immediateCheck"
		@load="onLoad"
	>
		<slot :list="list"></slot>
	</van-list>
</template>

<script setup>
	import { ref, watch, useTemplateRef } from 'vue'

	const listRef = useTemplateRef('listRef')
	const list = ref([])
	const loading = ref(false)
	const finished = ref(false)
	const page = ref(1)

	const props = defineProps({
		apiFunction: {
			type: Function,
			default: () => {},
		},
		size: {
			type: Number,
			default: 10,
		},
		immediateCheck: {
			type: Boolean,
			default: true,
		},
		apiParams: {
			type: Object,
			default: () => ({}),
		},
		finishedText: {
			type: String,
			default: '沒有更多了',
		},
		loadingText: {
			type: String,
			default: 'loading...',
		},
		//讓api數據路徑可以自定義
		dataPath: {
			type: String,
			default: 'data',
		},
	})

	const onLoad = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000))

		// 合併外部參數和分頁參數
		const requestParams = {
			...props.apiParams,
			page: page.value,
			size: props.size,
		}
		const res = await props.apiFunction(requestParams)

		const newData = _get(res, props.dataPath, [])

		list.value = [...list.value, ...newData]

		if (!newData.length) {
			finished.value = true
		}

		page.value += 1
		loading.value = false
	}

	const refresh = () => {
		// 重置所有狀態
		list.value = []
		page.value = 0
		finished.value = false
		loading.value = false // 讓 van-list 自己管理加載狀態

		// 檢查是否需要立即加載
		listRef.value?.check()
	}

	// 監聽外部參數變化，自動刷新列表
	watch(() => props.apiParams, refresh, { deep: true })

	// 將 refresh 方法暴露給父組件
	defineExpose({ refresh })
</script>
