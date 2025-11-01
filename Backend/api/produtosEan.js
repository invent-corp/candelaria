module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const produtosEan = { ...req.body }

        if(req.params.id_produto_ean) produtosEan.id_produto_ean = req.params.id_produto_ean

        if(produtosEan.id_produto_ean) {
            app.bd('produtos_ean')
            .update({ id_produto: produtosEan.id_produto, codigo_ean: produtosEan.codigo_ean, descricao_ean: produtosEan.descricao_ean,
                      fator: produtosEan.fator, situacao: produtosEan.situacao })
            .where({id_produto_ean: produtosEan.id_produto_ean})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('produtos_ean')
            .insert({ id_produto: produtosEan.id_produto, codigo_ean: produtosEan.codigo_ean, descricao_ean: produtosEan.descricao_ean,
                      fator: produtosEan.fator, situacao: produtosEan.situacao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('produtos_ean')
        .select({id_produto_ean:'id_produto_ean'}, {id_produto:'id_produto'}, {codigo_ean:'codigo_ean'}, {descricao_ean:'descricao_ean'},
                {fator:'fator'}, {situacao:'situacao'})
        .then(produtosEan => res.json(produtosEan))
       .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const consProdutoEan = await
        app.bd('produtos_ean')
        .select({id_produto_ean:'id_produto_ean'})
        .where({ id_produto_ean: req.params.id_produto_ean })

        try {
            existeOuErro(consProdutoEan, 'Ean inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('produtos_ean')
        .select({id_produto_ean:'id_produto_ean'}, {id_produto:'id_produto'}, {codigo_ean:'codigo_ean'}, {descricao_ean:'descricao_ean'},
                {fator:'fator'}, {situacao:'situacao'})
        .where({ id_produto_ean: req.params.id_produto_ean})
        .first()
        .then(produtosEan => res.json(produtosEan))
        .catch(err => res.status(500).send(err))
    }

    const consultarIdProduto = async (req, res) => {
        app.bd('produtos_ean')
        .select({id_produto_ean:'id_produto_ean'}, {id_produto:'id_produto'}, {codigo_ean:'codigo_ean'}, {descricao_ean:'descricao_ean'},
                {fator:'fator'}, {situacao:'situacao'})
        .where({ id_produto: req.params.id_produto})
        .then(produtosEan => res.json(produtosEan))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('produtos_ean')
        .select({id_produto_ean:'id_produto_ean'}, {id_produto:'id_produto'}, {codigo_ean:'codigo_ean'}, {descricao_ean:'descricao_ean'},
                {fator:'fator'}, {situacao:'situacao'})
        .where({ id_produto_ean: req.params.id_produto_ean })
        .orderBy('codigo_ean')
        .then(produtosEan => res.json(produtosEan))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('produtos_ean')
         //   .update({ situacao: "Inativo" })
            .where({ id_produto_ean: req.params.id_produto_ean })
            .del();
            existeOuErro(linhaDesativada, 'Produto inexistente!')
            res.status(200).send('Produto excluido com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarIdProduto, consultarAtivo, excluir }
}