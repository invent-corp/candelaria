module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const picking = { ...req.body }

        if(req.params.id_picking) picking.id_picking = req.params.id_picking

        if(picking.id_picking) {
            app.bd('picking')
            .update({ codigo: picking.codigo, descricao: picking.descricao, id_gateway: picking.id_gateway, coletor: picking.coletor, situacao: picking.situacao })
            .where({id_picking: picking.id_picking})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('picking')
            .insert(picking)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('picking', 'gateway')
        .select('picking.id_picking', 'picking.codigo', 'picking.descricao', 'picking.coletor', 'picking.id_gateway', 'picking.situacao',
            {gateway: 'gateway.nome'}, {detalhes: 'gateway.descricao'}, {ip: 'gateway.ip'}, {porta: 'gateway.porta'})
        .innerJoin('gateway', 'picking.id_gateway', 'gateway.id_gateway')
        .then(picking => res.json(picking))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const pickingExiste = await
        app.bd('picking')
        .select('id_picking')
        .where({ id_picking: req.params.id_picking })

        try {
            existeOuErro(pickingExiste, 'Picking inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('picking', 'gateway')
        .select('picking.id_picking', 'picking.codigo', 'picking.descricao', 'picking.coletor', 'picking.id_gateway', 'picking.situacao',
            {gateway: 'gateway.nome'}, {detalhes: 'gateway.descricao'}, {ip: 'gateway.ip'}, {porta: 'gateway.porta'})
        .innerJoin('gateway', 'picking.id_gateway', 'gateway.id_gateway')
        .where({ id_picking: req.params.id_picking})
        .first()
        .then(picking => res.json(picking))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('picking')
        .select('id_picking', 'descricao', 'codigo', 'situacao')
        .where({ id_picking: req.params.id_picking })
        .union([
            app.bd('picking')
            .select('id_picking', 'descricao', 'codigo', 'situacao')
            .where({ situacao: 'Ativo'})
            .whereNotIn('id_picking', [
                app.bd('ptl')
                .select('id_picking')
                .where({ id_mapa_ptl: req.params.id_mapa_ptl })
            ])
        ])
        .orderBy('codigo', 'descricao')
        .then(picking => res.json(picking))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('picking')
            .update({ situacao: "Inativo" })
            .where({ id_picking: req.params.id_picking })
            existeOuErro(linhaDesativada, 'Picking inexistente!')
            res.status(200).send('Picking desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}