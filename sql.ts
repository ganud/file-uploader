import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const db = require("./db/queries");

async function main() {
  console.log(
    await prisma.user.findUnique({
      where: {
        id: 4,
      },
    })
  );
}

main();
