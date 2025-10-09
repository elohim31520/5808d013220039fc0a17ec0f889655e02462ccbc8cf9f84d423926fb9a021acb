import { httpClient } from '../modules/service'
import type { ResponseData } from '../types/api'
import { useUserStore } from '@/stores/user'

interface LoginParams {
	name: string
	pwd: string
}

interface RegisterParams extends LoginParams {
	email: string
}

interface UserData {
	id: string
	name: string
	email: string
	token: string
}

export const login = async (params: LoginParams): Promise<ResponseData<string>> => {
	const res = await httpClient.request<string>({
		method: 'POST',
		endpoint: '/users/login',
		params,
	})
	if (res.success && res.data) {
		const userStore = useUserStore()
		userStore.login(res.data)
		userStore.setUsername(params.name)
	}
	return res
}

export const loginWithGoogle = async (credential: string): Promise<ResponseData<string>> => {
	const res = await httpClient.request<any>({
		method: 'POST',
		endpoint: '/users/google/login',
		params: {
			credential,
		},
	})
	if (res.success && res.data) {
		const userStore = useUserStore()
		const token = _get(res, 'data.token', '')
		const picture = _get(res, 'data.picture', '')
		const name = _get(res, 'data.name', '')
		userStore.login(token)
		userStore.setGoogleUserInfo(picture, name)
	}
	return res
}

export const register = async (params: RegisterParams): Promise<ResponseData<UserData>> => {
	const response = await httpClient.request<UserData>({
		method: 'POST',
		endpoint: '/users/register',
		params,
	})
	if (response.success && response.data.token) {
		const userStore = useUserStore()
		userStore.login(response.data.token)
		userStore.setUsername(response.data.name)
	}
	return response
}

export const changePassword = async (params: any) => {
	return await httpClient.request({
		method: 'POST',
		endpoint: '/users/password',
		params,
	})
}

export default {
	login,
	register,
	changePassword,
	loginWithGoogle,
}
