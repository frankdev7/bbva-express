import { Schema, model, SchemaTypes } from 'mongoose';

const ClientSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	documentType: {
		type: String,
		required: true
	},
	documentNumber: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	creationDate: {
		type: String,
		required: true
	},
	account: {
		type: SchemaTypes.Map
	}
});

export default model('clients', ClientSchema);


