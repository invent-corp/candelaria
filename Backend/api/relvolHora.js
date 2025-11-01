module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    if (config.client == 'mssql') {
        var formatDate = "FORMAT(data_leitura,'dd/MM/yyyy HH') as data"
        var formatDateGroup = "FORMAT(data_leitura,'dd/MM/yyyy HH')"
        var tipoCase = "CASE WHEN estacao_leitura = 'CONTINGÊNCIA' THEN 'CONTINGÊNCIA' ELSE 'SORTER' END as tipo"
    } else {
        var formatDate = "TO_CHAR(data_leitura,'dd/MM/yyyy HH24') as data"
        var formatDateGroup = "TO_CHAR(data_leitura,'dd/MM/yyyy HH24')"
        var tipoCase = "CASE WHEN estacao_leitura = 'CONTINGÊNCIA' THEN 'CONTINGÊNCIA' ELSE 'SORTER' END as tipo"
    }

    const consultar = async (req, res) => {
        app.bd('caixa')
        .select(knex.raw(formatDate))
        .select(knex.raw(tipoCase))
        .countDistinct({ qtde: 'etiqueta' })
     //   .count({qtde: 'id_caixa'})
        .whereNotNull('data_saida')
        .whereNot('etiqueta', 'NOREAD')
        .whereNotNull('etiqueta')
        .groupBy(knex.raw(formatDateGroup))
        .groupBy(knex.raw("CASE WHEN estacao_leitura = 'CONTINGÊNCIA' THEN 'CONTINGÊNCIA' ELSE 'SORTER' END"))
        .then(volume_hora => res.json(volume_hora))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('caixa')
        .select(knex.raw(formatDate))
        .select(knex.raw(tipoCase))
     //   .count({qtde: 'id_caixa'})
        .countDistinct({ qtde: 'etiqueta' })
        .whereNotNull('data_saida')
        .whereNot('etiqueta', 'NOREAD')
        .whereNotNull('etiqueta')
        .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
        .orderBy(knex.raw(formatDateGroup))
        .groupBy(knex.raw(formatDateGroup))
        .groupBy(knex.raw("CASE WHEN estacao_leitura = 'CONTINGÊNCIA' THEN 'CONTINGÊNCIA' ELSE 'SORTER' END"))
        .then(volume_hora => res.json(volume_hora))
        .catch(err => res.status(500).send(err))

        console.log('teste')
    }
 
    return { consultar, consultarData }
 }