import { Response } from 'express' 
import { NetworkResponseI } from '../domain/response.model';

const networkSuccess = (res: Response, data, message: string, status = 200) => {
	const response: NetworkResponseI = {
		message,
		data,
		success: true
	};
	res.status(status).send(response);
}

const networkError = (res: Response, error, message: string, status = 400) => {
	const response: NetworkResponseI = {
		message,
		error,
		success: false
	};
	res.status(status).send(response);
}

const serverError = (res: Response, error ) => {
	const response: NetworkResponseI = {
		message: 'Ha ocurrido un problema',
		error,
		success: false
	};
	res.status(500).send(response);
}

export { 
	networkError,
	networkSuccess,
	serverError
}