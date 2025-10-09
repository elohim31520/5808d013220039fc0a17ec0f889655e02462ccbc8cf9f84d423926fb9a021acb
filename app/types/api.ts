export interface Company {
	id?: number
	symbol: string
	name: string
	createdAt?: Date
	updatedAt?: Date
}

export interface ResponseData<T> {
	message: string
	data: T
	error?: any
	success: boolean
	code: number
}

export interface FailResponseData extends Omit<ResponseData<null>, 'code'> {
	code: number | null
}

export interface RequestParams<T = any> {
	method: string
	endpoint: string
	params?: T
	quiet?: boolean
	useKV?: boolean
}
