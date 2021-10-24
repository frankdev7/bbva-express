// path - ruta : api/users
import { Router } from 'express';
import { createToken, getAll, update, getByDocument } from '../controllers/wallet.controller';

const router = Router();

// router.post('/', createToken);
router.get('/', getAll);
router.patch('/', update)
router.get('/document/:id', getByDocument)

export default router;