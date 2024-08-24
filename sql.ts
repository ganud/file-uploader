import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const db = require("./db/queries");

async function main() {
  await prisma.user.create({
    data: {
      username: "walter",
      password: "hank",
    },
  });
}

main();
