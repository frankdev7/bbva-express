import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import dbConnection from './database/config';
import walletRoutes from './routes/wallet.routes';

config();
dbConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/wallet', walletRoutes )

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
})