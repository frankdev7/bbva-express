import mongoose from 'mongoose';

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('Database successfull connected');
	} catch (error) {
		console.error(error);
		throw new Error('Error en la base de datos, por favor comuníquese con el adminsitrador');
	}
}

export default dbConnection;