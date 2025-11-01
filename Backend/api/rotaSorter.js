module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rota_sorter = { ...req.body }
        app.bd('rota_sorter')
        .insert(rota_sorter)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }    

    const consultar = async (req, res) => {
        app.bd('rota_sorter', 'rota', 'sorter')
        .select('rota_sorter.id_rota_sorter', 'rota_sorter.id_sorter', 'rota_sorter.id_rota', 
        { codigo: 'rota.codigo' }, { cod_inicial: 'rota.cod_inicial' }, { cod_final: 'rota.cod_final' }, { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_sorter.id_rota', 'rota.id_rota')
        .innerJoin('sorter', 'rota_sorter.id_sorter', 'sorter.id_sorter')
        .then(rota_sorter => res.json(rota_sorter))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const sorterExiste = await
        app.bd('rota_sorter')
        .select('id_sorter')
        .where({ id_sorter: req.params.id_rota_sorter })

        try {
            existeOuErro(sorterExiste, 'Mapa Rampa inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('rota_sorter', 'rota', 'sorter')
        .select('rota_sorter.id_rota_sorter', 'rota_sorter.id_sorter', 'rota_sorter.id_rota', 
        { codigo: 'rota.codigo' }, { cod_inicial: 'rota.cod_inicial' }, { cod_final: 'rota.cod_final' }, { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_sorter.id_rota', 'rota.id_rota')
        .innerJoin('sorter', 'rota_sorter.id_sorter', 'sorter.id_sorter')
        .where({ 'sorter.id_sorter': req.params.id_rota_sorter })
        .orderBy('rota.descricao')
        .then(rota_sorter => res.json(rota_sorter))
        .catch(err => res.status(500).send(err))  
    }
   
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('rota_sorter')
            .delete('id_rota_sorter')
            .where({ id_sorter: req.params.id_rota_sorter })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa Rampa X Rota excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}