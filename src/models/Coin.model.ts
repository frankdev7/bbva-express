import { Schema, model, SchemaTypes } from 'mongoose';

const CoinSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	valueSol: {
		type: Number,
		required: true
	}
});

export default model('coins', CoinSchema);


