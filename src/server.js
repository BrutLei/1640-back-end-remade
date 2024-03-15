import express from 'express';
import initWebRoutes from './routes/helloWorldRoute.js';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const app = express();
const port = 8080;
app.use(express.json());

initWebRoutes(app);

app.post('/create/faculty', async (req, res) => {
  const faculty = await prisma.faculties.create({
    data: {
      name: 'Computer Science',
      createdAt: new Date(0),
      updatedAt: new Date(0),
    },
  });
  if (faculty) {
    res.status(200).send('Create new faculty successfully');
  }
});

app.get('/faculties', async (req, res, next) => {
  const faculties = await prisma.faculties.findMany();
  console.log(faculties);
  res.status(202).send({ faculties });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port} open: http://localhost:${8080}`);
});
