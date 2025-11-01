module.exports = app => {

    const sql = require('mssql')
    const postgres = require('pg')
    const config = require('../knexfile.js')

    var pg = new postgres.Pool(config.connection)

    const salvar = async (req, res) => {
        var etiqueta = req.params.etiqueta
        var pallet = req.params.pallet
        var tipo = req.params.tipo
        var caixa = req.params.caixa
        var usuario = req.params.usuario
            pg.connect()
            .then(client => {
                // Stored procedure
                return client.query(`SELECT * from public."SP_PTM_MARAVILHA"('${etiqueta}','${pallet}','${tipo}','${caixa}','${usuario}')`)
                .then(result => { 
                    client.release()
                    res.json(result.rows[0])
                    console.log(result.rows[0])      
                })
          //      .catch(err => res.status(500).send(err))
            })
    }

    return { salvar }
}