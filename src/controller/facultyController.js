import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchAllFaculties = async (req, res) => {
  let faculties = await prisma.faculties.findMany();
  return res.json(faculties);
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
    return res.status(200).json({ message: 'create new user successful', ...result });
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
  const result = await prisma.faculties.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (result) {
    console.log(result);
    res.status(200).send(`Update faculty ${result.name} successfully`);
  } else {
    res.status(404).send('Failed when update name of faculty');
  }
};

module.exports = {
  fetchAllFaculties,
  createNewFaculty,
  deleteFaculty,
  updateFacultName,
};
