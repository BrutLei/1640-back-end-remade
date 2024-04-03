import express from 'express';
import { fetchAllGroups, createNewGroup, updateGroupName, deleteGroup } from '../controller/groupController';
import { verifyToken } from '../middleware/JWTGenerate';

const group_router = express.Router();

group_router.get('/', fetchAllGroups);
group_router.post('/create', createNewGroup);
group_router.put('/update/:id', updateGroupName);
group_router.delete('/delete/:id', deleteGroup);

export default group_router;
