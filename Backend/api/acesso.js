module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const acesso = { ...req.body }

        if (req.params.id_acesso) acesso.id_acesso = req.params.id_acesso

        try {
            existeOuErro(acesso.nome, 'Nome do Nível de Acesso não informado!')
        }
        catch (msg) {
            return res.status(400).send(msg)
        }

        if (acesso.id_acesso) {
            app.bd('acesso')
            .update({ nome: acesso.nome, codigo: acesso.codigo, classificacao: acesso.classificacao, situacao: acesso.situacao })
            .where({ id_acesso: acesso.id_acesso })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('acesso')
            .insert(acesso)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('acesso')
        .select('id_acesso', 'nome', 'codigo', 'classificacao', 'admin', 'situacao')
        .whereNot({ admin: req.params.adm })
        .orderBy('classificacao', 'asc')
        .then(acesso => res.json(acesso))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('acesso')
        .select('id_acesso', 'nome', 'codigo', 'classificacao', 'admin', 'situacao')
        .where({ id_acesso: req.params.id_acesso })
        .first()
        .then(acesso => res.json(acesso))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('acesso')
        .select('id_acesso', 'nome', 'codigo', 'classificacao', 'admin', 'situacao')
        .whereNot({ admin: req.params.adm })
        .where({ situacao: "Ativo" })
        .orderBy('classificacao', 'asc')
        .then(acesso => res.json(acesso))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('acesso')
            .update({ situacao: "Inativo" })
            .where({ id_acesso: req.params.id_acesso })
            existeOuErro(linhaDesativada, 'acesso inexistente!')
            res.status(200).send('acesso desativada com Sucesso!')
        }
        catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}