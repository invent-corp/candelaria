module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const sorter = { ...req.body }
        if(req.params.id_sorter) sorter.id_sorter = req.params.id_sorter

        if(sorter.id_sorter) {
            app.bd('sorter')
            .update({ id_mapa_sorter: sorter.id_mapa_sorter, id_rampa: sorter.id_rampa })
            .where({ id_sorter: sorter.id_sorter })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('sorter')
            .insert(sorter)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }    

    const consultar = async (req, res) => {
        app.bd('sorter', 'mapa_sorter', 'rampa')
        .select('sorter.id_sorter', 'sorter.id_rampa', 'sorter.id_mapa_sorter', 
        { mapa_sorter: 'mapa_sorter.nome' }, { mapa_descricao: 'mapa_sorter.descricao' }, { mapa_situacao: 'mapa_sorter.situacao' }, 
        { rampa: 'rampa.nome' }, { rampa_descricao: 'rampa.descricao' }, { rampa_situacao: 'rampa.situacao' })
        .innerJoin('mapa_sorter', 'sorter.id_mapa_sorter', 'mapa_sorter.id_mapa_sorter')
        .innerJoin('rampa ', 'sorter.id_rampa', 'rampa.id_rampa')
        .orderBy('mapa_sorter.nome', 'asc')
        .then(sorter => res.json(sorter))
        .catch(err => res.status(500).send(err))
    }

    const consultarCbx = async (req, res) => {
        app.bd('sorter', 'mapa_sorter', 'rampa')
        .select({ nome: 'mapa_sorter.nome' })
        .innerJoin('mapa_sorter', 'sorter.id_mapa_sorter', 'mapa_sorter.id_mapa_sorter')
        .innerJoin('rampa ', 'sorter.id_rampa', 'rampa.id_rampa')
        .groupBy('mapa_sorter.nome')
        .orderBy('mapa_sorter.nome', 'asc')
        .then(sorter => res.json(sorter))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const mapaExiste = await
        app.bd('sorter')
        .select('id_sorter')
        .where({ id_sorter: req.params.id_sorter })

        try {
            existeOuErro(mapaExiste, 'Sorter inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('sorter', 'mapa_sorter', 'rampa')
        .select('sorter.id_sorter', 'sorter.id_rampa', 'sorter.id_mapa_sorter', 
        { mapa_sorter: 'mapa_sorter.nome' }, { mapa_descricao: 'mapa_sorter.descricao' }, { mapa_situacao: 'mapa_sorter.situacao' }, 
        { rampa: 'rampa.nome' }, { rampa_descricao: 'rampa.descricao' }, { rampa_situacao: 'rampa.situacao' })
        .innerJoin('mapa_sorter', 'sorter.id_mapa_sorter', 'mapa_sorter.id_mapa_sorter')
        .innerJoin('rampa ', 'sorter.id_rampa', 'rampa.id_rampa')
        .where({ 'sorter.id_sorter': req.params.id_sorter })
        .first()
        .then(sorter => res.json(sorter))
        .catch(err => res.status(500).send(err))           
    }

    const consultarIdCad = async (req, res) => {
        app.bd('sorter')
        .select('id_sorter', 'id_mapa_sorter', 'id_rampa')
        .where({ id_mapa_sorter : req.params.id_mapa_sorter })
        .where({ id_rampa : req.params.id_rampa })
        .first()
        .then(sorter => res.json(sorter))
        .catch(err => res.status(500).send(err))
    }
    
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('sorter')
            .delete('id_sorter')
            .where({ id_sorter: req.params.id_sorter })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa Sorter X Rampa excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarCbx, consultarId, consultarIdCad, excluir }
}