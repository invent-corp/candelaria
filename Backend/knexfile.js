module.exports = {
  client: 'pg',
  connection: {
    // PRODUCAO
    //  host: '192.168.0.132', 
    //  database: 'velox',
    //  user: 'velox',
    //  password: 'velox23',

    // HML
  //    host: '192.168.0.132', 
  //    database: 'velox_hml',
  //    user: 'velox',
   //   password: 'velox23',

    port: '5432',
    // LOCAL
    host: '127.0.0.1',
    database: 'maravilha_bkp',
   //   user: 'velox',
   //   password: 'velox23',
    user: 'postgres',
    password: '2021@Sysvent',
  },
  pool: {
    min: 2,
    max: 10
  }
}


