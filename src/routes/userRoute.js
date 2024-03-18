import express from 'express';
import { fetchAllUsers, createNewUser } from '../controller/userController';

const user_router = express.Router();
user_router.get('/', fetchAllUsers);
user_router.post('/create', createNewUser);

export default user_router;
