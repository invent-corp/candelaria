module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_ptm = { ...req.body }
        
        if(req.params.id_mapa_ptm) mapa_ptm.id_mapa_ptm = req.params.id_mapa_ptm

        if(mapa_ptm.id_mapa_ptm) {
            app.bd('mapa_ptm')
            .update({ nome: mapa_ptm.nome, descricao: mapa_ptm.descricao, situacao: mapa_ptm.situacao })
            .where({ id_mapa_ptm: mapa_ptm.id_mapa_ptm })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('mapa_ptm')
            .insert(mapa_ptm)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao')
        .orderBy('nome')
        .then(mapa_ptm => res.json(mapa_ptm))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_ptm: req.params.id_mapa_ptm})
        .first()
        .then(mapa_ptm => res.json(mapa_ptm))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_ptm: req.params.id_mapa_ptm })
        .union([
            app.bd('mapa_ptm')
            .select('id_mapa_ptm', 'nome', 'descricao', 'situacao')
            .where({ 'mapa_ptm.situacao': 'Ativo'})
        ])
        .then(mapa_ptm => res.json(mapa_ptm))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_ptm')
            .update({ situacao: "Inativo" })
            .where({ id_mapa_ptm: req.params.id_mapa_ptm })
            existeOuErro(linhaDesativada, 'Mapa PTL inexistente!')
            res.status(200).send('Mapa PTL desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}