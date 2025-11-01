module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const gateway = { ...req.body }
        
        if(req.params.id_gateway) gateway.id_gateway = req.params.id_gateway

        if(gateway.id_gateway) {
            app.bd('gateway')
            .update({ nome: gateway.nome, descricao: gateway.descricao, ip: gateway.ip, porta: gateway.porta, situacao: gateway.situacao })
            .where({ id_gateway: gateway.id_gateway })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('gateway')
            .insert(gateway)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('gateway')
        .select('id_gateway', 'nome', 'descricao', 'ip', 'porta', 'situacao')
        .then(gateway => res.json(gateway))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('gateway')
        .select('id_gateway', 'nome', 'descricao', 'ip', 'porta', 'situacao')
        .where({ id_gateway: req.params.id_gateway})
        .first()
        .then(gateway => res.json(gateway))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('gateway')
        .select('id_gateway', 'nome', 'descricao', 'ip', 'porta', 'situacao')
        .where({ id_gateway: req.params.id_gateway })
        .union([
            app.bd('gateway')
            .select('id_gateway', 'nome', 'descricao', 'ip', 'porta', 'situacao')
            .where({ situacao: 'Ativo'})
        ])
        .then(gateway => res.json(gateway))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('gateway')
            .update({ situacao: "Inativo" })
            .where({ id_gateway: req.params.id_gateway })
            existeOuErro(linhaDesativada, 'Gateway inexistente!')
            res.status(200).send('Gateway desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

   return { salvar, consultar, consultarId, consultarAtivo, excluir }
}