module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rota_ptm = { ...req.body }
        app.bd('rota_ptm')
        .insert(rota_ptm)
        .then(_ => res.status(204).send())
    //    .catch(err => res.status(500).send(err))
    }

    const consultar = async (req, res) => {
        app.bd('rota_ptm')
        .select('rota_ptm.id_rota_ptm', 'rota_ptm.id_ptm', 'rota_ptm.id_rota', 
        { codigo: 'rota.codigo' }, 'rota.cod_inicial', 'rota.cod_final', { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_ptm.id_rota', 'rota.id_rota')
        .innerJoin('ptm', 'rota_ptm.id_ptm', 'ptm.id_ptm')
        .then(rota_ptm => res.json(rota_ptm))
     //   .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ptmExiste = await
        app.bd('rota_ptm')
        .select('rota_ptm.id_ptm')
        .where({ id_ptm: req.params.id_rota_ptm })

        try {
            existeOuErro(ptmExiste, 'Mapa Rampa inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('rota_ptm')
        .select('rota_ptm.id_rota_ptm', 'rota_ptm.id_ptm', 'rota_ptm.id_rota', 
        { codigo: 'rota.codigo' }, 'rota.cod_inicial', 'rota.cod_final', { descricao: 'rota.descricao' }, { situacao: 'rota.situacao' })
        .innerJoin('rota', 'rota_ptm.id_rota', 'rota.id_rota')
        .innerJoin('ptm', 'rota_ptm.id_ptm', 'ptm.id_ptm')
        .where({ 'ptm.id_ptm': req.params.id_rota_ptm })
        .orderBy('rota.descricao')
        .then(rota_ptm => res.json(rota_ptm))
  //      .catch(err => res.status(500).send(err))           
    }
   
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('rota_ptm')
            .delete('id_rota_ptm')
            .where({ id_ptm: req.params.id_rota_ptm })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa PTM X Rota excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}