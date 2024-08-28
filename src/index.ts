import { app } from "./app";
import { SETTINGS } from "./seting/seting";
import { dbStart, dbT } from "./db/mongo-.db";
import dotenv from "dotenv";

dotenv.config();

const startApi = async () => {
  console.log("startApi")
  // await dbT.run(SETTINGS.MONGO_URL);
  await dbStart(SETTINGS.MONGO_URL)
  app.set('trust proxy', true)

  app.listen(SETTINGS.PORT, () => {
    console.log(`server   start`);
  });

  console.log(process.env.SALAM)
};
startApi();
