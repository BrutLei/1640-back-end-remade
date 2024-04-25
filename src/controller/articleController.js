import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchSingleArticle = async (req, res) => {
  const artId = parseInt(req.params.id);
  try {
    const article = await prisma.articles.findUnique({ where: { id: artId } });
    if (article) {
      return res.status(200).send(article);
    } else {
      return res.status(400).send('Article Not Exist');
    }
  } catch (error) {
    // throw error;
    return res.status(400).send('There are error from server');
  }
};

const fetchAllArticle = async (req, res) => {
  let articles = await prisma.articles.findMany();

  try {
    if (articles) {
      const newArticles = await Promise.all(
        articles.map(async (e) => {
          const faculty = await prisma.faculties.findFirst({ where: { id: e.facultyId } });
          return { ...e, faculty_name: faculty.name };
        }),
      );
      if (newArticles) {
        return res.status(200).send(newArticles);
      }
    }
  } catch (error) {
    throw error;
    return res.status(400).send('There are error from server');
  }
};

const fetchAllFacultyArticle = async (req, res) => {
  const facultyId = req.params.facId;
  try {
    if (facultyId) {
      const existingFac = await prisma.faculties.findUnique({ where: { id: parseInt(facultyId) } });
      if (existingFac) {
        const articles = await prisma.articles.findMany({ where: { facultyId: parseInt(facultyId) } });
        if (articles) {
          const newArticles = await Promise.all(
            articles.map(async (e) => {
              const faculty = await prisma.faculties.findFirst({ where: { id: e.facultyId } });
              return { ...e, faculty_name: faculty.name };
            }),
          );
          if (newArticles) {
            return res.status(200).json(newArticles);
          }
        }
      } else {
        return res.status(400).send(`Faculty you're looking for is not exist`);
      }
    }
  } catch (error) {
    throw error;
  }
};

const fetchAllUserArticle = async (req, res) => {
  const userId = req.params.uId;
  try {
    if (userId) {
      const existingUser = await prisma.users.findUnique({ where: { id: parseInt(userId) } });
      if (existingUser) {
        const articles = await prisma.articles.findMany({ where: { userId: parseInt(userId) } });
        return res.status(200).json(articles);
      } else {
        return res.status(400).send(`Faculty you're looking for is not exist`);
      }
    }
  } catch (error) {
    throw error;
  }
};

// const downloadArticle

const createNewArticle = async (req, res) => {
  if (req.files) {
    // console.log('\nUpload successfully ->>> ', req.files.file[0].path);
    // console.log('\nUpload successfully ->>> ', req.files.image[0].path);
    // return res.status(200).send(req.files.image[0].path);
  }
  let articleDescription = req.body.desc;
  let date = req.body.date;
  let comment = req.body.cmt;
  let status = req.body.status;
  let userId = req.body.uId;
  let facultyId = req.body.fId;
  let yearId = req.body.yId;
  let file = req.files.file[0].path;
  let image = req.files.image[0].path;
  try {
    const result = await prisma.articles.create({
      data: {
        shortDescription: articleDescription,
        documentFile: file,
        comment: comment,
        imageFile: image,
        submittedDate: new Date(date),
        userId: parseInt(userId),
        facultyId: parseInt(facultyId),
        academicYearId: parseInt(yearId),
        reviewStatus: status,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateArticle = async (req, res) => {
  const artId = req.params.id;
  const status = req.body.status;
  try {
    const existingArt = await prisma.articles.findUnique({ where: { id: parseInt(artId) } });
    // console.log(existingArt);
    if (existingArt) {
      const articleUpdated = await prisma.articles.update({
        where: {
          id: parseInt(artId),
        },
        data: {
          ...existingArt,
          reviewStatus: status,
        },
      });
      return res.status(200).json(articleUpdated);
    } else {
      return res.status(400).send('Article do not exist');
    }
  } catch (error) {
    throw error;
  }
};
const commentArticle = async (req, res) => {
  const artId = req.params.id;
  const cmt = req.body.comment;
  if (!cmt) {
    return res.status(500).send('Comment content is required');
  }
  try {
    const existingArt = await prisma.articles.findUnique({ where: { id: parseInt(artId) } });
    // console.log(existingArt);
    if (existingArt) {
      const articleUpdated = await prisma.articles.update({
        where: {
          id: parseInt(artId),
        },
        data: {
          ...existingArt,
          comment: cmt,
        },
      });
      return res.status(200).json(articleUpdated);
    } else {
      return res.status(400).send('Article do not exist');
    }
  } catch (error) {
    throw error;
  }
};

const deleteArticle = async (req, res) => {
  const artId = req.params.id;
  try {
    const existingArt = await prisma.articles.findUnique({ where: { id: parseInt(artId) } });
    if (existingArt) {
      const deleteArticle = await prisma.articles.delete({ where: { id: parseInt(artId) } });
      return res.status(200).json({ msg: 'article deleted successfully', ...deleteArticle });
    } else {
      return res.status(400).send('Cannot found the article');
    }
  } catch (error) {
    throw error;
  }
};

const countArticlePerFact = async (req, res) => {
  try {
    const result1 = await prisma.articles.findMany();
    const result = await prisma.articles.groupBy({
      by: ['name'],
      _count: {
        id: true,
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    throw error;
  }
};

export {
  fetchAllArticle,
  fetchAllFacultyArticle,
  fetchAllUserArticle,
  createNewArticle,
  updateArticle,
  deleteArticle,
  commentArticle,
  fetchSingleArticle,
};
