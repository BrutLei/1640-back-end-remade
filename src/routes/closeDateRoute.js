import express from 'express';
import {
  fetchAllCloseDates,
  createNewCloseDates,
  deleteCloseDates,
  updateCloseDates,
} from '../controller/closeDateController';

const close_date_route = express.Router();

close_date_route.get('/', fetchAllCloseDates);
close_date_route.post('/create', createNewCloseDates);
close_date_route.put('/update/:id', updateCloseDates);
close_date_route.delete('/delete/:id', deleteCloseDates);

export default close_date_route;
