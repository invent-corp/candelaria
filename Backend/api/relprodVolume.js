module.exports = app => {
    
    const consultar = async (req, res) => {
        app.bd('caixa')
        .select('caixa.onda', 'caixa.ordem', 'caixa.etiqueta','caixa.estacao_leitura', 'caixa.sku', {rota: 'rota.codigo'},
                'caixa.centro_destino', 'caixa.peso', 'caixa.comprimento', 'caixa.largura', 'caixa.altura',
                'caixa.data_leitura', 'caixa.data_saida', 'caixa.saida_previsto', 'caixa.saida_real',
                'pallet.numero_identificador','pallet.data_finalizacao',
                app.bd.raw(`CASE
                    WHEN caixa.estacao_leitura = 'CONTINGÊNCIA' THEN usuario_pallet.nome
                    ELSE usuario_itens.nome
                END as nome`))
        .leftOuterJoin('rota', 'caixa.id_rota', 'rota.id_rota')
        .leftOuterJoin('pallet','caixa.id_pallet', 'pallet.id_pallet')
        .leftOuterJoin('pallet_itens', function() {
            this.on('pallet.id_pallet', '=', 'pallet_itens.id_pallet')
               .andOn('caixa.etiqueta', '=', 'pallet_itens.etiqueta')
        })
        .leftOuterJoin('usuario as usuario_itens','usuario_itens.id_usuario', 'pallet_itens.id_usuario')
        .leftOuterJoin('usuario as usuario_pallet','usuario_pallet.id_usuario', 'pallet.id_usuario')
        .orderBy('caixa.data_leitura')
        .then(prod_volume => res.json(prod_volume))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        app.bd('caixa')
        .select('caixa.onda', 'caixa.ordem', 'caixa.etiqueta','caixa.estacao_leitura', 'caixa.sku', {rota: 'rota.codigo'},
                'caixa.centro_destino', 'caixa.peso', 'caixa.comprimento', 'caixa.largura', 'caixa.altura',
                'caixa.data_leitura', 'caixa.data_saida', 'caixa.saida_previsto', 'caixa.saida_real',
                'pallet.numero_identificador','pallet.data_finalizacao',
                app.bd.raw(`CASE
                    WHEN caixa.estacao_leitura = 'CONTINGÊNCIA' THEN usuario_pallet.nome
                    ELSE usuario_itens.nome
                END as nome`))
        .leftOuterJoin('rota', 'caixa.id_rota', 'rota.id_rota')
        .leftOuterJoin('pallet','caixa.id_pallet', 'pallet.id_pallet')
        .leftOuterJoin('pallet_itens', function() {
            this.on('pallet.id_pallet', '=', 'pallet_itens.id_pallet')
               .andOn('caixa.etiqueta', '=', 'pallet_itens.etiqueta')
        })
        .leftOuterJoin('usuario as usuario_itens','usuario_itens.id_usuario', 'pallet_itens.id_usuario')
        .leftOuterJoin('usuario as usuario_pallet','usuario_pallet.id_usuario', 'pallet.id_usuario')
        .whereBetween('caixa.data_leitura', [req.params.data_inicial, req.params.data_final])
        .orderBy('caixa.data_leitura')
        .then(prod_volume => res.json(prod_volume))
        .catch(err => res.status(500).send(err))
    }
 
    return { consultar, consultarData }
 }