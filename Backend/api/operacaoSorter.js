module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const mapa_sorter = { ...req.body }
        
        if(req.params.id_mapa_sorter) mapa_sorter.id_mapa_sorter = req.params.id_mapa_sorter

        try {
            existeOuErro(mapa_sorter.id_mapa_sorter, 'Mapa Sorter não informado!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(mapa_sorter.id_mapa_sorter) {
            app.bd('mapa_sorter')
            .update({ operacao: 'Sim' })
            .where({ id_mapa_sorter: mapa_sorter.id_mapa_sorter })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Sim' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const contar = async (req, res) => {
        app.bd('mapa_sorter')
        .count({qtde: 'id_mapa_sorter'})
        .first()
        .where({ operacao: 'Sim' })
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Não' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ondaExiste = await
        app.bd('mapa_sorter')
        .select( 'id_mapa_sorter' )
        .where({ id_mapa_sorter: req.params.id_mapa_sorter })

        try {
            existeOuErro(ondaExiste, 'Mapa Sorter inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ id_mapa_sorter: req.params.id_mapa_sorter})
        .first()
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_sorter')
            .update({ operacao: "Não" })
            .where({ id_mapa_sorter: req.params.id_mapa_sorter })
            existeOuErro(linhaDesativada, 'Mapa Sorter inexistente!')
            res.status(200).send('Mapa Sorter desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, contar, consultarAtivo, consultarId, excluir }
}