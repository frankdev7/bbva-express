import { Schema, model, SchemaTypes } from 'mongoose';

const BBVATokenSchema = new Schema({
	id_bbvatoken: {
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
	}
});

export default model('wallexbbvatokens', BBVATokenSchema);


