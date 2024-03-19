import express from 'express';
import faculty_router from './routes/facultyRoute.js';
import user_router from './routes/userRoute.js';
import cors from 'cors';

const port = 8080;
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Faculty route
/**url: port/faculties/... */
app.use('/faculties', faculty_router);

// User route
/**url: port/users/... */
app.use('/users', user_router);

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port} open: http://localhost:${port}`);
});
