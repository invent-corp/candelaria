module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const endereco_ptm = { ...req.body }

        if(req.params.id_endereco_ptm) endereco_ptm.id_endereco_ptm = req.params.id_endereco_ptm

        if(endereco_ptm.id_endereco_ptm) {
            app.bd('endereco_ptm')
            .update({ codigo: endereco_ptm.codigo, descricao: endereco_ptm.descricao, situacao: endereco_ptm.situacao })
            .where({id_endereco_ptm: endereco_ptm.id_endereco_ptm})
            .then(_ => res.status(204).send())
     //       .catch(err => res.status(500).send(err))
        } else {
            app.bd('endereco_ptm')
            .insert(endereco_ptm)
            .then(_ => res.status(204).send())
    //        .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('endereco_ptm')
        .select('endereco_ptm.id_endereco_ptm', 'endereco_ptm.codigo', 'endereco_ptm.descricao', 'endereco_ptm.situacao')
        .then(endereco_ptm => res.json(endereco_ptm))
  //      .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const endereco_ptmExiste = await
        app.bd('endereco_ptm')
        .select('id_endereco_ptm')
        .where({ id_endereco_ptm: req.params.id_endereco_ptm })

        try {
            existeOuErro(endereco_ptmExiste, 'endereco_ptm inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('endereco_ptm')
        .select('endereco_ptm.id_endereco_ptm', 'endereco_ptm.codigo', 'endereco_ptm.descricao', 'endereco_ptm.situacao')
        .where({ id_endereco_ptm: req.params.id_endereco_ptm})
        .first()
        .then(endereco_ptm => res.json(endereco_ptm))
  //      .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('endereco_ptm')
        .select('id_endereco_ptm', 'descricao', 'codigo', 'situacao')
        .where({ id_endereco_ptm: req.params.id_endereco_ptm })
        .union([
            app.bd('endereco_ptm')
            .select('id_endereco_ptm', 'descricao', 'codigo', 'situacao')
            .where({ situacao: 'Ativo'})
            .whereNotIn('id_endereco_ptm', [
                app.bd('ptm')
                .select('id_endereco_ptm')
                .where({ id_mapa_ptm: req.params.id_mapa_ptm })
            ])
        ])
        .orderBy('codigo', 'descricao')
        .then(endereco_ptm => res.json(endereco_ptm))
   //     .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('endereco_ptm')
            .update({ situacao: "Inativo" })
            .where({ id_endereco_ptm: req.params.id_endereco_ptm })
            existeOuErro(linhaDesativada, 'Endereço inexistente!')
            res.status(200).send('Endereço desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}