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
  const { email, username, password, groupId, facultyId } = req.body;
  let saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  try {
    const existingEmail = await prisma.users.findFirst({ where: { email: email } });
    const existingGroup = await prisma.groups.findFirst({ where: { id: groupId } });
    const existingFaculty = await prisma.faculties.findFirst({ where: { id: facultyId } });

    if (existingEmail) {
      return res.status(400).json({
        MS: 'email already used', // MS
        EC: '1', //error code
        DT: '', //data
      });
    }

    let hashedPassword = '';
    try {
      let unHashedPass = password;
      hashedPassword = bcrypt.hashSync(unHashedPass, salt);
    } catch (error) {
      throw error;
    }

    let user = await prisma.users.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        groupId: existingGroup ? groupId : undefined,
        facultyId: existingFaculty ? facultyId : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    if (user) {
      return res.status(202).json({
        MS: ' Create new user successfull',
        EC: '0',
        DT: {
          username: user.username,
          email: user.email,
        },
      });
    }
  } catch (e) {
    return res.status(400).json({
      MS: e.MS,
      EC: e.name,
      DT: '',
    });
  }
};

const deleteUser = async (req, res) => {
  const result = await prisma.users.delete({ where: { id: parseInt(req.params.id) } });
  if (result) {
    return res.status(200).send(`Deleted a user successfully\n`);
  } else {
    return res.status(404).send('Failed when delete user');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate user input (optional)
    if (!email || !password) {
      return res.status(400).json({
        MS: 'Missing required fields',
        EC: '2',
        DT: '',
      });
    }

    // 2. Find user by email using Prisma
    const user = await prisma.users.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        MS: 'Invalid email or password',
        EC: '3',
        DT: '',
      });
    }
    // 3. Compare hashed passwords securely using bcrypt
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        MS: 'Invalid email or password',
        EC: '2',
        DT: '',
      });
    }
    // 4. Login successful (optional: generate and send JWT)
    //Replace with your authentication logic (e.g., JWT generation)

    // Checking if user belong to faculty
    if (user.facultyId) {
      const facultyData = await prisma.faculties.findUnique({ where: { id: user.facultyId } });

      res.json({
        MS: 'Login successful',
        EC: '0',
        DT: {
          faculty: {
            name: facultyData.name,
          },
          user: {
            name: user.username,
            email: user.email,
          },
        },
      });
    } else {
      console.log('User do not have specific faculty// not belong to any facuty');
      res.json({
        MS: 'Login successful',
        EC: '0-1',
        DT: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      MS: 'Internal server error',
      EC: '3',
      DT: '',
    });
  }
};

export { fetchAllUsers, createNewUser, deleteUser, login };
