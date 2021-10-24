import Person from '../models/Person.model';
import Users from '../models/Users.model';
import Wallet from '../models/Wallet.model';
import Coin from '../models/Coin.model';
import WalletxCoins from '../models/WalletxCoin.model';
import Transaction from '../models/Transaction.model';
import BBVAToken from '../models/BBVAToken.model';
import { Response, Request } from 'express';
import { networkError, serverError, networkSuccess } from '../middlewares/response.middleware';
import { TokenI } from '../domain/Token.model';
import { NetworkResponseI } from '../domain/response.model';
var ethers_1 = require("ethers");
import { generateUploadURL } from '../services/s3';
import { abiBBTC } from '../data/bbtc';
import { abiBETH } from '../data/beth';
import { NEW_ACCOUNT_BALANCE, UNLIMITED, CIEN_MIL } from '../data/';

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
		if (getData != null) {
			var cliente = {
				nombre: getData['name'],
				email: getData['email'],
				url: getData['url'],
				cuenta: getData['cuenta'],
				lastname: getData['lastName'],
				saldo: getData['balance']
			}
			response = {
				data: cliente,
				message: 'Usuario encontrado correctamente',
				success: true
			}
		} else {
			response = {
				data: null,
				message: 'No se encontró usuario',
				success: true
			}
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

			let newWallet = await wallet.save();			
			const dataBBVATokens = new BBVAToken({ id_bbvatoken: '6174795c376a44807250757a' , id_wallet: newWallet._id, mount: 400 });
			await dataBBVATokens.save();
			
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
		let amountCoin: number = Number(req.body.amountCoin);
		let amountSoles: number = Number(req.body.amountSoles);
		var crypto = req.body.crypto;

		const coinData = await Coin.findOne({ name: crypto.toString() });

		// var amountCrypto = amount * coinData['valueSol']; // soles a crypto
		// Obtener nuevo valor de blockchain
		// Obtener HASH
		const userData = await Users.findOne({ user_id: user_id });
		console.log('userData _id', userData['_id']);
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		console.log('walletData _id', walletData['_id']);



		// // Transfer coin from MASTER to client
		const provider = new ethers_1.providers.JsonRpcProvider(process.env.NODE_URL);
		let wallet = new ethers_1.Wallet(process.env.MASTER_PrivateKey, provider);
		let contractERC20;
		switch (coinData['name']) {
			case 'BITCOIN':
				contractERC20 = new ethers_1.Contract(process.env.BBTCcontractAddress, abiBBTC, wallet);
				break;
			case 'ETHEREUM':
				contractERC20 = new ethers_1.Contract(process.env.BETHcontractAddress, abiBETH, wallet);
				break;
			default:
				break;
		}

		var transferPromise = contractERC20.transfer(walletData['publickey'], amountCoin * CIEN_MIL);


		transferPromise.then(async (transactionBlockchain) => {
			console.log(transactionBlockchain)

			const walletxCoinsData = await WalletxCoins.findOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] });
			if (walletxCoinsData == null) {
				const walletxCoins = new WalletxCoins({ id_coin: coinData['_id'], id_wallet: walletData['_id'], mount: amountCoin });
				await walletxCoins.save();
			} else {
				let currentMount = walletxCoinsData['mount'];
				await WalletxCoins.updateOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] }, { mount: currentMount + amountCoin });
			}

			console.log('userData id_person', userData['id_person']);
			const personData = await Person.findOne({ _id: userData['id_person'] });
			await Person.updateOne({ _id: personData['_id'] }, { balance: personData['balance'] - amountSoles });

			const BBVATokenData = await BBVAToken.findOne({ id_wallet: walletData['_id'] });
			await BBVAToken.updateOne({ id_wallet: walletData['_id'] }, { mount: BBVATokenData['mount']+Math.trunc(amountSoles/3.95) });

			// registrarTransaccion
			var myDate = new Date();
			var offset = '+5';  // e.g. if the timeZone is -5
			var MyDateWithOffset = new Date(myDate.toUTCString() + offset);
			const transaction = new Transaction({ amount: amountCoin, date_transaction: MyDateWithOffset, id_wallet: walletData['_id'], typecoin: crypto, hash: transactionBlockchain.hash });
			await transaction.save();

			response = {
				message: 'Se realizó la compra correctamente',
				success: true
			}
			res.send(response);

		}).catch((error) =>
			console.log(error)
		);

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
		let amountCoin: number = Number(req.body.amountCoin);
		let amountSoles: number = Number(req.body.amountSoles);
		var crypto = req.body.crypto;

		const coinData = await Coin.findOne({ name: crypto.toString() });

		// var amountSoles = amount / coinData['valueSol']; // soles a crypto
		// obtener nuevo valor de blockchain
		const userData = await Users.findOne({ user_id: user_id });
		console.log('userData _id', userData['_id']);
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		console.log('walletData _id', walletData['_id']);

		const walletxCoinsData = await WalletxCoins.findOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] });
		let currentMount = walletxCoinsData['mount'];
		await WalletxCoins.updateOne({ id_coin: coinData['_id'], id_wallet: walletData['_id'] }, { mount: currentMount - amountCoin });


		console.log('userData id_person', userData['id_person']);
		const personData = await Person.findOne({ _id: userData['id_person'] });
		await Person.updateOne({ _id: personData['_id'] }, { balance: personData['balance'] + amountSoles });

		// registrarTransaccion

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

const getBalance = async (req: Request, res: Response) => {
	let response: NetworkResponseI;
	try {
		var user_id = req.body.user_id;
		const userData = await Users.findOne({ user_id: user_id });
		if (userData == null) {
			throw "No se encontró datos del usuario";
		}
		const walletData = await Wallet.findOne({ id_usuario: userData['_id'] });
		if (walletData == null) {
			throw "No se encontró wallet del usuario";
		}
		const walletxCoinsData = await WalletxCoins.find({ id_wallet: walletData['_id'] });
		if (walletData == null) {
			throw "No se encontró wallet del usuario";
		}
			
		// const transactionData = await Transaction.find({ id_wallet: walletData['_id'] });
		const BBVATokenData = await BBVAToken.findOne({ id_wallet: walletData['_id'] });
		const personData = await Person.findOne({ _id: userData['id_person'] });
		let bbtc = 0;
		let beth = 0;
		let bbva = 0;
		let ada = 0;
		let cod = 0;

		var bar = new Promise<void>((resolve, reject) => {
			if (walletxCoinsData != null) {
				walletxCoinsData.forEach(async (element, index, array) => {
					const coinData = await Coin.findOne({ _id: element['id_coin'] });
					if (coinData['name'] == 'BITCOIN') {
						bbtc = element['mount'];
					} else if (coinData['name'] == 'BBVACOIN') {
						bbva = element['mount'];
					} else if (coinData['name'] == 'CODITEC') {
						cod = element['mount'];
					} else if (coinData['name'] == 'ADA') {
						ada = element['mount'];
					} else if (coinData['name'] == 'ETHEREUM') {
						beth = element['mount'];
					}
					if (index === array.length - 1) resolve();

				});

			}
		});

		bar.then(() => {
			response = {
				data: {
					BBTC: bbtc,
					BETH: beth,
					BBVA: bbva,
					ADA: ada,
					COD: cod,
					// history: transactionData,
					BBVATokens: BBVATokenData['mount'],
					saldoSoles: personData['balance']
				},
				message: 'Se realizó la consulta correctamente',
				success: true
			}
			res.send(response);
		});

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
	transferSell,
	getBalance
}