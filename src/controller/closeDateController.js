import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const createNewCloseDates = async (req, res) => {
  const newCloseDate = new Date(req.body.date);
  console.log(newCloseDate);
  const academicYearId = parseInt(req.body.acaYearId);
  const facultyId = parseInt(req.body.facultyId);
  try {
    const closeDate = await prisma.closeddates.create({
      data: {
        closingDate: newCloseDate,
        academicYearId: academicYearId,
        facultyId: facultyId,
        createdAt: new Date(),
        updatedAt: new Date(0),
      },
    });
    return res.status(200).json({
      msg: 'Create new year success',
      data: closeDate,
    });
  } catch (error) {
    throw error;
  }
};

const fetchAllCloseDates = async (req, res) => {
  try {
    const result = await prisma.closeddates.findMany();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(404).send(`server error`);
  }
};

const updateCloseDates = async (req, res) => {};

const deleteCloseDates = async (req, res) => {};

export { fetchAllCloseDates, createNewCloseDates, deleteCloseDates, updateCloseDates };
