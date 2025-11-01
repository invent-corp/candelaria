module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rota_ptl = { ...req.body }
        app.bd('rota_ptl')
        .insert(rota_ptl)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }

    const consultar = async (req, res) => {
        app.bd('rota_ptl', 'rota', 'ptl')
        .select('rota_ptl.id_rota_ptl', 'rota_ptl.id_ptl', 'rota_ptl.id_rota', 
        { codigo: 'rota.codigo' }, 'rota.cod_inicial', 'rota.cod_final', { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_ptl.id_rota', 'rota.id_rota')
        .innerJoin('ptl', 'rota_ptl.id_ptl', 'ptl.id_ptl')
        .then(rota_ptl => res.json(rota_ptl))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ptlExiste = await
        app.bd('rota_ptl')
        .select('rota_ptl.id_ptl')
        .where({ id_ptl: req.params.id_rota_ptl })

        try {
            existeOuErro(ptlExiste, 'Mapa Rampa inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('rota_ptl', 'rota', 'ptl')
        .select('rota_ptl.id_rota_ptl', 'rota_ptl.id_ptl', 'rota_ptl.id_rota', 
        { codigo: 'rota.codigo' }, 'rota.cod_inicial', 'rota.cod_final', { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_ptl.id_rota', 'rota.id_rota')
        .innerJoin('ptl', 'rota_ptl.id_ptl', 'ptl.id_ptl')
        .where({ 'ptl.id_ptl': req.params.id_rota_ptl })
        .orderBy('rota.descricao')
        .then(rota_ptl => res.json(rota_ptl))
        .catch(err => res.status(500).send(err))           
    }
   
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('rota_ptl')
            .delete('id_rota_ptl')
            .where({ id_ptl: req.params.id_rota_ptl })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa Rampa X Rota excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}