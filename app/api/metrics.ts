import { httpClient } from '../modules/service'
import type { ResponseData, Company } from '../types/api'

class MetricsApi {
	async getStatementBySymbol(symbol: string, days: number): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: `/statements/${symbol}`, params: { days }, useKV: true })
	}
}

export const metricsApi = new MetricsApi()
