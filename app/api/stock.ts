import { httpClient } from '../modules/service'
import type { ResponseData, Company } from '../types/api'

class StockApi {
	// 獲取公司列表改到前端的 /public ，因為雲端有出站費用很貴！
	// async getStockSymbols(): Promise<ResponseData<Company[]>> {
	// 	return httpClient.request<Company[]>({ method: 'GET', endpoint: '/stock/symbols' })
	// }

	// async getAllCompanies(): Promise<ResponseData<Company[]>> {
	// 	return httpClient.request<Company[]>({ method: 'GET', endpoint: '/stock/symbols' })
	// }

	async getMarketBreadth(): Promise<ResponseData<number>> {
		return httpClient.request<number>({ method: 'GET', endpoint: '/stock/breadth', useKV: true })
	}

	async getStockWinners(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/winners', useKV: true })
	}

	async getStockLosers(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/losers', useKV: true })
	}

	async getTodayStocks(): Promise<ResponseData<any[]>> {
		return httpClient.request<any[]>({ method: 'GET', endpoint: '/stock/today', useKV: true })
	}
}

export const stockApi = new StockApi()
