module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const consultar = async (req, res) => {
        app.bd('retorno_integracao_log')
        .select('pedidos_volumes.numero_caixa','pedidos_volumes.ordem',
        'pedidos_volumes.data_integracao_picking','pedidos_volumes.data_integracao_close_lpn',
        'retorno_integracao_log.tipo_integracao','retorno_integracao_log.status_retorno',
        'retorno_integracao_log.mensagem_retorno')
        .innerJoin('pedidos_volumes', 'pedidos_volumes.id_pedido_volume', 'retorno_integracao_log.chave')
        .orderBy('pedidos_volumes.numero_caixa')
        .orderBy('retorno_integracao_log.data_criacao')
        .then(retorno_log => res.json(retorno_log))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('retorno_integracao_log')
        .select('pedidos_volumes.numero_caixa','pedidos_volumes.ordem',
        'pedidos_volumes.data_integracao_picking','pedidos_volumes.data_integracao_close_lpn',
        'retorno_integracao_log.tipo_integracao','retorno_integracao_log.status_retorno',
        'retorno_integracao_log.mensagem_retorno')
        .innerJoin('pedidos_volumes', 'pedidos_volumes.id_pedido_volume', 'retorno_integracao_log.chave')
        .whereBetween('retorno_integracao_log.data_criacao', [req.params.data_inicial, req.params.data_final])
        .whereIn('retorno_integracao_log.tipo_integracao', ['Confirmação Picking', 'Close LPN'])
        .orderBy('pedidos_volumes.numero_caixa')
        .orderBy('retorno_integracao_log.data_criacao')
		.then(retorno_log => res.json(retorno_log))
		.catch(err => res.status(500).send(err))           
	}
 
    return { consultar, consultarData }
 }