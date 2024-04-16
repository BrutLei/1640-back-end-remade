import express from 'express';
import multer from 'multer';
import {
  fetchAllArticle,
  fetchAllFacultyArticle,
  createNewArticle,
  updateArticle,
  deleteArticle,
  fetchAllUserArticle,
} from '../controller/articleController';

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploadsArticle/'); // Change 'uploads/' to your desired folder path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

const article_route = express.Router();

article_route.get('/', fetchAllArticle);
article_route.get('/:facId', fetchAllFacultyArticle);
article_route.get('/user/:uId', fetchAllUserArticle);
article_route.post('/create', upload.single('file'), createNewArticle);
article_route.put('/update/:id', updateArticle);
article_route.delete('/delete/:id', deleteArticle);

export default article_route;
