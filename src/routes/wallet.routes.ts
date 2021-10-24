// path - ruta : api/users
import { Router } from 'express';
import { createToken, getAll, update, getByDocument, getBBTC, transferBuy, transferSell } from '../controllers/wallet.controller';
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const router = Router();

// const swaggerOptions = {
//     'swaggerDefinitions': {
//         'info': {
//             'titles': 'Wallet Api',
//             'description': 'Wallert info API',
//             'contact': {
//                 'name': 'dev'
//             },
//             'servers': ["http://localhost:5000/api/wallet/"]
//         }
//     },
//     'apis': ['wallet.routes.ts']
// }

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ya está papo",
        version: "0.1.0",
        description:
          "Acá tienes que probar papo",
      },
      servers: [
        {
          url: "http://localhost:5000/api/wallet/",
        },
      ],
    },
    apis: ['./*ts'],
  };

const swaggerDocs = swaggerJsDoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// router.post('/', createToken);
/**
 * @swagger
 * /
 * get:
 *      description: use this method to get all the persons
 *      response:
 *      '200':
 *          description: A succesful response
 */
router.get('/', getAll);
router.patch('/', update)
router.get('/document/:id', getByDocument)
router.get('/getBBVTC', getBBTC)
router.post('/transferBuy', transferBuy)
router.post('/transferSell', transferSell)

export default router;