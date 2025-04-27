require("dotenv").config();

const MONGODB_URL = process.env.NODE_ENV==='test'?process.env.TEST_MONGO_URI:process.env.MONGODB_URI;
const PORT = process.env.PORT;

module.exports = { MONGODB_URL, PORT };