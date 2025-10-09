import { httpClient } from '../modules/service'
import type { ResponseData } from '../types/api'

/**
 * 更新投資組合的參數型別
 */
type UpdatePortfolioParams = {
	stock_id: string
	quantity?: number
	average_price?: number
}

class PortfolioApi {
	/**
	 * 取得我的投資組合
	 */
	async getMyPortfolio(): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: '/portfolio' })
	}

	/**
	 * 更新我的投資組合
	 */
	async updateMyPortfolio(params: UpdatePortfolioParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'PUT', endpoint: '/portfolio', params })
	}

	/**
	 * 刪除我的投資組合
	 */
	async deleteMyPortfolio(portfolio_id: number): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'DELETE', endpoint: `/portfolio/${portfolio_id}` })
	}

	/**
	 * 新增我的投資組合
	 * 參數跟 updateMyPortfolio 一樣
	 */
	async createMyPortfolio(params: UpdatePortfolioParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'POST', endpoint: '/portfolio', params })
	}
}

export const portfolioApi = new PortfolioApi()
