import express from 'express';
import {
  fetchAllUsers,
  createNewUser,
  deleteUser,
  login,
  updateUser,
  getDetailUser,
} from '../controller/userController';
import { verifyToken } from '../middleware/JWTGenerate';

const user_router = express.Router();
user_router.get('/', verifyToken, fetchAllUsers);
user_router.post('/create', createNewUser);
user_router.delete('/delete/:id', verifyToken, deleteUser);
user_router.put('/update/:id', updateUser);
user_router.post('/login', login);
user_router.get('/get-details/:id', verifyToken, getDetailUser);

export default user_router;
