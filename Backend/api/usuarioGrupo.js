module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const usuario_grupo = { ...req.body }
        app.bd('usuario_grupo')
        .insert(usuario_grupo)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }    

    const consultar = async (req, res) => {
        app.bd('usuario_grupo', 'usuario', 'grupo')
        .select('usuario_grupo.id_usuario_grupo', 'usuario_grupo.id_usuario', 'usuario_grupo.id_grupo', 
        { usuario: 'usuario.nome' }, 
        { nome: 'grupo.nome' }, { descricao: 'grupo.descricao' }, { situacao: 'grupo.situacao' })
        .innerJoin('usuario', 'usuario_grupo.id_usuario', 'usuario.id_usuario')
        .innerJoin('grupo', 'usuario_grupo.id_grupo', 'grupo.id_grupo')
        .orderBy('grupo.nome', 'asc')
        .then(usuario_grupo => res.json(usuario_grupo))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const usuarioExiste = await
        app.bd('usuario_grupo')
        .select('id_usuario')
        .where({ id_usuario: req.params.id_usuario_grupo })

        try {
            existeOuErro(usuarioExiste, 'Usuário inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('usuario_grupo', 'usuario', 'grupo')
        .select('usuario_grupo.id_usuario_grupo', 'usuario_grupo.id_usuario', 'usuario_grupo.id_grupo', 
        { usuario: 'usuario.nome' }, 
        { nome: 'grupo.nome' }, { descricao: 'grupo.descricao' }, { situacao: 'grupo.situacao' })
        .innerJoin('usuario', 'usuario_grupo.id_usuario', 'usuario.id_usuario')
        .innerJoin('grupo', 'usuario_grupo.id_grupo', 'grupo.id_grupo')
        .where({ 'usuario.id_usuario': req.params.id_usuario_grupo })
        .orderBy('grupo.nome', 'asc')
        .then(usuario_grupo => res.json(usuario_grupo))
        .catch(err => res.status(500).send(err))           
    }
    
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('usuario_grupo')
            .delete('id_usuario_grupo')
            .where({ id_usuario: req.params.id_usuario_grupo })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}