import express from 'express';
import { fetchAllUsers, createNewUser, deleteUser, login } from '../controller/userController';

const user_router = express.Router();
user_router.get('/', fetchAllUsers);
user_router.post('/create', createNewUser);
user_router.delete('/delete/:id', deleteUser);
user_router.post('/login', login);

export default user_router;
