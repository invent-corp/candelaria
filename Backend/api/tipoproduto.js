module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const tipo_produto = { ...req.body }
        
        if(req.params.id_tipo_produto) tipo_produto.id_tipo_produto = req.params.id_tipo_produto

        try {
            existeOuErro(tipo_produto.descricao, 'Descrição do Tipo do Produto não informada!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(tipo_produto.id_tipo_produto) {
            app.bd('tipo_produto')
            .update({ descricao: tipo_produto.descricao, situacao: tipo_produto.situacao })
            .where({ id_tipo_produto: tipo_produto.id_tipo_produto })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('tipo_produto')
            .insert(tipo_produto)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('tipo_produto')
        .select('id_tipo_produto', 'descricao', 'situacao')
        .orderBy('descricao')
        .then(tipo_produto => res.json(tipo_produto))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('tipo_produto')
        .select('id_tipo_produto', 'descricao', 'situacao')
        .where({ id_tipo_produto: req.params.id_tipo_produto })
        .union([
            app.bd('tipo_produto')
            .select('id_tipo_produto', 'descricao', 'situacao')
            .where({ situacao: 'Ativo'})
        ])
        .then(tipo_produto => res.json(tipo_produto))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const tipo_produtoExiste = await
        app.bd('tipo_produto')
        .select('id_tipo_produto')
        .where({ id_tipo_produto: req.params.id_tipo_produto })

        try {
            existeOuErro(tipo_produtoExiste, 'Tipo de Produto inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('tipo_produto')
        .select('id_tipo_produto', 'descricao', 'situacao')
        .where({ id_tipo_produto: req.params.id_tipo_produto})
        .first()
        .then(tipo_produto => res.json(tipo_produto))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('tipo_produto')
            .update({ situacao: "Inativo" })
            .where({ id_tipo_produto: req.params.id_tipo_produto })
            existeOuErro(linhaDesativada, 'Tipo Produto inexistente!')
            res.status(200).send('Tipo Produto desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarAtivo, consultarId, excluir }
}