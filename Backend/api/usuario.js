const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const criptoSenha = senha => {
        const cripto = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(senha, cripto)
    }

    const salvar = async (req, res) => {
        const usuario = { ...req.body }

        if (req.params.id_usuario) usuario.id_usuario = req.params.id_usuario

        usuario.senha = criptoSenha(usuario.senha)
        delete usuario.confirmacaoSenha
        delete usuario.funcao

        if (usuario.id_usuario) {
            app.bd('usuario')
            .update({ nome: usuario.nome, login: usuario.login, email: usuario.email, id_funcao: usuario.id_funcao, admin: usuario.admin, tema_padrao: usuario.tema_padrao, fullscreen: usuario.fullscreen, situacao: usuario.situacao, libera_conferencia : usuario.libera_conferencia })
            .where({id_usuario: usuario.id_usuario})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('usuario')
            .insert({ nome: usuario.nome, login: usuario.login, email: usuario.email, id_funcao: usuario.id_funcao, admin: usuario.admin, tema_padrao: usuario.tema_padrao, fullscreen: usuario.fullscreen, situacao: usuario.situacao, libera_conferencia: usuario.libera_conferencia })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const salvarSenha = async (req, res) => {
        const usuario = { ...req.body }

        if (req.params.id_usuario) usuario.id_usuario = req.params.id_usuario

        usuario.senha = criptoSenha(usuario.senha)
        delete usuario.confirmacaoSenha
        delete usuario.funcao

        if (usuario.id_usuario) {
            app.bd('usuario')
            .update({ senha: usuario.senha })
            .where({id_usuario: usuario.id_usuario})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('usuario', 'funcao')
        .select('usuario.id_usuario', 'usuario.nome', 'usuario.login', 'usuario.email', {funcao: 'funcao.nome'}, 'usuario.id_funcao', 'usuario.admin', 'usuario.situacao', 'usuario.libera_conferencia')
        .innerJoin('funcao', 'usuario.id_funcao', 'funcao.id_funcao')
        .whereNot({ admin: req.params.adm })
        .then(usuario => res.json(usuario))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const usuarioExiste = await
        app.bd('usuario')
        .select('id_usuario')
        .where({ id_usuario: req.params.id_usuario })

        try {
            existeOuErro(usuarioExiste, 'Usuário inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('usuario', 'funcao')
        .select('usuario.id_usuario', 'usuario.nome', 'usuario.login', 'usuario.email', {funcao: 'funcao.nome'}, 'usuario.id_funcao', 'usuario.admin', 'usuario.situacao', 'usuario.libera_conferencia')
        .innerJoin('funcao', 'usuario.id_funcao', 'funcao.id_funcao')
        .where({ id_usuario: req.params.id_usuario})
        .first()
        .then(usuario => res.json(usuario))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('usuario')
            .update({ situacao: "Inativo" })
            .where({ id_usuario: req.params.id_usuario })
            existeOuErro(linhaDesativada, 'Usuário inexistente!')
            res.status(200).send('Usuário desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, salvarSenha, consultar, consultarId, excluir }
}