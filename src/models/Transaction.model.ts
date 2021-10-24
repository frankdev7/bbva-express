import { Schema, model, SchemaTypes } from 'mongoose';

const TransactionSchema = new Schema({
	amount: {
		type: Number,
		required: true
	},
	date_transaction: {
		type: Date,
		required: true
	},
	id_wallet: {
		type: String,
		required: true
	},
	typecoin: {
		type: String,
		required: true
	},
	hash: {
		type: String,
		required: true
	}
});

export default model('transactions', TransactionSchema);


