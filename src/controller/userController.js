import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient().$extends(withAccelerate());

const fetchAllUsers = async (req, res) => {
  try {
    let users = await prisma.users.findMany();
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Cannot fetch user data');
  }
};

const createNewUser = async (req, res) => {
  let saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);

  let unHashedPass = req.body.password;
  let hashedPassword = await bcrypt.hashSync(unHashedPass, salt);

  try {
    const user = await prisma.users.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        groupId: req.body.groupId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (user) {
      return res.status(200).send('Create new user successfully');
    } else {
      return res.status(404).send('Failed when create new user');
    }
  } catch (error) {
    console.log(error);
  }
};

export { fetchAllUsers, createNewUser };
