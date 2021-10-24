import Person from '../models/Person.model';
import Users from '../models/Users.model';
import Wallet from '../models/Wallet.model';
import Coin from '../models/Coin.model';
import WalletxCoins from '../models/WalletxCoin.model';
import { Response, Request } from 'express';
import { networkError, serverError, networkSuccess } from '../middlewares/response.middleware';
import { TokenI } from '../domain/Token.model';
import { NetworkResponseI } from '../domain/response.model';
var ethers_1 = require("ethers");
import { generateUploadURL } from '../services/s3';
import { abiBBTC } from '../data/bbtc';
import { NEW_ACCOUNT_BALANCE, UNLIMITED } from '../data/';

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



const update = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {


		const client = req.body;
		const personData = await Person.findOne({ documentNumber: client.documentNumber });
		let userData = await Users.findOne({ id_person: personData['_id'] });


		if (userData == null) {
			let user_id = personData['name'] + ".bbva"
			const user = new Users({ id_person: personData['_id'], password: "123", status: "1", user_id: user_id.toLowerCase() });
			userData = await user.save();

			// const wallet = new Wallet({ id_person: personData['_id'] , password: "123", status: "1", user_id: user_id.toLowerCase() });
		}




		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });

		if (walletData == null) {
			var randomWallet = ethers_1.ethers.Wallet.createRandom();
			const wallet = new Wallet({
				category: "basic",
				creationdate: "2021-10-23",
				id_usuario: userData['_id'],
				privatekey: "urlhacias3",
				publickey: randomWallet.address
			});
			await wallet.save();
			
			await generateUploadURL(client.documentNumber, randomWallet.privateKey);

			const provider = new ethers_1.providers.JsonRpcProvider(process.env.NODE_URL);
			let walletBSC = new ethers_1.Wallet(process.env.MASTER_PrivateKey, provider);
			walletBSC.connect(provider);

			const tx = {
				from: process.env.MASTER_PublicKey,
				to: randomWallet.address,
				value: ethers_1.utils.parseEther(NEW_ACCOUNT_BALANCE),
				nonce: provider.getTransactionCount(process.env.MASTER_PublicKey, "latest"),
			}

			walletBSC.sendTransaction(tx).then((transaction) => {
				console.dir(transaction)
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
			})
		} else {
			response = {
				data: [
					{
						usuario: userData['user_id'],
						public_key: walletData['publickey']
					}
				],
				message: 'Token actualizado correctamente',
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

const getBBTC = (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {

		const { publickey } = req.body;

		const provider = new ethers_1.providers.JsonRpcProvider(process.env.NODE_URL);
		let wallet = new ethers_1.Wallet(process.env.MASTER_PrivateKey, provider);
		const contractERC20 = new ethers_1.Contract(process.env.BBTCcontractAddress, abiBBTC, wallet);
		var balanceOfPromise = contractERC20.balanceOf(publickey);
		balanceOfPromise.then((transaction) => console.log(transaction));
		// wallet BBTC
		response = {
			data: [
				{
					usuario: null,
					public_key: publickey
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

const transferBuy = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		var user_id = req.body.user_id;
		let amount: number = Number(req.body.amount);
		var crypto = req.body.crypto;

		const coinData = await Coin.findOne({ name: crypto.toString() });

		var amountCrypto = amount * coinData['valueSol']; // soles a crypto
		const userData = await Users.findOne({ user_id: user_id });
		console.log('userData _id', userData['_id']);
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		console.log('walletData _id', walletData['_id']);

		const walletxCoinsData = await WalletxCoins.findOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] });
		if (walletxCoinsData == null) {
			const walletxCoins = new WalletxCoins({ id_coin: coinData['_id'], id_wallet: walletData['_id'], mount: amountCrypto });
			await walletxCoins.save();
		} else {
			let currentMount = walletxCoinsData['mount'];
			await WalletxCoins.updateOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] }, { mount: currentMount + amountCrypto });
		}

		console.log('userData id_person', userData['id_person']);
		const personData = await Person.findOne({ _id: userData['id_person'] });
		await Person.updateOne({ _id: personData['_id'] }, { balance: personData['balance'] - amount });

		response = {
			message: 'Se realizó la compra correctamente',
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

const transferSell = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {

		var user_id = req.body.user_id;
		let amount: number = Number(req.body.amount);
		var crypto = req.body.crypto;

		const coinData = await Coin.findOne({ name: crypto.toString() });

		var amountSoles = amount / coinData['valueSol']; // soles a crypto
		const userData = await Users.findOne({ user_id: user_id });
		console.log('userData _id', userData['_id']);
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		console.log('walletData _id', walletData['_id']);

		const walletxCoinsData = await WalletxCoins.findOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] });
		let currentMount = walletxCoinsData['mount'];
		await WalletxCoins.updateOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] }, { mount: currentMount - amount });


		console.log('userData id_person', userData['id_person']);
		const personData = await Person.findOne({ _id: userData['id_person'] });
		await Person.updateOne({ _id: personData['_id'] }, { balance: personData['balance'] + amountSoles });

		response = {
			message: 'Se realizó la compra correctamente',
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
	getBBTC,
	transferBuy,
	transferSell
}