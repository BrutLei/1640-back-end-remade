import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const createNewGroup = async (req, res) => {
  const name = req.body.name;
  try {
    const result = await prisma.groups.create({
      data: {
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (result) {
      return res.status(200).json({
        msg: 'Create new group successfully',
        info: result,
      });
    }
  } catch (error) {
    return res.status(400).send('Server error');
  }

  return res.json();
};
const fetchAllGroups = async (req, res) => {
  try {
    const groups = await prisma.groups.findMany();
    if (groups) {
      return res.status(200).send(groups);
    }
  } catch (error) {
    return res.status(400).send('Server error');
  }
};
const updateGroupName = async (req, res) => {
  return res.json();
};
const deleteGroup = async (req, res) => {
  return res.json();
};

module.exports = {
  fetchAllGroups,
  createNewGroup,
  updateGroupName,
  deleteGroup,
};
