import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const createNewCloseDates = async (req, res) => {
  const { date, topicId } = req.body;
  try {
    const result = await prisma.closeddates.create({
      data: { closingDate: new Date(date), topicId: parseInt(topicId) },
    });
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
    return res.status(400).send('Create deadline for topic failed');
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

const fetchingTopicCloseDate = async (req, res) => {
  const topicId = req.params.id;
  try {
    if (topicId) {
      const existingTopic = await prisma.topic.findUnique({ where: { id: parseInt(topicId) } });
      if (existingTopic) {
        const closeDate = await prisma.closeddates.findFirst({ where: { topicId: parseInt(topicId) } });
        return res.status(200).send(closeDate);
      } else {
        return res.status(400).send('Server Error');
      }
    }
  } catch (error) {
    // throw error;
    return res.status(400).send('Server Error');
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

export { fetchAllCloseDates, createNewCloseDates, deleteCloseDates, updateCloseDates, fetchingTopicCloseDate };
