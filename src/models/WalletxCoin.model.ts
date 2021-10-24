import { Schema, model, SchemaTypes } from 'mongoose';

const WalletxCoinSchema = new Schema({
	id_coin: {
		type: String,
		required: true
	},
	id_wallet: {
		type: String,
		required: true
	},
	mount: {
		type: Number,
		required: true
	},
});

export default model('walletxcoins', WalletxCoinSchema);


