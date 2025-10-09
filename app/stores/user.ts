import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isAuthenticated, removeToken, setToken } from '@/modules/auth'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
	console.log('登入狀態', isAuthenticated())
	const isLogin = ref(isAuthenticated())
	const username = useStorage('username', '')
	const userPicture = useStorage('g_user_picture', '')
	const googleUserName = useStorage('g_user_name', '')

	const userInfo = computed(() => {
		return {
			name: googleUserName.value || username.value,
			picture: userPicture.value || '/avatar/1.webp',
		}
	})

	function checkLoginStatus() {
		console.log('登入狀態', isAuthenticated())
		isLogin.value = isAuthenticated()
	}

	function login(token: string) {
		setToken(token)
		isLogin.value = true
	}

	function setGoogleUserInfo(picture: string, name: string) {
		userPicture.value = picture
		googleUserName.value = name
	}

	function setUsername(name: string) {
		username.value = name
	}

	function logout() {
		removeToken()
		isLogin.value = false
		username.value = ''
		userPicture.value = ''
		googleUserName.value = ''
		// useStorage handles removing the item from localStorage
	}

	return {
		isLogin,
		username,
		userPicture,
		googleUserName,
		userInfo,
		checkLoginStatus,
		login,
		setGoogleUserInfo,
		setUsername,
		logout,
	}
})
