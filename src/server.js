import express from 'express';
import faculty_router from './routes/facultyRoute.js';
import user_router from './routes/userRoute.js';
import year_router from './routes/yearRoute.js';
import close_date_route from './routes/closeDateRoute.js';
import group_route from './routes/groupRoute.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import article_route from './routes/articleRoute.js';
import topic_route from './routes/topicRoute.js';

const port = 8080;
const app = express();

const allowedOrigins = [
  'https://1640-web-project-fe-remade.vercel.app/',
  'https://1640-web-project-fe-remade-brutleis-projects.vercel.app/',
  'https://1640-web-project-fe-remade.vercel.app/',
  'https://1640-web-project-fe-remade-cre2dbtfw-brutleis-projects.vercel.app/',
  'https://1640-web-project-fe-remade-git-main-brutleis-projects.vercel.app/',
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the origin is in the allowed origins list or if it is undefined (in case of same-origin requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Enable credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.options('*', cors());

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

// Topic route
/**url: port/topics/... */
app.use('/topics', topic_route);

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
    res.attachment;
  }
});
app.use('/images', express.static('uploadsArticle'));

// app.get('/images', (req, res) => {
//   const imagePath = path.dirname('./uploadsArticle/1713422209248-Authorize_module.png'); // Adjust path if using a different storage solution
//   return res.status(418).send(imagePath);

//   try {
//     if (!fs.existsSync(imagePath)) {
//       throw new Error('Image not found');
//     }
//     const imageData = fs.readFileSync(imagePath); // Adjust for reading from storage

//     res.setHeader('Content-Type', 'image/jpeg'); // Set appropriate content type
//     res.send(imageData);
//   } catch (error) {
//     res.status(404).send('Image not found');
//   }
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port} open: http://localhost:${port}`);
});
