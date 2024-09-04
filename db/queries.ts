import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function findUser(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

async function createUser(username: string, password: string) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
    },
  });

  return;
}

// Expects req.user
async function extractUser(user: any) {
  const extractedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return extractedUser;
}

async function createFolder(folderName: string, id: number) {
  const folder = await prisma.folder.create({
    data: {
      name: folderName,
      userId: id,
    },
  });

  return;
}

module.exports = {
  findUser,
  createUser,
  extractUser,
  createFolder,
};
