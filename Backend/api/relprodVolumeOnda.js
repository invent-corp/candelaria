module.exports = app => {

    const consultar = async (req, res) => {
        app.bd('pedidos_volumes')
        .select('ordem','descricao_destino','volume','total_volume','numero_caixa','data_orderstart',
        'data_finalizacao_picking','data_finalizacao_conferencia','onda')
        .orderBy('ordem')
        .orderBy('volume')
        .then(prod_volumeonda => res.json(prod_volumeonda))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('pedidos_volumes')
        .select('ordem','descricao_destino','volume','total_volume','numero_caixa','data_orderstart',
        'data_finalizacao_picking','data_finalizacao_conferencia','onda')
        .where({'onda': req.params.onda })
        .orderBy('ordem')
        .orderBy('volume')
        .then(prod_volumeonda => res.json(prod_volumeonda))
        .catch(err => res.status(500).send(err))           
    }

    const consultarCbx = async (req, res) => {
        var data = new Date()
        data.setDate(data.getDate() - 7)
        data.setHours(data.getHours() - 3)
        var jsonData = data.toJSON()

        app.bd('pedidos_log')
        .select('onda', 'id_pedidos_log')
        .where( 'data_inicio', '>=', jsonData )
        .orderBy('data_inicio')
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    } 
 
    return { consultar, consultarData, consultarCbx }
 }