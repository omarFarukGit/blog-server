import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";

const port = config.port;

const main = async () => {
  try {
    await prisma.$connect();
    console.log("connect db successfully");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

main();
