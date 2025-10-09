import { httpClient } from '../modules/service'
import type { ResponseData, Company } from '../types/api'

class MarketApi {
	async getAllMomentum(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/market/momentum' })
	}

	async getMomentumByRange(days: number): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: `/market/momentum/range/${days}`, useKV: true })
	}

	async getMarketWeights(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/market/weights' })
	}
}

export const marketApi = new MarketApi()
