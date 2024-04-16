import express from 'express';
import faculty_router from './routes/facultyRoute.js';
import user_router from './routes/userRoute.js';
import year_router from './routes/yearRoute.js';
import close_date_route from './routes/closeDateRoute.js';
import group_route from './routes/groupRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import article_route from './routes/articleRoute.js';

const port = 8080;
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Faculty route
/**url: port/faculties/... */
app.use('/faculties', faculty_router);

// User route
/**url: port/users/... */
app.use('/users', user_router);

// Year route
/**url: port/years/... */
app.use('/years', year_router);

// Year route
/**url: port/closedates/... */
app.use('/closedates', close_date_route);

// Group route
/**url: port/groups/... */
app.use('/groups', group_route);

// Article route
/**url: port/groups/... */
app.use('/articles', article_route);

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

app.post('/download', (req, res) => {
  const { path } = req.body;
  console.log(path);
  if (path) {
    res.download(path);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port} open: http://localhost:${port}`);
});
