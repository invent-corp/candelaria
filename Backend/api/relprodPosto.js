module.exports = app => {

    const consultarData = async (req, res) => {
        app.bd('pedidos_detalhe')
        .select('pedidos_detalhe.id_posto', 'postos.descricao', app.bd.raw('sum(pedidos_detalhe.qtde_sku) as qtde_produto'))
        .join('postos', 'postos.id_posto', '=', 'pedidos_detalhe.id_posto')
        .whereBetween('pedidos_detalhe.data_picking', [req.params.data_inicial, req.params.data_final])
        .groupBy('pedidos_detalhe.id_posto', 'postos.descricao')
        .then(prod_posto => res.json(prod_posto))
        .catch(err => res.status(500).send(err))           
    }
 
    return { consultarData }
 }