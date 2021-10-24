// path - ruta : api/users
import { Router } from 'express';
import { createToken, getAll, update, getByDocument, getBBTC, transferBuy, transferSell } from '../controllers/wallet.controller';

const router = Router();

// router.post('/', createToken);
router.get('/', getAll);
router.patch('/', update)
router.get('/document/:id', getByDocument)
router.get('/getBBVTC', getBBTC)
router.post('/transferBuy', transferBuy)
router.post('/transferSell', transferSell)

export default router;