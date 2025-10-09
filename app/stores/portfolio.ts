import { defineStore } from 'pinia'
import { portfolioApi } from '../api/portfolio'
import { isAuthenticated } from '@/modules/auth'
import type { PortfolioItem } from '@/types/portfolio'

export const usePortfolioStore = defineStore('portfolio', {
	state: () => ({
		portfolioData: [] as PortfolioItem[],
	}),
	getters: {
		portfolioList: (state) => state.portfolioData,
	},
	actions: {
		async fetchMyPortfolio() {
			try {
				if (!isAuthenticated()) return
				const res = await portfolioApi.getMyPortfolio()
				if (_isArray(_get(res, 'data'))) {
					this.portfolioData = _get(res, 'data')
				} else {
					console.error('Portfolio data 必須是陣列:', res.data)
					this.portfolioData = []
				}
			} catch (error) {
				console.error('Failed to fetch portfolio data:', error)
				this.portfolioData = []
			}
		},
		async fetchMockPortfolio() {
			fetch('/mock/portfolio.json')
				.then((res) => res.json())
				.then((data) => {
					this.portfolioData = _get(data, 'data')
				})
				.catch((error) => {
					console.error('Failed to fetch mock portfolio data:', error)
					this.portfolioData = []
				})
		},
	},
})
