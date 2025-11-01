module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const pedidos_log = { ...req.body }
        
        if(req.params.id_pedidos_log) pedidos_log.id_pedidos_log = req.params.id_pedidos_log

        try {
            existeOuErro(pedidos_log.id_pedidos_log, 'Onda não informada!')
        }
        catch(msg) {
            return res.status(400).send(msg)
        }

        if(pedidos_log.id_pedidos_log) {
            var data = new Date()
            data.setDate(data.getDate())
            console.log(data)
            console.log(pedidos_log.id_pedidos_log)
            
            app.bd('pedidos_log')
            .update({ operacao: 'Sim', data_inicio: data, id_usuario : req.params.id_usuario})
            .where({ id_pedidos_log: pedidos_log.id_pedidos_log })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('pedidos_log')
        .select('id_pedidos_log', 'onda', 'operacao')
        .where({ operacao: 'Sim'})
        .orderBy('onda')
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }

    const contar = async (req, res) => {
        app.bd('pedidos_log')
        .count({qtde: 'id_pedidos_log'})
        .first()
        .where({ operacao: 'Sim' })
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('pedidos_log')
        .select('id_pedidos_log', 'onda', 'operacao')
        .where({ operacao: 'Não'})
        .orderBy('onda')
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = async (req, res) => {

        const ondaExiste = await
        app.bd('pedidos_log')
        .select( 'id_pedidos_log' )
        .where({ id_pedidos_log: req.params.id_pedidos_log })

        try {
            existeOuErro(ondaExiste, 'Onda inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('pedidos_log')
        .select('id_pedidos_log', 'onda', 'operacao')
        .where({ id_pedidos_log: req.params.id_pedidos_log })
        .first()
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('pedidos_log')
            .update({ operacao: "Não", id_usuario_desativou: req.params.id_usuario })
            .where({ id_pedidos_log: req.params.id_pedidos_log })
            existeOuErro(linhaDesativada, 'Onda inexistente!')
            res.status(200).send('Onda desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, contar, consultarAtivo, consultarId, excluir }
}