module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const funcao = { ...req.body }
        
        if(req.params.id_funcao) funcao.id_funcao = req.params.id_funcao

        try {
            existeOuErro(funcao.nome, 'Nome da Função não informada!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(funcao.id_funcao) {
            app.bd('funcao')
            .update({ nome: funcao.nome, situacao: funcao.situacao })
            .where({ id_funcao: funcao.id_funcao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('funcao')
            .insert(funcao)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('funcao')
        .select('id_funcao', 'nome', 'situacao')
        .orderBy('nome')
        .then(funcao => res.json(funcao))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('funcao')
        .select('id_funcao', 'nome', 'descricao', 'situacao')
        .where({ id_funcao: req.params.id_funcao })
        .union([
            app.bd('funcao')
            .select('id_funcao', 'nome', 'descricao', 'situacao')
            .where({ situacao: 'Ativo'})
        ])
        .then(funcao => res.json(funcao))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const funcaoExiste = await
        app.bd('funcao')
        .select('id_funcao')
        .where({ id_funcao: req.params.id_funcao })

        try {
            existeOuErro(funcaoExiste, 'Função inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('funcao')
        .select('id_funcao', 'nome', 'situacao')
        .where({ id_funcao: req.params.id_funcao})
        .first()
        .then(funcao => res.json(funcao))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('funcao')
            .update({ situacao: "Inativo" })
            .where({ id_funcao: req.params.id_funcao })
            existeOuErro(linhaDesativada, 'Função inexistente!')
            res.status(200).send('Função desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarAtivo, consultarId, excluir }
}