//lv 0 for newbie 
import dotenv from "dotenv";
dotenv.config(); 

const dev = {
  app: {
    Port: process.env.PORT || 3050
  },
  db: {
    host: process.env.DEV_HOST,
    port: process.env.DEV_PORT,
    name: process.env.DEV_NAME
  }
};

const pro = {
  app: {
    Port: 3050
  },
  db: {
    host: process.env.PRO_HOST || "localhost",
    port: process.env.PRO_PORT || 27018,
    name: process.env.PRO_NAME || "LV1Nodejs"
  }
};

const config = { dev, pro };

const env = process.env.NODE_ENV || "dev";
export default config[env];

