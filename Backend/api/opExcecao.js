module.exports = app => {

    const sql = require('mssql')
    const postgres = require('pg')
    const config = require('../knexfile.js')

    var pg = new postgres.Pool(config.connection)

    const salvar = async (req, res) => {
        var etiqueta = req.params.etiqueta
        var peso = 0
        var largura = 0
        var altura = 0
        var comprimento = 0
  
        if (config.client == 'mssql') {

            sql.connect(config.connection)
            .then(result => {
            // Stored procedure
            return result.request()
                .input('ETIQUETA', sql.VarChar(100), etiqueta)
                .input('PESO', sql.Numeric, peso)
                .input('LARGURA', sql.Numeric, largura)
                .input('ALTURA', sql.Numeric, altura)
                .input('COMPRIMENTO', sql.Numeric, comprimento)
                .output('resultado', sql.VarChar(100))
                .output('destino', sql.VarChar(100))
                .execute('SP_VOLUME_EXCECAO')
            })
            .then(result => res.json(result.output))
            .catch(err => res.status(500).send(err))

        } else {

            pg.connect()
            .then(client => {
                // Stored procedure
                return client.query(`SELECT * from public."SP_VOLUME_EXCECAO"('${etiqueta}','${peso}','${largura}','${altura}','${comprimento}')`)
                .then(result => { 
                    client.release()
                    res.json(result.rows[0])      
                })
                .catch(err => res.status(500).send(err))
            })

        }
    }

    return { salvar }
}