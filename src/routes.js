import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import DeliverymanController from './app/controllers/DeliverymanController'
import RecipientController from './app/controllers/RecipientController'
import DeliveryController from './app/controllers/DeliveryController'
import DeliveryActionController from './app/controllers/DeliveryActionController'
import DeliveredController from './app/controllers/DeliveredController'
import DeliveryWithProblemController from './app/controllers/DeliveryWithProblemController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/sessions', SessionController.store)

routes.post('/users', UserController.store)

routes.get('/deliveryman/:id/deliveries', DeliveryActionController.index)
routes.get('/deliveryman/:id/delivered', DeliveredController.index)
routes.put(
  '/deliveryman/:iddm/deliveries/:iddl',
  DeliveryActionController.update
)

routes.use(authMiddleware)

routes.put('/users', UserController.update)

routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:id', RecipientController.update)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/deliverymans', DeliverymanController.index)
routes.post('/deliverymans', DeliverymanController.store)
routes.put('/deliverymans/:id', DeliverymanController.update)
routes.delete('/deliverymans/:id', DeliverymanController.delete)

routes.get('/deliveries', DeliveryController.index)
routes.post('/deliveries', DeliveryController.store)
routes.put('/deliveries/:id', DeliveryController.update)
routes.delete('/deliveries/:id', DeliveryController.delete)

routes.get('/deliveries/problems', DeliveryWithProblemController.index)

export default routes
