require("dotenv").config();
//specify the path to .env file
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

let client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    return "Connected to Database";
  } catch (e) {
    return e;
  }
}

module.exports = {
  connectDB,
  getDB: (dbName) => client.db(dbName),
};
