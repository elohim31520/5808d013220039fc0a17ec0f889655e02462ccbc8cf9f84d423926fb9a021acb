import axios from 'axios'

/**
 * 與頭像生成相關的 API
 */

// 輔助函式：將 File 物件轉換為 Base64 字串
const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = (error) => reject(error)
	})

/**
 * 上傳圖片並生成卡通頭像
 * @param {File} imageFile 使用者上傳的圖片檔案
 * @param {Function} onProgress 進度回調，用於更新前端 UI
 * @returns {Promise<string>} 返回生成後的頭像圖片 URL (Base64 格式)
 */
export const uploadImageAndGenerateAvatar = async (imageFile, onProgress) => {
	onProgress(50) // 狀態：準備中

	// 步驟 1: 將圖片轉為 Base64
	const base64Image = await toBase64(imageFile)

	onProgress(100) // 狀態：生成中 (此時前端會顯示 "AI 正在繪製中...")

	const SD_API_ENDPOINT = 'http://localhost:7860/sdapi/v1/img2img'

	// 步驟 2: 建立 img2img API 的請求內容 (payload)
	// 您可以根據需求調整這些參數
	const payload = {
		prompt:
			'(masterpiece, best quality), (cartoon style: 1.3), (anime style: 1.3), avatar, amazing, beautiful detailed eyes',
		negative_prompt:
			'(worst quality, low quality, normal quality), realistic, photorealistic, ugly, deformed, text, watermark, naked',
		init_images: [
			base64Image.split(',', 2)[1], // API 需要不含 "data:image/..." 前綴的純 Base64 字串
		],
		seed: -1, // -1 表示隨機種子
		sampler_name: 'DPM++ 2M Karras', // 常用的採樣器
		steps: 25, // 迭代步數，越高細節越多但越慢
		cfg_scale: 7, // 提示詞相關性，越高越接近 prompt
		width: 512,
		height: 512,
		denoising_strength: 0.75, // 重繪強度，越高越不像原圖
	}

	try {
		const response = await axios.post(SD_API_ENDPOINT, payload, {
			timeout: 180000,
		})

		console.log('Avatar generated successfully.')

		// 步驟 4: 處理回應，取得圖片資料
		if (response.data.images && response.data.images[0]) {
			const generatedImageBase64 = response.data.images[0]
			// 將純 Base64 資料加上前綴，使其成為可顯示的 Data URL
			return `data:image/png;base64,${generatedImageBase64}`
		} else {
			throw new Error('API 回應中不包含圖片資料。')
		}
	} catch (error) {
		console.error('Stable Diffusion API error:', error)
		let errorMessage = '生成失敗，請檢查 Stable Diffusion 伺服器是否正常運行。'
		if (error.code === 'ECONNREFUSED') {
			errorMessage = '無法連接到 Stable Diffusion 伺服器，請檢查 API 端點網址及服務狀態。'
		} else if (error.response) {
			console.error('Error data:', error.response.data)
			errorMessage += ` (錯誤碼: ${error.response.status})`
		}
	}
}
