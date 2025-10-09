<template>
	<div class="avatar-generator-page bg-[#f0f2f5] min-h-screen p-20">
		<div class="max-w-[600px] mx-auto bg-white rounded-lg shadow-lg p-25">
			<h1 class="text-2xl font-bold text-center mb-5 text-#333">
				{{ $t('avatar_generator.title') }}
			</h1>
			<p class="text-center text-sm text-#888 mb-5">
				{{ $t('avatar_generator.subtitle') }}
			</p>

			<!-- 步驟指示器 -->
			<div class="flex justify-between items-center mb-5 text-xs text-center">
				<div class="flex-1" :class="step >= 1 ? 'text-blue-500 font-bold' : 'text-gray-400'">
					<div class="mb-5">{{ $t('avatar_generator.step1_title') }}</div>
					<div>{{ $t('avatar_generator.step1_description') }}</div>
				</div>
				<div class="w-50 h-2 bg-gray-200 mx-2">
					<div class="h-full bg-blue-500 transition-all" :style="{ width: step > 1 ? '100%' : '0' }"></div>
				</div>
				<div class="flex-1" :class="step >= 2 ? 'text-blue-500 font-bold' : 'text-gray-400'">
					<div class="mb-5">{{ $t('avatar_generator.step2_title') }}</div>
					<div>{{ $t('avatar_generator.step2_description') }}</div>
				</div>
				<div class="w-50 h-2 bg-gray-200 mx-2">
					<div class="h-full bg-blue-500 transition-all" :style="{ width: step > 2 ? '100%' : '0' }"></div>
				</div>
				<div class="flex-1" :class="step === 3 ? 'text-green-500 font-bold' : 'text-gray-400'">
					<div class="mb-5">{{ $t('avatar_generator.step3_title') }}</div>
					<div>{{ $t('avatar_generator.step3_description') }}</div>
				</div>
			</div>

			<!-- 上傳區域 -->
			<div
				v-if="!uploadedImage"
				class="upload-area border-2 border-dashed border-gray-300 rounded-lg text-center p-30 cursor-pointer hover:border-blue-500 transition-all"
				@click="triggerFileInput"
				@dragover.prevent
				@drop.prevent="handleFileDrop"
			>
				<input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileSelect" />
				<SvgIcon name="upload" size="3rem" class="mx-auto text-gray-400 mb-2" />
				<p class="text-base text-#555">
					{{ $t('avatar_generator.upload_area_text') }}
				</p>
				<p class="text-xs text-#999 mt-1">
					{{ $t('avatar_generator.supported_formats') }}
				</p>
			</div>

			<!-- 圖片預覽和結果 -->
			<div v-else class="image-preview-area text-center">
				<div class="grid grid-cols-2 gap-1 items-center">
					<!-- 原始圖片 -->
					<div class="relative">
						<img :src="uploadedImage" alt="Uploaded Preview" class="w-full rounded-lg shadow-md" />
						<div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-2 py-3 rounded-br-lg">
							{{ $t('avatar_generator.original_image') }}
						</div>
					</div>

					<!-- 生成的頭像 -->
					<div class="relative">
						<div
							v-if="isLoading"
							class="w-full aspect-square bg-gray-100 rounded-lg flex flex-col justify-center items-center"
						>
							<van-loading type="spinner" color="#1989fa" size="48px" />
							<p class="mt-3 text-sm text-#555">{{ loadingText }}</p>
							<div class="w-80% bg-gray-200 rounded-full h-8 mt-2">
								<div class="bg-blue-500 h-8 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
							</div>
						</div>
						<div v-else-if="generatedAvatar" class="relative">
							<img :src="generatedAvatar" alt="Generated Avatar" class="w-full rounded-lg shadow-md" />
							<div class="absolute top-0 left-0 bg-green-500 bg-opacity-80 text-white text-xs px-2 py-3 rounded-br-lg">
								{{ $t('avatar_generator.generation_successful') }}
							</div>
						</div>
						<div v-else class="w-full aspect-square bg-gray-100 rounded-lg flex flex-col justify-center items-center">
							<SvgIcon name="photo" size="3rem" class="mx-auto text-gray-400 mb-2" />
							<p class="text-sm text-#999">
								{{ $t('avatar_generator.avatar_pending') }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="actions mt-25 text-center">
				<van-button
					v-if="!uploadedImage"
					type="primary"
					round
					block
					size="large"
					@click="triggerFileInput"
					icon="photograph"
				>
					{{ $t('avatar_generator.select_image') }}
				</van-button>

				<div v-if="uploadedImage && !generatedAvatar && !isLoading" class="flex gap-1">
					<van-button type="default" round block size="large" @click="reset">
						{{ $t('avatar_generator.reselect') }}
					</van-button>
					<van-button type="success" round block size="large" @click="generateAvatar" icon="fire">
						{{ $t('avatar_generator.start_generation') }}
					</van-button>
				</div>

				<div v-if="generatedAvatar" class="flex gap-1">
					<van-button type="default" round block size="large" @click="reset">
						{{ $t('avatar_generator.try_again') }}
					</van-button>
					<van-button type="primary" round block size="large" @click="downloadAvatar" icon="down">
						{{ $t('avatar_generator.download_avatar') }}
					</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { uploadImageAndGenerateAvatar } from '@/api/avatar'
	import { showLoadingToast, closeToast } from 'vant'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n()
	const fileInput = ref(null)
	const uploadedImage = ref(null)
	const uploadedFile = ref(null)
	const generatedAvatar = ref(null)
	const isLoading = ref(false)
	const loadingText = ref(t('avatar_generator.uploading_image'))
	const uploadProgress = ref(0)

	const step = computed(() => {
		if (generatedAvatar.value) return 3
		if (isLoading.value || uploadedImage.value) return 2
		return 1
	})

	const triggerFileInput = () => {
		fileInput.value?.click()
	}

	const handleFileSelect = (event) => {
		const file = event.target.files[0]
		if (file) {
			processFile(file)
		}
	}

	const handleFileDrop = (event) => {
		const file = event.dataTransfer.files[0]
		if (file) {
			processFile(file)
		}
	}

	const processFile = (file) => {
		if (!file.type.startsWith('image/')) {
			showToast(t('avatar_generator.upload_image_file_please'))
			return
		}
		uploadedFile.value = file
		const reader = new FileReader()
		reader.onload = (e) => {
			uploadedImage.value = e.target.result
		}
		reader.readAsDataURL(file)
	}

	const generateAvatar = async () => {
		if (!uploadedFile.value) return
		isLoading.value = true
		uploadProgress.value = 0
		loadingText.value = t('avatar_generator.uploading_image')
		generatedAvatar.value = null

		const loadingToast = showLoadingToast({
			message: t('avatar_generator.processing'),
			forbidClick: true,
			duration: 0,
		})

		try {
			const resultUrl = await uploadImageAndGenerateAvatar(uploadedFile.value, (progress) => {
				uploadProgress.value = progress
				if (progress >= 100) {
					loadingText.value = t('avatar_generator.ai_drawing')
				}
			})
			generatedAvatar.value = resultUrl
			showToast({
				type: 'success',
				message: t('avatar_generator.avatar_generation_successful'),
			})
		} catch (error) {
			console.error('Avatar generation failed:', error)
			showToast({
				type: 'fail',
				message: error.message || t('avatar_generator.generation_failed'),
			})
			reset()
		} finally {
			isLoading.value = false
			closeToast()
		}
	}

	const downloadAvatar = () => {
		if (!generatedAvatar.value) return
		const a = document.createElement('a')
		a.href = generatedAvatar.value
		// 由於瀏覽器安全策略，CORS 圖片可能無法直接下載
		// a.download = 'my-cartoon-avatar.png'
		a.target = '_blank'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		showToast(t('avatar_generator.starting_download'))
	}

	const reset = () => {
		uploadedImage.value = null
		uploadedFile.value = null
		generatedAvatar.value = null
		isLoading.value = false
		uploadProgress.value = 0
		if (fileInput.value) {
			fileInput.value.value = ''
		}
	}
</script>

<style scoped>
	.avatar-generator-page {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}
	.upload-area {
		transition: background-color 0.3s, border-color 0.3s;
	}
	.upload-area:hover {
		background-color: #f8f9fa;
		border-color: #007bff;
	}
</style>
