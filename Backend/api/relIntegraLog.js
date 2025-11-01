module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const consultar = async (req, res) => {
        app.bd('pedidos_log')
        .select('pedidos.codigo','pedidos.onda','pedidos.tipo_acao','pedidos.ordem',
                'pedidos.oblpn','pedidos.numero_tracking','pedidos.enviar_codigo','pedidos.rota', 
                'pedidos.sequencia_ordem','pedidos.sku_primeira_parte','pedidos.qtde_sku','pedidos.qtde_alocada',
                'pedidos.codbarras_localidade','pedidos.localidade_area','pedidos.localidade_zona', 
                'pedidos.data_criacao','pedidos.ordem_status','pedidos.sku_alternativo','pedidos.prioridade_ordem', 
                'pedidos.sku','pedidos.codigo_destino','pedidos.codigo_envio_destino','pedidos.descricao_destino',
                'pedidos.cep_destino','pedidos.id_pedido','pedidos.data_processamento','pedidos.id_pedidos_log',
                'pedidos.tipo_unidade','pedidos.processado')
        .innerJoin('pedidos', 'pedidos.id_pedidos_log', 'pedidos_log.id_pedidos_log')
        .orderBy('pedidos.data_processamento')
        .orderBy('pedidos.onda')
        .orderBy('pedidos.ordem')
        .then(int_caixa => res.json(int_caixa))
   //     .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('pedidos_log')
        .select('pedidos.codigo','pedidos.onda','pedidos.tipo_acao','pedidos.ordem',
                'pedidos.oblpn','pedidos.numero_tracking','pedidos.enviar_codigo','pedidos.rota', 
                'pedidos.sequencia_ordem','pedidos.sku_primeira_parte','pedidos.qtde_sku','pedidos.qtde_alocada',
                'pedidos.codbarras_localidade','pedidos.localidade_area','pedidos.localidade_zona', 
                'pedidos.data_criacao','pedidos.ordem_status','pedidos.sku_alternativo','pedidos.prioridade_ordem', 
                'pedidos.sku','pedidos.codigo_destino','pedidos.codigo_envio_destino','pedidos.descricao_destino',
                'pedidos.cep_destino','pedidos.id_pedido','pedidos.data_processamento','pedidos.id_pedidos_log',
                'pedidos.tipo_unidade','pedidos.processado')
        .innerJoin('pedidos', 'pedidos.id_pedidos_log', 'pedidos_log.id_pedidos_log')
        .whereBetween('pedidos.data_processamento', [req.params.data_inicial, req.params.data_final])
        .orderBy('pedidos.data_processamento')
        .orderBy('pedidos.onda')
        .orderBy('pedidos.ordem')
		.then(integra_log => res.json(integra_log))
	//	.catch(err => res.status(500).send(err))           
	}
 
    return { consultar, consultarData }
 }