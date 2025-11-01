module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const consultarId = async (req, res) => {
        app.bd('mapa_ptl', 'picking', 'rota')
        .select({mapa: 'mapa_ptl.nome'}, {s_mapa: 'mapa_ptl.situacao'}, {picking: 'picking.codigo'}, {s_picking: 'picking.situacao'}, {rota: 'rota.descricao'}, {s_rota: 'rota.situacao'}, 'rota.codigo', 'rota.cod_inicial', 'rota.cod_final')
        .innerJoin('ptl', 'ptl.id_mapa_ptl', 'mapa_ptl.id_mapa_ptl')
        .innerJoin('picking', 'picking.id_picking', 'ptl.id_picking')
        .leftOuterJoin('rota_ptl', 'rota_ptl.id_ptl', 'ptl.id_ptl')
        .leftOuterJoin('rota', 'rota.id_rota', 'rota_ptl.id_rota')
        .where({ 'mapa_ptl.id_mapa_ptl': req.params.id_mapa_ptl })
        .then(picking_rota => res.json(picking_rota))
        .catch(err => res.status(500).send(err))
    }

    return { consultarId }
}




