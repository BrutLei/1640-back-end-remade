import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchingDetailYear = async (req, res) => {
  const yearId = req.params.id;
  let year = await prisma.academicyears.findFirst({ where: { id: parseInt(yearId) } });
  if (year) {
    return res.status(200).send(year.year);
  } else {
    return res.status(400).send(false);
  }
};

const fetchAllYears = async (req, res) => {
  let years = await prisma.academicyears.findMany();
  if (years) {
    const onlyYears = years.map((year) => {
      return { ...year, year: year.year.getFullYear() };
    });
    // console.log(onlyYears);
    return res.status(200).json(onlyYears);
  } else {
    return res.status(400).send('There are no any years in DB');
  }
};

const createNewYear = async (req, res) => {
  const year = req.body.year;
  try {
    const existingYear = await prisma.academicyears.findFirst({
      where: {
        year: new Date(year),
      },
    });

    if (existingYear) {
      return res.status(400).json({
        MS: 'year already exist', // MS
        EC: '1', //error code
        DT: '', //data
      });
    }
    const result = await prisma.academicyears.create({
      data: {
        year: new Date(year),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (result) {
      return res.status(200).json({
        msg: 'Create new year success full with info',
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteYear = async (req, res) => {
  try {
    const result = await prisma.academicyears.delete({ where: { id: parseInt(req.params.id) } });
    if (result) {
      return res.status(200).send(`Deleted a year successfully\n`);
    }
  } catch (error) {
    return res.status(400).send(`Failed when delete year`);
  }
};

const updateyear = async (req, res) => {
  try {
    const isYearExist = await prisma.academicyears.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (isYearExist) {
      const year = new Date(req.body.year);
      const result = await prisma.academicyears.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          year: year,
          createdAt: isYearExist.createdAt,
          updatedAt: new Date(),
        },
      });
      if (result) {
        return res.status(200).send('Update year succeed');
      }
    } else {
      return res.status(404).send('year not found');
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

export { fetchAllYears, createNewYear, deleteYear, updateyear, fetchingDetailYear };
