module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const transportadoras = { ...req.body }

        if(req.params.id_transportadora) transportadoras.id_transportadora = req.params.id_transportadora

        if(transportadoras.id_transportadora) {
            app.bd('transportadoras')
            .update({ razao_social: transportadoras.razao_social, nome_fantasia: transportadoras.nome_fantasia, 
                      cnpj: transportadoras.cnpj, situacao: transportadoras.situacao })
            .where({id_transportadora: transportadoras.id_transportadora})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('transportadoras')
            .insert({ razao_social: transportadoras.razao_social, nome_fantasia: transportadoras.nome_fantasia, 
                cnpj: transportadoras.cnpj, situacao: transportadoras.situacao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('transportadoras')
        .select({id_transportadora:'id_transportadora'}, {razao_social:'razao_social'}, {nome_fantasia:'nome_fantasia'}, 
                {cnpj:'cnpj'}, {situacao:'situacao'})
        .then(transportadoras => res.json(transportadoras))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const consTransportadoras = await
        app.bd('transportadoras')
        .select({id_transportadora:'id_transportadora'})
        .where({ id_transportadora: req.params.id_transportadora })

        try {
            existeOuErro(consTransportadoras, 'Transportadora inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('transportadoras')
        .select({id_transportadora:'id_transportadora'}, {razao_social:'razao_social'}, {nome_fantasia:'nome_fantasia'}, 
                {cnpj:'cnpj'}, {situacao:'situacao'})
        .where({ id_transportadora: req.params.id_transportadora})
        .first()
        .then(transportadoras => res.json(transportadoras))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('transportadoras')
        .select({id_transportadora:'id_transportadora'}, {razao_social:'razao_social'}, {nome_fantasia:'nome_fantasia'}, 
                {cnpj:'cnpj'}, {situacao:'situacao'})
        .where({ id_transportadora: req.params.id_transportadora })
        .orderBy('nome_fantasia')
        .then(transportadoras => res.json(transportadoras))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('transportadoras')
            .update({ situacao: "Inativo" })
            .where({ id_transportadora: req.params.id_transportadora })
            existeOuErro(linhaDesativada, 'Transportadora inexistente!')
            res.status(200).send('Transportadora desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}