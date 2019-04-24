var configValues = require('./dbConfig.json');

module.exports = {
  // host_name: 'https://hoclieu.sachmem.vn/',
  secret: 'nevershallwedie',
  db : {
    development: `mongodb://localhost:${configValues.port}/${configValues.database}`,
    production: `mongodb+srv://${configValues.user}:${configValues.password}@my-tools-server-8ay4q.gcp.mongodb.net/${configValues.prod_db}?retryWrites=true`
  }
}
