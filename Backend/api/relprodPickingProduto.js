module.exports = app => {

    const consultarData = async (req, res) => {
        app.bd('pedidos_detalhe as pd')
        .select('pd.onda', 'pd.ordem', 'pd.numero_caixa', 'pd.data_picking', 'pd.sku', 'po.descricao as produto', 'pd.qtde_sku', 'pd.qtde_separada', 'pd.qtde_falta', 'pd.descricao_destino', 'pd.id_posto', 'ps.descricao as descricao_posto')
        .join('produtos as po', 'po.sku', '=', 'pd.sku')
        .leftJoin('postos as ps', 'ps.id_posto', '=', 'pd.id_posto')
        .whereBetween('pd.data_orderstart',[req.params.data_inicial, req.params.data_final])
        .orderBy('pd.data_orderstart')
        .then(prod_posto => res.json(prod_posto))
        .catch(err => res.status(500).send(err))           
    }
    return { consultarData }
 }