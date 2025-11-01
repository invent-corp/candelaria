module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const ptm = { ...req.body }
        
        if (req.params.id_ptm) ptm.id_ptm = req.params.id_ptm

        if (ptm.id_ptm) {
            app.bd('ptm')
            .update({ id_mapa_ptm: ptm.id_mapa_ptm, id_endereco_ptm: ptm.id_endereco_ptm })
            .where({ id_ptm: ptm.id_ptm })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('ptm')
            .insert(ptm)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }    

    const consultar = async (req, res) => {
        app.bd('ptm')
        .select('ptm.id_ptm', 'ptm.id_endereco_ptm', 'ptm.id_mapa_ptm', 
            { mapa_ptm: 'mapa_ptm.nome' }, { mapa_descricao: 'mapa_ptm.descricao' }, { mapa_situacao: 'mapa_ptm.situacao' }, 
            { endereco_ptm: 'endereco_ptm.codigo' }, { endereco_ptm_descricao: 'endereco_ptm.descricao' }, { endereco_ptm_situacao: 'endereco_ptm.situacao' })
        .innerJoin('mapa_ptm', 'ptm.id_mapa_ptm', 'mapa_ptm.id_mapa_ptm')
        .innerJoin('endereco_ptm', 'ptm.id_endereco_ptm', 'endereco_ptm.id_endereco_ptm')
        .orderBy('mapa_ptm.nome', 'asc')
        .then(ptm => res.json(ptm))
        .catch(err => res.status(500).send(err))
    }

    const consultarCbx = async (req, res) => {
        app.bd('mapa_ptm')
        .select('mapa_ptm.nome')
        .innerJoin('ptm', 'mapa_ptm.id_mapa_ptm', 'ptm.id_mapa_ptm')
        .innerJoin('endereco_ptm', 'ptm.id_endereco_ptm', 'endereco_ptm.id_endereco_ptm')
        .groupBy('mapa_ptm.nome')
        .orderBy('mapa_ptm.nome', 'asc')
        .then(ptm => res.json(ptm))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const mapaExiste = await
        app.bd('ptm')
        .select( 'id_ptm' )
        .where({ id_ptm: req.params.id_ptm })

        try {
            existeOuErro(mapaExiste, 'ptm inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('ptm')
        .select('ptm.id_ptm', 'ptm.id_endereco_ptm', 'ptm.id_mapa_ptm', 
            { mapa_ptm: 'mapa_ptm.nome' }, { mapa_descricao: 'mapa_ptm.descricao' }, { mapa_situacao: 'mapa_ptm.situacao' }, 
            { endereco_ptm: 'endereco_ptm.codigo' }, { endereco_ptm_descricao: 'endereco_ptm.descricao' }, { endereco_ptm_situacao: 'endereco_ptm.situacao' })
        .innerJoin('mapa_ptm', 'ptm.id_mapa_ptm', 'mapa_ptm.id_mapa_ptm')
        .innerJoin('endereco_ptm', 'ptm.id_endereco_ptm', 'endereco_ptm.id_endereco_ptm')
        .where({ 'ptm.id_ptm': req.params.id_ptm })
        .first()
        .then(ptm => res.json(ptm))
        .catch(err => res.status(500).send(err))             
    }

    const consultarIdCad = async (req, res) => {
        app.bd('ptm')
        .select('id_ptm', 'id_mapa_ptm', 'id_endereco_ptm')
        .where({ id_mapa_ptm : req.params.id_mapa_ptm })
        .where({ id_endereco_ptm : req.params.id_endereco_ptm })
        .first()
        .then(ptm => res.json(ptm))
        .catch(err => res.status(500).send(err))
    }
    
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('ptm')
            .delete('id_ptm')
            .where({ id_ptm: req.params.id_ptm })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa ptm X Endereco PTM excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarCbx, consultarId, consultarIdCad, excluir }
}