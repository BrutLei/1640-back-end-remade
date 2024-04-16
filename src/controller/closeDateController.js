import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const createNewCloseDates = async (req, res) => {
  const newCloseDate = new Date(req.body.date);
  console.log(newCloseDate);
  const academicYearId = parseInt(req.body.acaYearId);
  const facultyId = parseInt(req.body.facultyId);
  try {
    const existingFac = await prisma.closeddates.findFirst({ where: { facultyId: facultyId } });
    if (existingFac) {
      return res.status(400).send('Deadline for this faculty existed');
    }
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
    if (result) {
      const newCloseDates = await Promise.all(
        result.map(async (e) => {
          const faculty = await prisma.faculties.findFirst({ where: { id: e.facultyId } });
          return { ...e, faculty_name: faculty.name };
        }),
      );
      return res.status(200).send(newCloseDates);
    }
  } catch (error) {
    return res.status(404).send(`server error`);
  }
};

const fetchingFacultyCloseDate = async (req, res) => {
  const facultyId = req.params.id;
  try {
    if (facultyId) {
      const existingFac = await prisma.faculties.findUnique({ where: { id: parseInt(facultyId) } });
      if (existingFac) {
        const closeDate = await prisma.closeddates.findFirst({ where: { facultyId: parseInt(facultyId) } });
        return res.status(200).send(closeDate);
      } else {
        return res.status(400).send('Server Error');
      }
    }
  } catch (error) {
    throw error;
  }
};

const updateCloseDates = async (req, res) => {};

const deleteCloseDates = async (req, res) => {
  const deadlineId = req.params.id;
  try {
    const existingDeadline = await prisma.closeddates.findUnique({ where: { id: parseInt(deadlineId) } });
    if (existingDeadline) {
      const deleteDeadline = await prisma.closeddates.delete({ where: { id: parseInt(deadlineId) } });
      return res.status(200).json({ msg: 'Deadline deleted successfully', ...deleteDeadline });
    } else {
      return res.status(400).send('Cannot found');
    }
  } catch (error) {
    console.log(error);
  }
};

export { fetchAllCloseDates, createNewCloseDates, deleteCloseDates, updateCloseDates, fetchingFacultyCloseDate };
