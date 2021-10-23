import Client from '../models/Client.model';
import { Response, Request } from 'express';
import { networkError, serverError, networkSuccess } from '../middlewares/response.middleware';
import { TokenI } from '../domain/Token.model';
import { NetworkResponseI } from '../domain/response.model';
var ethers_1 = require("ethers");
import { generateUploadURL } from '../services/s3';

const createToken = async (request, response) => {
	/*try {
		const {name, number, type } = request.body as TokenI;
		if(name && number && type){
			const client = new Client(request.body);
			await client.save();
			response.status(201).send({
				success: true,
				message: 'Token creada correctamente'
			});
			return;
		}
		return response.status(400).send({
			success:false,
			message: 'Datos invalidos'
		});
	} catch (error) {
		response.status(500).send({
			error,
			success:false,
			message: 'Ha ocurrido un problema'
		});
	}*/
}

const getAll = async (req: Request, res: Response) => {
	try {
		const client = await Client.find();
		console.log(client);
		networkSuccess(res, client, 'Listado de clients');
	} catch (error) {
		serverError(res, error);
	}
}

const getByDocument = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		const { id } = req.params;
		const getData = await Client.findOne({documentNumber: id.toString()});
		console.log(getData);
		if(getData){
			response = {
				data: getData,
				message: 'Usuario encontrado correctamente',
				success: true
			}
			res.send(response);
		}
	} catch (error) {
		response = {
			success: false,
			message: 'Ha ocurrido un problema',
			error
		}
		res.status(500).send(response);
	}
}


const update = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		const client = req.body;
		var randomWallet = ethers_1.ethers.Wallet.createRandom();
		await generateUploadURL(client.documentNumber, randomWallet.privateKey)
		// console.log(randomWallet.address);
		// console.log(randomWallet.privateKey);
		// console.log(randomWallet.mnemonic);
		const getData = await Client.findOne({documentNumber: client.documentNumber});
		let roots = getData['account'];
		let data = roots.get('0');
		data['token'] = randomWallet.address;
		let newData = {account: {"0": data}};
		await Client.updateOne({_id: getData['_id']}, newData);
		response = {
			data: null,
			message: 'Token actualizado correctamente',
			success: true
		}
		res.send(response);
	} catch (error) {
		response = {
			success: false,
			message: 'Ha ocurrido un problema',
			error
		}
		res.status(500).send(response);
	}
}


export { 
	createToken, 
	getAll,
	update,
	getByDocument
}