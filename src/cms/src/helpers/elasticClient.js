const { Client } = require('@opensearch-project/opensearch')

let client = null;

function initializeESClient() {
  let authConfig = {};
  if (process.env.ELASTIC_USERNAME) {
    authConfig = {
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
      }
    }
  }
  try {
    client = new Client({
      node: process.env.ELASTIC_HOST,
      ...authConfig
    });
  }
  catch (err) {
    console.log('Error while initializing the connection to ElasticSearch.')
    console.log(err);
  }
}

function doElasticSearch(params, options, callback) {
  return client.search(params, options, callback);
}

module.exports = {
  initializeESClient,
  doElasticSearch
}
