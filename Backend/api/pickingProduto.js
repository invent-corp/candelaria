module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const pickingProduto = { ...req.body }

        app.bd('picking_produto')
        .insert({ id_produto: pickingProduto.id_produto, id_picking: pickingProduto.id_picking })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }

    const consultar = async (req, res) => {
        app.bd('picking_produto')
        .select({id_picking_produto:'id_picking_produto'}, {id_produto:'picking_produto.id_produto'}, {id_picking:'id_picking'}, 
                {sku:'produtos.sku'}, {descricao: 'produtos.descricao'})
        .join('produtos', 'picking_produto.id_produto', 'produtos.id_produto')
        .then(pickingProduto => res.json(pickingProduto))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const consPickingProduto = await
        app.bd('picking_produto')
        .select({id_picking_produto:'id_picking_produto'})
        .where({ id_picking_produto: req.params.id_picking_produto })

        try {
            existeOuErro(consPickingProduto, 'Picking Produto inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('picking_produto')
        .select({id_picking_produto:'id_picking_produto'}, {id_produto:'picking_produto.id_produto'}, {id_picking:'id_picking'}, 
                {sku:'produtos.sku'}, {descricao: 'produtos.descricao'})
        .join('produtos', 'picking_produto.id_produto', 'produtos.id_produto')
        .where({ id_picking_produto: req.params.id_picking_produto})
        .first()
        .then(pickingProduto => res.json(pickingProduto))
       .catch(err => res.status(500).send(err))
    }

    const consultarIdPicking = async (req, res) => {
        app.bd('picking_produto')
        .select({id_picking_produto:'id_picking_produto'}, {id_produto:'picking_produto.id_produto'}, {id_picking:'id_picking'}, 
                {sku:'produtos.sku'}, {descricao: 'produtos.descricao'})
        .join('produtos', 'picking_produto.id_produto', 'produtos.id_produto')
        .where({ id_picking: req.params.id_picking})
        .then(pickingProduto => res.json(pickingProduto))
        .catch(err => res.status(500).send(err))
    }

    const consultarIdProdutoPicking = async (req, res) => {
        app.bd('picking_produto')
        .select({descricao:'picking.descricao'})
        .join('picking', 'picking.id_picking','picking_produto.id_picking')
        .where({ id_produto: req.params.id_produto})
        .then(pickingProduto => res.json(pickingProduto))
        .catch(err => res.status(500).send(err))
    }    

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('picking_produto')
         //   .update({ situacao: "Inativo" })
            .where({ id_picking_produto: req.params.id_picking_produto })
            .del();
            existeOuErro(linhaDesativada, 'Produto inexistente!')
            res.status(200).send('Produto excluido com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarIdPicking, excluir, consultarIdProdutoPicking }
}