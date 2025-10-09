import Cookies from 'js-cookie'
import { API_CONFIG } from '../config/api'

export const getToken = (): string | undefined => {
	return Cookies.get(API_CONFIG.TOKEN_KEY)
}

export const setToken = (token: string): void => {
	Cookies.set(API_CONFIG.TOKEN_KEY, token)
}

export const removeToken = (): void => {
	Cookies.remove(API_CONFIG.TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
	return getToken() !== undefined
}
