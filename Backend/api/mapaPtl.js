module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_ptl = { ...req.body }
        
        if(req.params.id_mapa_ptl) mapa_ptl.id_mapa_ptl = req.params.id_mapa_ptl

        if(mapa_ptl.id_mapa_ptl) {
            app.bd('mapa_ptl')
            .update({ nome: mapa_ptl.nome, descricao: mapa_ptl.descricao, situacao: mapa_ptl.situacao })
            .where({ id_mapa_ptl: mapa_ptl.id_mapa_ptl })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('mapa_ptl')
            .insert(mapa_ptl)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao')
        .orderBy('nome')
        .then(mapa_ptl => res.json(mapa_ptl))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_ptl: req.params.id_mapa_ptl})
        .first()
        .then(mapa_ptl => res.json(mapa_ptl))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_ptl: req.params.id_mapa_ptl })
        .union([
            app.bd('mapa_ptl')
            .select('id_mapa_ptl', 'nome', 'descricao', 'situacao')
            .where({ 'mapa_ptl.situacao': 'Ativo'})
        ])
        .then(mapa_ptl => res.json(mapa_ptl))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_ptl')
            .update({ situacao: "Inativo" })
            .where({ id_mapa_ptl: req.params.id_mapa_ptl })
            existeOuErro(linhaDesativada, 'Mapa PTL inexistente!')
            res.status(200).send('Mapa PTL desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}