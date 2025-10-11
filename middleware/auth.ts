import { useUserStore } from '../app/stores/user'

export default defineNuxtRouteMiddleware((to, from) => {
	const userStore = useUserStore()
	const isLogin = userStore.isLogin

	if (!isLogin) {
		return navigateTo('/login')
	}
})
