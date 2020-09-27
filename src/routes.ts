import * as express from 'express'
import UserController from './controllers/userController'
import AuthController from './controllers/AuthController'
import authMiddleware from './middlewares/auth_middleware'
import { User } from './database/entity/User'

const router = express.Router()

router.post('/user', UserController.store)
router.get('/users', UserController.index)
router.get('/user/:id', UserController.show)
router.delete('/user/:id', UserController.delete)
router.put('/user', UserController.update)
router.put('/user_enabled', authMiddleware ,UserController.unabled_user)

router.post('/auth', AuthController.auth)
router.get('/rota_interna', authMiddleware, UserController.rota_interna)

export default router