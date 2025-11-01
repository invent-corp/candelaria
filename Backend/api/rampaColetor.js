module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rampa_coletor = { ...req.body }
        app.bd('rampa_coletor')
        .insert(rampa_coletor)
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }    

    // const consultar = async (req, res) => {
    //     app.bd({ r: 'rampa', rc: 'rampa_coletor', c: 'coletor' })
    //     .select('rc.id_rampa_coletor', 'rc.id_rampa', 'rc.id_coletor', { rampa: 'r.nome' }, { nome: 'c.nome' }, { descricao: 'c.descricao' }, { situacao: 'c.situacao' }, { ip: 'c.ip' }, { porta: 'c.porta' })
    //     .whereRaw('?? = ??', ['r.id_rampa', 'rc.id_rampa'])
    //     .whereRaw('?? = ??', ['rc.id_coletor', 'c.id_coletor'])
    //     .then(rampa_coletor => res.json(rampa_coletor))
    //     .catch(err => res.status(500).send(err))
    // }

    const consultar = async (req, res) => {
        app.bd('rampa_coletor', 'rampa', 'coletor')
        .select('rampa_coletor.id_rampa_coletor', 'rampa_coletor.id_rampa', 'rampa_coletor.id_coletor', 
            { rampa: 'rampa.nome' }, 
            { nome: 'coletor.nome' }, { descricao: 'coletor.descricao' }, { situacao: 'coletor.situacao' }, { ip: 'coletor.ip' }, { porta: 'coletor.porta' })
        .innerJoin('rampa', 'rampa_coletor.id_rampa', 'rampa.id_rampa')
        .innerJoin('coletor', 'rampa_coletor.id_coletor', 'coletor.id_coletor')
        .then(rampa_coletor => res.json(rampa_coletor))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const rampaExiste = await
        app.bd('rampa_coletor')
        .select('id_rampa')
        .where({ id_rampa: req.params.id_rampa_coletor })

        try {
            existeOuErro(rampaExiste, 'Rampa inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('rampa_coletor', 'rampa', 'coletor')
        .select('rampa_coletor.id_rampa_coletor', 'rampa_coletor.id_rampa', 'rampa_coletor.id_coletor', 
            { rampa: 'rampa.nome' }, 
            { nome: 'coletor.nome' }, { descricao: 'coletor.descricao' }, { situacao: 'coletor.situacao' }, { ip: 'coletor.ip' }, { porta: 'coletor.porta' })
        .innerJoin('rampa', 'rampa_coletor.id_rampa', 'rampa.id_rampa')
        .innerJoin('coletor', 'rampa_coletor.id_coletor', 'coletor.id_coletor')
        .where({ 'rampa.id_rampa': req.params.id_rampa_coletor })
        .then(rampa_coletor => res.json(rampa_coletor))
        .catch(err => res.status(500).send(err))           
    }
    
    const excluir = async (req, res) => {
        try {
            const linhaExcluida = await app.bd('rampa_coletor')
            .delete('id_rampa_coletor')
            .where({ id_rampa: req.params.id_rampa_coletor })
            existeOuErro(linhaExcluida, 'Relação inexistente!')
            res.status(200).send('Relação Rampa X Coletor excluída com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, excluir }
}