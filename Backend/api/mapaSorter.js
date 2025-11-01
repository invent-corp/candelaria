module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_sorter = { ...req.body }
        
        if(req.params.id_mapa_sorter) mapa_sorter.id_mapa_sorter = req.params.id_mapa_sorter

        if(mapa_sorter.id_mapa_sorter) {
            app.bd('mapa_sorter')
            .update({ nome: mapa_sorter.nome, descricao: mapa_sorter.descricao, situacao: mapa_sorter.situacao })
            .where({ id_mapa_sorter: mapa_sorter.id_mapa_sorter })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('mapa_sorter')
            .insert(mapa_sorter)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao')
        .orderBy('nome')
        .then(mapa_sorter => res.json(mapa_sorter))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_sorter: req.params.id_mapa_sorter})
        .first()
        .then(mapa_sorter => res.json(mapa_sorter))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao')
        .where({ id_mapa_sorter: req.params.id_mapa_sorter })
        .union([
            app.bd('mapa_sorter')
            .select('id_mapa_sorter', 'nome', 'descricao', 'situacao')
            .where({ 'mapa_sorter.situacao': 'Ativo'})
        ])
        .then(mapa_sorter => res.json(mapa_sorter))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_sorter')
            .update({ situacao: "Inativo" })
            .where({ id_mapa_sorter: req.params.id_mapa_sorter })
            existeOuErro(linhaDesativada, 'Mapa Sorter inexistente!')
            res.status(200).send('Mapa Sorter desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}