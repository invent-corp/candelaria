module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const grupo = { ...req.body }
        
        if(req.params.id_grupo) grupo.id_grupo = req.params.id_grupo

        if(grupo.id_grupo) {
            app.bd('grupo')
            .update({ nome: grupo.nome, descricao: grupo.descricao, situacao: grupo.situacao })
            .where({ id_grupo: grupo.id_grupo })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('grupo')
            .insert(grupo)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('grupo')
        .select('id_grupo', 'nome', 'descricao', 'admin', 'situacao')
        .whereNot({ admin: req.params.adm })
        .orderBy('nome', 'asc')
        .then(grupo => res.json(grupo))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('grupo')
        .select('id_grupo', 'nome', 'descricao', 'admin', 'situacao')
        .where({ id_grupo: req.params.id_grupo})
        .first()
        .then(grupo => res.json(grupo))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('grupo')
        .select('id_grupo', 'nome', 'descricao', 'admin', 'situacao')
        .whereNot({ admin: req.params.adm })
        .where({ situacao: "Ativo"})
        .orderBy('nome', 'asc')
        .then(grupo => res.json(grupo))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('grupo')
            .update({ situacao: "Inativo" })
            .where({ id_grupo: req.params.id_grupo })
            existeOuErro(linhaDesativada, 'Grupo inexistente!')
            res.status(200).send('Grupo desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}