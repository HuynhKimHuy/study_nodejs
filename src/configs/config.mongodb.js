//lv 0 for newbie 
import dotenv from "dotenv";
dotenv.config(); 
const dev =  {
    app: {
        Port :process.env.PORT ||3050
    },
    db:{
        host : process.env.DEV_HOST ,
        port : process.env.DEV_PORT ,
        name: process.env.DEV_NAME 
    }
}

//lv1 cho me
 const pro =  {
    app: {
        Port :3050
    },
    db:{
        host : process.env.PRO_HOST || 3052,
        port : process.env.PRO_PORT || 27018,
        name: process.env.PRO_PORT  || "LV1Nodejs"
    }
}

// gán cho biến config có 2 giá trị là dev và pro
/**
 * {
  dev: {
    app: { Port: 3050 },
    db: { host: 'localhost', port: 27018, name: 'studyNodejs' }
  },
  pro: {
    app: { Port: 3050 },
    db: { host: 'localhost', port: 27018, name: 'LV1Nodejs' }
  }
}
 */
const config = {dev,pro}


const env = process.env.NODE_ENV || 'dev'
// env sẽ là chuỗi dev 
export default config[env];
// chỉ xuất ra config có key là env 

