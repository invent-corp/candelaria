module.exports = {
  client: 'pg',
  connection: {
    port: '5432',
    host: '127.0.0.1',
    database: 'postgres',
    user: 'postgres',
    password: 'Sysvent@2021',
  },
  pool: {
    min: 2,
    max: 10
  }
}


