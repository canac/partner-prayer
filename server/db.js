const { MongoClient } = require('mongodb');

let db = null;

const {
  DB_PROTOCOL: protocol,
  DB_HOST: host,
  DB_USER: user,
  DB_PASS: password,
} = process.env;

async function getDb() {
  if (db) {
    return db;
  }

  const auth = user || password ? `${user}:${password}@` : '';
  const uri = `${protocol}://${auth}${host}/partnerPrayer?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db('partnerPrayer');
};

module.exports = { getDb };
