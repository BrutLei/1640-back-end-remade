import express from 'express';
import { fetchAllFaculties, createNewFaculty, deleteFaculty, updateFacultName } from '../controller/facultyController';

const faculty_router = express.Router();

faculty_router.get('/', fetchAllFaculties);
faculty_router.post('/create', createNewFaculty);
faculty_router.delete('/delete/:id', deleteFaculty);
faculty_router.put('/update/:id', updateFacultName);

export default faculty_router;
