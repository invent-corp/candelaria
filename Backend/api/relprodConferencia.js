module.exports = app => {

    const consultar = async (req, res) => {
        app.bd('pedidos_conferencia')
        .select('pedidos_conferencia.numero_caixa','pedidos_detalhe.ordem','pedidos_conferencia.onda',
        'pedidos_conferencia.sku','pedidos_conferencia.qtde_sku','pedidos_conferencia.qtde_separada',
        'pedidos_conferencia.qtde_falta','pedidos_conferencia.qtde_lida','pedidos_conferencia.data_conferencia',
        'pedidos_conferencia.concluido','pedidos_conferencia.tipo_conferencia','usuario.nome')
        .innerJoin('pedidos_detalhe', 'pedidos_detalhe.id_pedido_detalhe', 'pedidos_conferencia.id_pedido_detalhe')
        .leftJoin('usuario', 'usuario.id_usuario', 'pedidos_conferencia.id_usuario_conferencia')
        .orderBy('pedidos_conferencia.numero_caixa')
        .then(prod_conferencia => res.json(prod_conferencia))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('pedidos_conferencia')
        .select('pedidos_conferencia.numero_caixa','pedidos_detalhe.ordem','pedidos_conferencia.onda',
        'pedidos_conferencia.sku','pedidos_conferencia.qtde_sku','pedidos_conferencia.qtde_separada',
        'pedidos_conferencia.qtde_falta','pedidos_conferencia.qtde_lida','pedidos_conferencia.data_conferencia',
        'pedidos_conferencia.concluido','pedidos_conferencia.tipo_conferencia','usuario.nome')
        .innerJoin('pedidos_detalhe', 'pedidos_detalhe.id_pedido_detalhe', 'pedidos_conferencia.id_pedido_detalhe')
        .leftJoin('usuario', 'usuario.id_usuario', 'pedidos_conferencia.id_usuario_conferencia')
        .where({'pedidos_conferencia.onda': req.params.onda })
        .orderBy('pedidos_conferencia.numero_caixa')
        .then(prod_conferencia => res.json(prod_conferencia))
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