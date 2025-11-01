module.exports = app => {

    const consultarData = async (req, res) => {
        app.bd('pedidos_detalhe')
        .select('tipo_produto.descricao', app.bd.raw('sum(pedidos_detalhe.qtde_sku) as qtde_produto'))
        .join('produtos', 'produtos.sku', '=', 'pedidos_detalhe.sku')
        .join('tipo_produto', 'produtos.id_tipo_produto', '=', 'tipo_produto.id_tipo_produto')
        .whereBetween('pedidos_detalhe.data_picking', [req.params.data_inicial, req.params.data_final])
        .groupBy('tipo_produto.descricao')
        .then(prod_tipoproduto => res.json(prod_tipoproduto))
        .catch(err => res.status(500).send(err))           
    }
 
    return { consultarData }
 }