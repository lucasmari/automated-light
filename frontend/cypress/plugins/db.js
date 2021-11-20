const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/';

const client = new MongoClient(uri);
async function connect() {
  await client.connect();

  return client.db('mongoid_dev');
}

async function disconnect() {
  await client.close();
}

module.exports = { connect, disconnect };
