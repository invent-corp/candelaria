module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultar = async (req, res) => {
        app.bd('produtos')
        .select('produtos.sku', 'produtos.codigo_produto', 'produtos.descricao', {picking: 'picking.descricao'})
        .leftJoin('picking_produto', 'picking_produto.id_produto', 'produtos.id_produto')
        .leftJoin('picking', 'picking.id_picking', 'picking_produto.id_picking')
        .orderBy('produtos.sku')
        .then(picking_produto => res.json(picking_produto))
        .catch(err => res.status(500).send(err))
    }

    return { consultar }
}