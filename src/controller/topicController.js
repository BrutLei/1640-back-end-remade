import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchAllTopic = async (req, res) => {
  let topic = await prisma.topic.findMany();

  try {
    if (topic) {
      const newTopic = await Promise.all(
        topic.map(async (e) => {
          const faculty = await prisma.faculties.findFirst({ where: { id: e.facultyId } });
          return { ...e, faculty_name: faculty.name };
        }),
      );
      if (newTopic) {
        return res.status(200).send(newTopic);
      }
    }
  } catch (error) {
    // throw error;
    return res.status(400).send('There are error from server');
  }
};

const fetchTopicById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await prisma.topic.findFirst({ where: { id: parseInt(id) } });
    if (result) {
      return res.status(200).send(result);
    }
    return res.status(400).send('Cannot found topic');
  } catch (error) {
    throw error;
  }
};

const createNewTopic = async (req, res) => {
  const { name, description, fId, yId } = req.body;
  if (!name || !description || !fId || !yId) {
    return res.status(400).send('Missing data');
  }
  const existingTopicForFac = await prisma.topic.findFirst({ where: { facultyId: fId, academicYearId: yId } });
  if (existingTopicForFac) {
    return res.status(400).send('The topic for this faculty exists');
  }

  const yearOfTopic = await prisma.academicyears.findFirst({ where: { id: yId } });
  const currentYear = new Date().getFullYear();
  if (currentYear !== yearOfTopic.year.getFullYear()) {
    return res.status(400).send('Can only create topic for current year');
  }
  try {
    const result = await prisma.topic.create({
      data: {
        name: name,
        description: description,
        facultyId: fId,
        academicYearId: yId,
      },
    });
    if (result) {
      return res.status(200).send(result);
    }
  } catch (error) {
    throw error;
  }
};

function findTopicForCurrentYear(arr, currentYear) {
  for (const element of arr) {
    if (element.year.getFullYear() == currentYear) {
      return element;
    }
  }
  return false;
}

const fetchTopicForFaculty = async (req, res) => {
  const fId = req.params.id;
  try {
    const result = await prisma.topic.findMany({ where: { facultyId: parseInt(fId) } });
    // return res.status(200).send(result);
    if (result.length !== 0) {
      const resultWithYear = await Promise.all(
        result.map(async (topic) => {
          const year = await prisma.academicyears.findFirst({ where: { id: topic.academicYearId } });
          return { ...topic, year: year.year };
        }),
      );
      // console.table(resultWithYear);
      const currentYear = new Date().getFullYear();
      const topicForCurrentYear = findTopicForCurrentYear(resultWithYear, currentYear);

      if (!topicForCurrentYear) {
        return res.status(200).send("Still don't have a topic for this faculty this year");
      } else {
        return res.status(200).send(topicForCurrentYear);
      }
    } else {
      return res.status(400).send("Cannot found the faculty's topic");
    }
  } catch (error) {
    throw error;
  }
};
export { fetchAllTopic, createNewTopic, fetchTopicForFaculty, fetchTopicById };
