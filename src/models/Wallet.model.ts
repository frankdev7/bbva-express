import { Schema, model, SchemaTypes } from 'mongoose';

const WalletSchema = new Schema({
	category: {
		type: String,
		required: true
	},
	creationdate: {
		type: String,
		required: true
	},
	id_usuario: {
		type: String,
		required: true
	},
    privatekey: {
		type: String,
		required: true
	},
    publickey: {
		type: String,
		required: true
	},
});

export default model('wallets', WalletSchema);


