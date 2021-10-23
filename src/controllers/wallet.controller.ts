import Person from '../models/Person.model';
import Users from '../models/Users.model';
import Wallet from '../models/Wallet.model';
import { Response, Request } from 'express';
import { networkError, serverError, networkSuccess } from '../middlewares/response.middleware';
import { TokenI } from '../domain/Token.model';
import { NetworkResponseI } from '../domain/response.model';
var ethers_1 = require("ethers");
import { generateUploadURL } from '../services/s3';
import { abi } from '../data';

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
		const client = await Person.find();
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
		const getData = await Person.findOne({ documentNumber: id.toString() });
		console.log(getData);
		if (getData) {
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

var randomWallet = ethers_1.ethers.Wallet.createRandom();

const update = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		const client = req.body;
		// console.log(randomWallet.address);
		// console.log(randomWallet.privateKey);
		// console.log(randomWallet.mnemonic);
		const personData = await Person.findOne({ documentNumber: client.documentNumber });
		const userData = await Users.findOne({ id_person: personData['_id'] });
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		//walletData['publickey'] = randomWallet.address;
		//console.log(walletData['_id']);
		await Wallet.updateOne({ id_usuario: userData['_id'] }, { publickey: randomWallet.address });
		await generateUploadURL(client.documentNumber, randomWallet.privateKey);
		response = {
			data: [
				{
					usuario: userData['user_id'],
					public_key: randomWallet.address
				}
			],
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

const getBBVTC = (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		const provider = new ethers_1.providers.JsonRpcProvider(process.env.NODE_URL);
		let wallet = new ethers_1.Wallet(process.env.MASTER_PrivateKey, provider);
		const contractERC20 = new ethers_1.Contract(process.env.contractAddress, abi, wallet);
		var balanceOfPromise = contractERC20.balanceOf(randomWallet.address);
		balanceOfPromise.then((transaction) => console.log(transaction));
		response = {
			data: [
				{
					usuario: null,
					public_key: randomWallet.address
				}
			],
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
	getByDocument,
	getBBVTC
}