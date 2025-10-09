import { defineStore } from 'pinia'
import { balancesApi } from '../api/balances'
import { isAuthenticated } from '@/modules/auth'

type UsdInfo = {
	balance: number
	[key: string]: any
} | null

export const useBalanceStore = defineStore('balance', {
	state: () => ({
		usdInfo: null as UsdInfo,
	}),
	getters: {
		usdBalance: (state) => state.usdInfo?.balance ?? 0,
	},
	actions: {
		async fetchMyBalance() {
			if (!isAuthenticated()) return
			try {
				const res = await balancesApi.getMyBalances()
				const usdData = _get(res, 'data')
				if (usdData) {
					this.usdInfo = usdData
				} else {
					this.usdInfo = null
				}
			} catch (error) {
				console.error('Failed to fetch balance data:', error)
				this.usdInfo = null
			}
		},
	},
})
