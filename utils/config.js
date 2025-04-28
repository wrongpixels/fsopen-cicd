require('dotenv').config()

const MONGODB_URL = process.env.NODE_ENV.includes('test')?process.env.TEST_MONGO_URI:process.env.MONGODB_URI
const PORT = process.env.PORT || 3003

module.exports = { MONGODB_URL, PORT }