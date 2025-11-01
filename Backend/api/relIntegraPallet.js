module.exports = app => {

    const consultar = async (req, res) => {
        app.bd('retorno_integracao_log')
        .select('pallet.data_finalizacao','pallet.numero_identificador','pallet_itens.etiqueta',
        'pallet_itens.data_integracao','retorno_integracao_log.tipo_integracao',
        'retorno_integracao_log.status_retorno','retorno_integracao_log.mensagem_retorno')
        .innerJoin('pallet', 'pallet.id_pallet', 'pallet_itens.id_pallet')
        .innerJoin('pallet_itens', 'retorno_integracao_log.chave', 'pallet_itens.id_pallet_itens')
        .then(pallet => res.json(pallet))
    //    .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('retorno_integracao_log')
        .select('pallet.data_finalizacao','pallet.numero_identificador','pallet_itens.etiqueta',
        'pallet_itens.data_integracao','retorno_integracao_log.tipo_integracao',
        'retorno_integracao_log.status_retorno','retorno_integracao_log.mensagem_retorno')
        .innerJoin('pallet', 'pallet.id_pallet', 'retorno_integracao_log.chave')
        .innerJoin('pallet_itens', 'pallet.id_pallet', 'pallet_itens.id_pallet')
        .whereBetween('retorno_integracao_log.data_criacao', [req.params.data_inicial, req.params.data_final])
        .where({'retorno_integracao_log.tipo_integracao': 'Confirmação Pallet'})
        .orderBy('pallet.numero_identificador')
        .orderBy('retorno_integracao_log.data_criacao')
        .then(pallet => res.json(pallet))
     //   .catch(err => res.status(500).send(err))
    }
 
    return { consultar, consultarData }
 }