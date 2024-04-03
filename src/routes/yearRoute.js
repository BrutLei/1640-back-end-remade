import express from 'express';
import { fetchAllYears, createNewYear, updateyear, deleteYear } from '../controller/academicYearController';

const year_router = express.Router();

year_router.get('/', fetchAllYears);
year_router.post('/create', createNewYear);
year_router.put('/update/:id', updateyear);
year_router.delete('/delete/:id', deleteYear);

export default year_router;
