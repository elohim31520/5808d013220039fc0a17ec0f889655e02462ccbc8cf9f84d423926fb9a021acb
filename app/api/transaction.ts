import { httpClient } from '../modules/service'
import type { ResponseData } from '../types/api'
import type { Transaction, TransactionForm } from '../types/transactions'

interface PaginationParams {
	page: number
	size: number
}

class TransactionApi {
	/**
	 * 取得所有交易紀錄
	 */
	async getAllTransactions({ page, size }: PaginationParams): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'GET', endpoint: '/transactions', params: { page, size } })
	}

	/**
	 * 刪除單筆交易紀錄
	 * @param id 交易紀錄 ID
	 */
	async deleteTransaction(id: number): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'DELETE', endpoint: `/transactions/${id}` })
	}

	/**
	 * 新增多筆交易紀錄
	 * @param transactions 交易紀錄陣列
	 */
	async recordMyTransactions(transaction: Transaction): Promise<ResponseData<any>> {
		return httpClient.request<any>({ method: 'POST', endpoint: '/transactions', params: transaction })
	}

	private parseDate(dateStr: string): string | null {
		const date_format = /^\d{4}-\d{2}-\d{2}$/
		if (date_format.test(dateStr)) {
			return dateStr
		}
		return null
	}
}

export const transactionApi = new TransactionApi()
