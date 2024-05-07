import { app } from "./app";
import { SETTINGS } from "./seting/seting";
import { dbT } from "./db/mongo-.db";

const startApi = async () => {
  await dbT.run(SETTINGS.MONGO_URL);

  app.listen(SETTINGS.PORT, () => {
    console.log(`server   start`);
  });
};
startApi();
