import { app } from "./app";
import { SETTINGS } from "./seting/seting";
import { dbStart, dbT } from "./db/mongo-.db";
import dotenv from "dotenv";

dotenv.config();

const startApi = async () => {
  console.log("startApi")
  // await dbT.run(SETTINGS.MONGO_URL);
  console.log(SETTINGS.MONGO_URL, 1)
  await dbStart(SETTINGS.MONGO_URL)
  console.log(process.env.MONGO_URL, 2)
  app.set('trust proxy', true)
  console.log("dsds")
  app.listen(SETTINGS.PORT, () => {
    console.log(`server   start`);
  });

  console.log(process.env.SALAM)
};
startApi();
