import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchAllFaculties = async (req, res) => {
  let faculties = await prisma.faculties.findMany();
  return res.json(faculties);
};

const createNewFaculty = async (req, res) => {
  const result = await prisma.faculties.create({
    data: {
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (result) {
    return res.status(200).send('Create new faculty successfully');
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
