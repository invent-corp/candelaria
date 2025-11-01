module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const grupo_acesso = { ...req.body }
        app.bd('grupo_acesso')
        .insert(grupo_acesso)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }

    const consultar = async (req, res) => {
        app.bd('grupo', 'grupo_acesso', 'acesso')
        .select('grupo_acesso.id_grupo_acesso', 'grupo_acesso.id_grupo', 'grupo_acesso.id_acesso', 
            {grupo: 'grupo.nome'}, 
            {nome: 'acesso.nome'}, {codigo: 'acesso.codigo'}, {classificacao: 'acesso.classificacao'}, { situacao: 'acesso.situacao' })
        .innerJoin('grupo_acesso', 'grupo.id_grupo', 'grupo_acesso.id_grupo')
        .innerJoin('acesso', 'grupo_acesso.id_acesso', 'acesso.id_acesso')
        .orderBy('classificacao', 'asc') 
        .then(grupo_acesso => res.json(grupo_acesso))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const grupoExiste = await
        app.bd('grupo_acesso')
        .select('id_grupo')
        .where({ id_grupo: req.params.id_grupo_acesso })
        .orderBy('id_acesso', 'asc') 

        try {
            existeOuErro(grupoExiste, 'Grupo de Acesso sem acessos associadas ou Grupo inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('grupo', 'grupo_acesso', 'acesso')
        .select('grupo_acesso.id_grupo_acesso', 'grupo_acesso.id_grupo', 'grupo_acesso.id_acesso', 
            {grupo: 'grupo.nome'}, 
            {nome: 'acesso.nome'}, {codigo: 'acesso.codigo'}, {classificacao: 'acesso.classificacao'}, { situacao: 'acesso.situacao' })
        .innerJoin('grupo_acesso', 'grupo.id_grupo', 'grupo_acesso.id_grupo')
        .innerJoin('acesso', 'grupo_acesso.id_acesso', 'acesso.id_acesso')
        .where({ 'grupo_acesso.id_grupo': req.params.id_grupo_acesso })
        .orderBy('classificacao', 'asc')
        .then(grupo_acesso => res.json(grupo_acesso))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('grupo_acesso')
            .delete('id_grupo_acesso')
            .where({ id_grupo: req.params.id_grupo_acesso })
            existeOuErro(linhaExcluida, 'Acesso inexistente!')
            res.status(200).send('Acesso excluído com Sucesso!')
        } catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}