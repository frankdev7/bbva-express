export interface NetworkResponseI<T = any> {
	success: boolean;
	data?: T;
	message: string;
	error?: any;
}