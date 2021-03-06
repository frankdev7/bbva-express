import { Schema, model, SchemaTypes } from 'mongoose';

const UsersSchema = new Schema({
	id_person: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	// token: {
	// 	type: SchemaTypes.Map
	// }
});

export default model('users', UsersSchema);


