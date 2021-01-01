const { MongoClient } = require('mongodb');

let db = null;

const {
  DB_HOST: host,
  DB_USER: user,
  DB_PASS: password,
} = process.env;

async function getDb() {
  if (db) {
    return db;
  }

  const uri = `mongodb+srv://${user}:${password}@${host}/partnerPrayer?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db('partnerPrayer');
};

module.exports = { getDb };
