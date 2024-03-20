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
  let unHashedPass = password;
  let hashedPassword = bcrypt.hashSync(unHashedPass, salt);

  try {
    const existingEmail = await prisma.users.findFirst({ where: { email: email } });
    const existingGroup = await prisma.groups.findFirst({ where: { id: groupId } });
    const existingFaculty = await prisma.faculties.findFirst({ where: { id: facultyId } });

    if (existingEmail) {
      return res.status(400).json({ error: 'email already used' });
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
      return res.status(202).json({ message: ' Create new user successfull', ...user });
    }
  } catch (e) {
    if (e) {
      // The .code property can be accessed in a type-safe manner
      if (e.cod) {
        console.log('There is a unique constraint violation, a new user cannot be created with this email');
      }
    }
    throw e;
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
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2. Find user by email using Prisma
    const user = await prisma.users.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // 3. Compare hashed passwords securely using bcrypt
    const isPasswordMatch = await bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // 4. Login successful (optional: generate and send JWT)
    // Replace with your authentication logic (e.g., JWT generation)

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { fetchAllUsers, createNewUser, deleteUser, login };
