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

module.exports = {
  findUser,
  createUser,
};
