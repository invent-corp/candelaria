module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_ptm = { ...req.body }
        
        if(req.params.id_mapa_ptm) mapa_ptm.id_mapa_ptm = req.params.id_mapa_ptm

        try {
            existeOuErro(mapa_ptm.id_mapa_ptm, 'Mapa PTM não informado!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(mapa_ptm.id_mapa_ptm) {
            app.bd('mapa_ptm')
            .update({ operacao: 'Sim' })
            .where({ id_mapa_ptm: mapa_ptm.id_mapa_ptm })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Sim' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const contar = async (req, res) => {
        app.bd('mapa_ptm')
        .count({qtde: 'id_mapa_ptm'})
        .first()
        .where({ operacao: 'Sim' })
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Não' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ondaExiste = await
        app.bd('mapa_ptm')
        .select( 'id_mapa_ptm' )
        .where({ id_mapa_ptm: req.params.id_mapa_ptm })

        try {
            existeOuErro(ondaExiste, 'Mapa PTM inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('mapa_ptm')
        .select('id_mapa_ptm', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ id_mapa_ptm: req.params.id_mapa_ptm})
        .first()
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_ptm')
            .update({ operacao: "Não" })
            .where({ id_mapa_ptm: req.params.id_mapa_ptm })
            existeOuErro(linhaDesativada, 'Mapa PTM inexistente!')
            res.status(200).send('Mapa PTM desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, contar, consultarAtivo, consultarId, excluir }
}