module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_ptl = { ...req.body }
        
        if(req.params.id_mapa_ptl) mapa_ptl.id_mapa_ptl = req.params.id_mapa_ptl

        try {
            existeOuErro(mapa_ptl.id_mapa_ptl, 'Mapa PTL não informado!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(mapa_ptl.id_mapa_ptl) {
            app.bd('mapa_ptl')
            .update({ operacao: 'Sim' })
            .where({ id_mapa_ptl: mapa_ptl.id_mapa_ptl })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Sim' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const contar = async (req, res) => {
        app.bd('mapa_ptl')
        .count({qtde: 'id_mapa_ptl'})
        .first()
        .where({ operacao: 'Sim' })
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Não' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ondaExiste = await
        app.bd('mapa_ptl')
        .select( 'id_mapa_ptl' )
        .where({ id_mapa_ptl: req.params.id_mapa_ptl })

        try {
            existeOuErro(ondaExiste, 'Mapa PTL inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('mapa_ptl')
        .select('id_mapa_ptl', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ id_mapa_ptl: req.params.id_mapa_ptl})
        .first()
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_ptl')
            .update({ operacao: "Não" })
            .where({ id_mapa_ptl: req.params.id_mapa_ptl })
            existeOuErro(linhaDesativada, 'Mapa PTL inexistente!')
            res.status(200).send('Mapa PTL desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, contar, consultarAtivo, consultarId, excluir }
}