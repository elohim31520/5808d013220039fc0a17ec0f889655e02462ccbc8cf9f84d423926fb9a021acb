export const API_CONFIG = {
	BASE_URL: import.meta.env.API_URL,
	TIMEOUT: 10000,
	TOKEN_KEY: 'user_token',
} as const

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
