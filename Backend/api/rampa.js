module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rampa = { ...req.body }
        if (req.params.id_rampa) rampa.id_rampa = req.params.id_rampa

        if (rampa.id_rampa) {
            app.bd('rampa')
            .update({ nome: rampa.nome, numero_rampa: rampa.numero_rampa, descricao: rampa.descricao, situacao: rampa.situacao })
            .where({ id_rampa: rampa.id_rampa })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('rampa')
            .insert(rampa)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('rampa', 'coletor')
        .select('rampa.id_rampa', 'rampa.nome', 'rampa.numero_rampa', 'rampa.descricao', 'rampa.situacao',
        {coletor: 'coletor.nome'}, {descricao_coletor:'coletor.descricao'}, 'coletor.ip', 'coletor.porta', { coletor_s:'coletor.situacao'})
        .leftJoin('rampa_coletor', 'rampa_coletor.id_rampa', 'rampa.id_rampa')
        .leftJoin('coletor', 'coletor.id_coletor', 'rampa_coletor.id_coletor')
        .then(rampa => res.json(rampa))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('rampa')
        .select('id_rampa', 'nome', 'numero_rampa', 'descricao', 'situacao')
        .where({ id_rampa: req.params.id_rampa})
        .first()
        .then(rampa => res.json(rampa))
        .catch(err => res.status(500).send(err))
    }

const consultarAtivo = async (req, res) => {
    app.bd('rampa')
    .select('id_rampa', 'nome', 'numero_rampa', 'descricao', 'situacao')
    .where({ id_rampa: req.params.id_rampa })
    .union([
        app.bd('rampa')
        .select('id_rampa', 'nome', 'numero_rampa', 'descricao', 'situacao')
        .where({ situacao: 'Ativo'})
        .whereNotIn('id_rampa', [
            app.bd('sorter')
            .select('id_rampa')
            .where({ id_mapa_sorter: req.params.id_mapa_sorter })
        ])
    ])
    .orderBy('numero_rampa', 'nome')
    .then(picking => res.json(picking))
    .catch(err => res.status(500).send(err))
}

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('rampa')
            .update({ situacao: "Inativo" })
            .where({ id_rampa: req.params.id_rampa })
            existeOuErro(linhaDesativada, 'Rampa inexistente!')
            res.status(200).send('Rampa desativada com Sucesso!')
        }
        catch(msg) {
           res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}