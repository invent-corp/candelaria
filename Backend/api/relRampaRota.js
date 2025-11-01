module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultarId = async (req, res) => {
        app.bd('mapa_sorter', 'rampa', 'rota')
        .select({mapa: 'mapa_sorter.nome'}, {s_mapa: 'mapa_sorter.situacao'}, {rampa: 'rampa.nome'}, {s_rampa: 'rampa.situacao'}, {rota: 'rota.descricao'}, {s_rota: 'rota.situacao'}, 'rota.codigo', 'rota.cod_inicial', 'rota.cod_final')
        .innerJoin('sorter', 'sorter.id_mapa_sorter', 'mapa_sorter.id_mapa_sorter')
        .innerJoin('rampa', 'rampa.id_rampa', 'sorter.id_rampa')
        .leftOuterJoin('rota_sorter', 'rota_sorter.id_sorter', 'sorter.id_sorter')
        .leftOuterJoin('rota', 'rota.id_rota', 'rota_sorter.id_rota')
        .where({ 'mapa_sorter.id_mapa_sorter': req.params.id_mapa_sorter })
        .then(rampa_rota => res.json(rampa_rota))
        .catch(err => res.status(500).send(err))
    }

    return { consultarId }
}