import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcrypt';
import { generateJwt, generateRefreshJwt, verifyToken } from '../middleware/JWTGenerate';

const prisma = new PrismaClient().$extends(withAccelerate());

let saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password) => {
  let hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const fetchAllUsers = async (req, res) => {
  let users = await prisma.users.findMany();
  try {
    if (users) {
      const userList = await Promise.all(
        users.map(async (user) => {
          let faculty = null;
          let group = null;
          if (user.facultyId) {
            faculty = await prisma.faculties.findFirst({ where: { id: user.facultyId } });
          }
          if (user.groupId) {
            group = await prisma.groups.findFirst({ where: { id: user.groupId } });
          }
          return {
            id: user.id,
            avatar: user.avatar,
            username: user.username,
            email: user.email,
            group: group == null ? 'NOT' : group.name,
            faculty: faculty == null ? 'NOT' : faculty.name,
          };
        }),
      );
      if (userList) {
        return res.status(200).json(userList);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Cannot fetch user data');
  }
};

const createNewUser = async (req, res) => {
  const { email, username, password, groupId, facultyId } = req.body;

  try {
    const existingEmail = await prisma.users.findFirst({ where: { email: email } });

    let existingGroup = undefined;
    if (groupId) {
      existingGroup = await prisma.groups.findFirst({ where: { id: parseInt(groupId) } });
    }

    let existingFaculty = undefined;
    if (facultyId) {
      existingFaculty = await prisma.faculties.findFirst({ where: { id: parseInt(facultyId) } });
    }

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
      hashedPassword = hashPassword(unHashedPass);
    } catch (error) {
      throw error;
    }
    let user = await prisma.users.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        groupId: existingGroup ? parseInt(groupId) : undefined,
        facultyId: existingFaculty ? parseInt(facultyId) : undefined,
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
    throw e;
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
        EC: '4',
        DT: '',
      });
    }
    // 4. Login successful (optional: generate and send JWT)
    //Replace with your authentication logic (e.g., JWT generation)
    // Checking if user belong to faculty
    if (user.facultyId) {
      const facultyData = await prisma.faculties.findUnique({ where: { id: user.facultyId } });
      const groupData = await prisma.groups.findUnique({ where: { id: user.groupId } });
      const payload = {
        id: user.id,
        name: user.username,
        email: user.email,
        group: groupData.name,
        faculty: facultyData,
      };
      // set refresh token inside cookie

      // response token to user through basic flow
      let token = generateJwt({ ...payload });
      res.status(200).json({
        MS: 'Login successful',
        EC: '0-1',
        DT: {
          accessToken: token,
          // refreshToken: refreshToken,
        },
      });
    } else {
      const groupData = await prisma.groups.findUnique({ where: { id: user.groupId } });
      const payload = {
        id: user.id,
        name: user.username,
        email: user.email,
        group: groupData.name,
      };
      // set refresh token inside cookie

      // response token to user through basic flow
      let token = generateJwt({ ...payload });
      res.status(200).json({
        MS: 'Login successful',
        EC: '0-2',
        DT: {
          accessToken: token,
          // refreshToken: refreshToken,
        },
      });
    }
  } catch (error) {
    // throw error;
    res.status(500).json({
      MS: 'Internal server error',
      EC: '3',
      DT: '',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    const { username, email, facultyId, groupId } = req.body;
    const fId = parseInt(facultyId);
    const gId = parseInt(groupId);

    // const password = hashPassword(req.body.password);
    const result = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...user,
        username,
        email,
        facultyId: fId,
        groupId: gId,
        // password: password,
        updatedAt: new Date(),
      },
    });
    if (result) {
      return res.status(200).json({
        message: 'update user info successfully',
        data: {
          username: result.username,
          email: result.email,
          groupId: result.groupId,
          facultyId: result.facultyId,
        },
      });
    }
  } catch (error) {
    throw error;
    return res.status(400).json({
      message: error,
    });
  }
};

const getDetailUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.users.findUnique({ where: { id: id } });
    let faculty = null;
    if (user.facultyId) {
      faculty = await prisma.faculties.findUnique({ where: { id: user.facultyId } });
    }
    let groupName = '';
    if (user.groupId) {
      const group = await prisma.groups.findUnique({ where: { id: user.groupId } });
      groupName = group.name;
    }
    if (user) {
      res.status(200).json({
        id: user.id,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        group: groupName,
        faculty: faculty ? faculty : 'no faculty',
      });
    }
  } catch (error) {
    // throw error;
    res.status(400).json({
      message: 'server error',
      code: error.code,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({
      status: 'OK',
      message: 'Logout successfully',
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

export { fetchAllUsers, createNewUser, deleteUser, login, updateUser, getDetailUser, logout };
