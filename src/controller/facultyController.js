import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchAllFaculties = async (req, res) => {
  let faculties = await prisma.faculties.findMany();
  return res.json(faculties);
};

const fetchOneFaculty = async (req, res) => {
  const id = req.params.id;
  let faculty = await prisma.faculties.findUnique({ where: { id: parseInt(id) } });
  if (faculty) {
    return res.status(200).json(faculty);
  }
};

const createNewFaculty = async (req, res) => {
  let name = req.body.name;
  const existingFaculty = await prisma.faculties.findFirst({ where: { name: req.body.name } });
  if (existingFaculty) {
    return res.status(400).json({ error: 'Faculty already exists' });
  }

  let result = '';
  if (name) {
    result = await prisma.faculties.create({
      data: {
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
  if (result && name) {
    return res.status(200).json({ message: 'create new Faculty successful', ...result });
  } else if (!name) {
    return res.status(418).send('Missing name in request body');
  } else {
    return res.status(404).send('Failed when create new faculty');
  }
};

const deleteFaculty = async (req, res) => {
  const result = await prisma.faculties.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (result) {
    res.status(200).send('Deleted a faculty successfully');
  } else {
    res.status(404).send('Failed when delete a faculty');
  }
};

const updateFacultName = async (req, res) => {
  const newName = req.body.name;
  const id = req.params.id;
  if (!id) {
    return res.status(400).send('ID of faculty cannot be null !!!');
  }
  if (!newName) {
    return res.status(400).send('New name is required!!!');
  }
  try {
    const exist = await prisma.faculties.findUnique({ where: { id: parseInt(id) } });
    if (exist) {
      const result = await prisma.faculties.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: req.body.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return res.status(200).send(`Update faculty ${result.name} successfully`);
    } else {
      return res.status(200).send(`Cannot Found the faculty`);
    }
  } catch (error) {
    return res.status(404).send('Failed when update');
  }
};

const countArticlePerFact = async (req, res) => {
  try {
    const result = await prisma.faculties.findMany({
      include: { _count: { select: { articles: true } } },
    });
    const count = result.map((e) => {
      return {
        name: e.name,
        num_of_arts: e._count.articles,
      };
      // e.name, e._count.articles;
    });

    return res.status(200).json(count);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  fetchAllFaculties,
  fetchOneFaculty,
  createNewFaculty,
  deleteFaculty,
  updateFacultName,
  countArticlePerFact,
};
