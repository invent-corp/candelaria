module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const postos = { ...req.body }

        if(req.params.id_posto) postos.id_posto = req.params.id_posto

        if(postos.id_posto) {
            app.bd('postos')
            .update({ descricao: postos.descricao, finalizacao_manual: postos.finalizacao_manual, 
                      qtde_colunas: postos.qtde_colunas, qtde_max_picking: postos.qtde_max_picking,
                      qtde_max_prod_picking: postos.qtde_max_prod_picking, pad_picking: postos.pad_picking,
                      situacao: postos.situacao })
            .where({id_posto: postos.id_posto})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('postos')
            .insert({ descricao: postos.descricao, finalizacao_manual: postos.finalizacao_manual, 
                qtde_colunas: postos.qtde_colunas, qtde_max_picking: postos.qtde_max_picking,
                qtde_max_prod_picking: postos.qtde_max_prod_picking, pad_picking: postos.pad_picking,
                situacao: postos.situacao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('postos')
        .select({id_posto:'id_posto'}, {descricao:'descricao'}, {finalizacao_manual:'finalizacao_manual'}, 
                {qtde_colunas:'qtde_colunas'}, {qtde_max_picking:'qtde_max_picking'},{qtde_max_prod_picking:'qtde_max_prod_picking'},
                {pad_picking:'pad_picking'}, {situacao:'situacao'})
        .then(postos => res.json(postos))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const consPostos = await
        app.bd('postos')
        .select({id_posto:'id_posto'})
        .where({ id_posto: req.params.id_posto })

        try {
            existeOuErro(consPostos, 'Posto inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('postos')
        .select({id_posto:'id_posto'}, {descricao:'descricao'}, {finalizacao_manual:'finalizacao_manual'}, 
                {qtde_colunas:'qtde_colunas'}, {qtde_max_picking:'qtde_max_picking'},{qtde_max_prod_picking:'qtde_max_prod_picking'},
                {pad_picking:'pad_picking'}, {situacao:'situacao'})
        .where({ id_posto: req.params.id_posto})
        .first()
        .then(postos => res.json(postos))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('postos')
        .select({id_posto:'id_posto'}, {descricao:'descricao'}, {finalizacao_manual:'finalizacao_manual'}, 
                {qtde_colunas:'qtde_colunas'}, {qtde_max_picking:'qtde_max_picking'},{qtde_max_prod_picking:'qtde_max_prod_picking'},
                {pad_picking:'pad_picking'}, {situacao:'situacao'})
        .where({ id_posto: req.params.id_posto })
        .orderBy('descricao')
        .then(postos => res.json(postos))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('postos')
            .update({ situacao: "Inativo" })
            .where({ id_posto: req.params.id_posto })
            existeOuErro(linhaDesativada, 'Posto inexistente!')
            res.status(200).send('Posto desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}