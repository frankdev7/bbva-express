// path - ruta : api/users
import { Router } from 'express';
import { createToken, getAll, update, getByDocument, createWallet } from '../controllers/wallet.controller';

const router = Router();

// router.post('/', createToken);
router.get('/', getAll);
router.patch('/', update)
router.get('/document/:id', getByDocument)
router.post('/', createWallet)

export default router;