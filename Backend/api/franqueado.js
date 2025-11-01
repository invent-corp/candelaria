module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const franqueado = { ...req.body }
        
        if(req.params.id_franqueado) franqueado.id_franqueado = req.params.id_franqueado

        if(franqueado.id_franqueado) {
            app.bd('franqueado')
            .update({ codigo: franqueado.codigo, descricao: franqueado.descricao, situacao: franqueado.situacao })
            .where({ id_franqueado: franqueado.id_franqueado })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('franqueado')
            .insert(franqueado)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('franqueado')
        .select('id_franqueado', 'codigo', 'descricao',  'situacao')
        .orderBy('descricao', 'asc')
        .then(franqueado => res.json(franqueado))
   //     .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('franqueado')
        .select('id_franqueado', 'codigo', 'descricao', 'situacao')
        .where({ id_franqueado: req.params.id_franqueado})
        .first()
        .then(franqueado => res.json(franqueado))
   //     .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('franqueado')
        .select('id_franqueado', 'codigo', 'descricao', 'situacao')
        .where({ id_franqueado: req.params.id_franqueado})
        .where({ situacao: "Ativo"})
        .orderBy('descricao', 'asc')
        .then(franqueado => res.json(franqueado))
    //    .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('franqueado')
            .update({ situacao: "Inativo" })
            .where({ id_franqueado: req.params.id_franqueado })
            existeOuErro(linhaDesativada, 'Franqueado inexistente!')
            res.status(200).send('Franqueado desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}