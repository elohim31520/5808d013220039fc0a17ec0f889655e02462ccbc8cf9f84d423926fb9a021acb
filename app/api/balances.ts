import { httpClient } from '../modules/service'
import type { ResponseData } from '../types/api'

class BalancesApi {
	/**
	 * 取得我的餘額
	 */
	async getMyBalances(): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: '/balances' })
	}

	/**
	 * 更新我的餘額
	 */
	async updateMyBalances(params: any): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'PUT', endpoint: '/balances', params })
	}

	/**
	 * 新增我的餘額
	 */
	async createMyBalances(params: any): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'POST', endpoint: '/balances', params })
	}
}

export const balancesApi = new BalancesApi()
