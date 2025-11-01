module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const coletor = { ...req.body }
        
        if(req.params.id_coletor) coletor.id_coletor = req.params.id_coletor

        if(coletor.id_coletor) {
            app.bd('coletor')
            .update({ nome: coletor.nome, descricao: coletor.descricao, ip: coletor.ip, porta: coletor.porta, picking: coletor.picking, situacao: coletor.situacao })
            .where({ id_coletor: coletor.id_coletor })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('coletor')
            .insert(coletor)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('coletor')
        .select('id_coletor', 'nome', 'descricao', 'ip', 'porta', 'picking', 'situacao')

        .then(coletor => res.json(coletor))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('coletor')
        .select('id_coletor', 'nome', 'descricao', 'ip', 'porta', 'picking', 'situacao')
        .where({ id_coletor: req.params.id_coletor })
        .first()
        .then(coletor => res.json(coletor))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('coletor')
        .select('id_coletor', 'nome', 'descricao', 'picking', 'situacao')
        .where({ situacao: 'Ativo' })
        .whereNotIn('id_coletor', [
            app.bd('rampa_coletor')
            .select('rampa_coletor.id_coletor')
            .innerJoin('rampa', 'rampa_coletor.id_rampa', 'rampa.id_rampa')
            .innerJoin('coletor', 'rampa_coletor.id_coletor', 'coletor.id_coletor')
            // .where({ 'rampa_coletor.id_rampa': req.params.id_rampa })
        ])
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('coletor')
            .update({ situacao: "Inativo" })
            .where({ id_coletor: req.params.id_coletor })
            existeOuErro(linhaDesativada, 'Coletor inexistente!')
            res.status(200).send('Coletor desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}