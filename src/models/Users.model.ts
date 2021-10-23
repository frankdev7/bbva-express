import { Schema, model, SchemaTypes } from 'mongoose';

const UsersSchema = new Schema({
	nombre: {
		type: String,
		required: true
	},
	token: {
		type: SchemaTypes.Map
	}
});

export default model('users', UsersSchema);


