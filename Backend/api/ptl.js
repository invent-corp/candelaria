module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const ptl = { ...req.body }
        
        if (req.params.id_ptl) ptl.id_ptl = req.params.id_ptl

        if (ptl.id_ptl) {
            app.bd('ptl')
            .update({ id_mapa_ptl: ptl.id_mapa_ptl, id_picking: ptl.id_picking })
            .where({ id_ptl: ptl.id_ptl })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('ptl')
            .insert(ptl)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }    

    const consultar = async (req, res) => {
        app.bd('ptl', 'mapa_ptl', 'picking')
        .select('ptl.id_ptl', 'ptl.id_picking', 'ptl.id_mapa_ptl', 
            { mapa_ptl: 'mapa_ptl.nome' }, { mapa_descricao: 'mapa_ptl.descricao' }, { mapa_situacao: 'mapa_ptl.situacao' }, 
            { picking: 'picking.codigo' }, { picking_descricao: 'picking.descricao' }, { picking_situacao: 'picking.situacao' })
        .innerJoin('mapa_ptl', 'ptl.id_mapa_ptl', 'mapa_ptl.id_mapa_ptl')
        .innerJoin('picking', 'ptl.id_picking', 'picking.id_picking')
        .orderBy('mapa_ptl.nome', 'asc')
        .then(ptl => res.json(ptl))
        .catch(err => res.status(500).send(err))
    }

    const consultarCbx = async (req, res) => {
        app.bd('mapa_ptl')
        .select('mapa_ptl.nome')
        .innerJoin('ptl', 'mapa_ptl.id_mapa_ptl', 'ptl.id_mapa_ptl')
        .innerJoin('picking', 'ptl.id_picking', 'picking.id_picking')
        .groupBy('mapa_ptl.nome')
        .orderBy('mapa_ptl.nome', 'asc')
        .then(ptl => res.json(ptl))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {
        const mapaExiste = await
        app.bd('ptl')
        .select( 'id_ptl' )
        .where({ id_ptl: req.params.id_ptl })

        try {
            existeOuErro(mapaExiste, 'PTL inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('ptl', 'mapa_ptl', 'picking')
        .select('ptl.id_ptl', 'ptl.id_picking', 'ptl.id_mapa_ptl', 
            { mapa_ptl: 'mapa_ptl.nome' }, { mapa_descricao: 'mapa_ptl.descricao' }, { mapa_situacao: 'mapa_ptl.situacao' }, 
            { picking: 'picking.codigo' }, { picking_descricao: 'picking.descricao' }, { picking_situacao: 'picking.situacao' })
        .innerJoin('mapa_ptl', 'ptl.id_mapa_ptl', 'mapa_ptl.id_mapa_ptl')
        .innerJoin('picking', 'ptl.id_picking', 'picking.id_picking')
        .where({ 'ptl.id_ptl': req.params.id_ptl })
        .first()
        .then(ptl => res.json(ptl))
        .catch(err => res.status(500).send(err))             
    }

    const consultarIdCad = async (req, res) => {
        app.bd('ptl')
        .select('id_ptl', 'id_mapa_ptl', 'id_picking')
        .where({ id_mapa_ptl : req.params.id_mapa_ptl })
        .where({ id_picking : req.params.id_picking })
        .first()
        .then(ptl => res.json(ptl))
        .catch(err => res.status(500).send(err))
    }
    
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('ptl')
            .delete('id_ptl')
            .where({ id_ptl: req.params.id_ptl })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Mapa PTL X Picking excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarCbx, consultarId, consultarIdCad, excluir }
}