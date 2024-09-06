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

async function getFolders(id: number) {
  // Should not return anything if the user isn't logged in
  if (id === undefined) {
    return null;
  }

  const folders = await prisma.folder.findMany({
    where: {
      userId: id,
    },
  });
  return folders;
}

// Return folder row given id
async function findFolder(id: number) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
  });
  return folder;
}

// Update folder given id and name
async function updateFolder(id: number, name: string) {
  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });

  return;
}

module.exports = {
  findUser,
  createUser,
  extractUser,
  createFolder,
  getFolders,
  findFolder,
  updateFolder,
};
