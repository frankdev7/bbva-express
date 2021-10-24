import { Schema, model, SchemaTypes } from 'mongoose';

const PersonSchema = new Schema({
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
	email: {
		type: String,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	balance: {
		type: Number,
		required: true
	}
	// account: {
	// 	type: SchemaTypes.Map
	// }
});

export default model('persons', PersonSchema);


