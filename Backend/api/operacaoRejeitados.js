module.exports = app => {
    
    const consultarId = async (req, res) => {

        app.bd('caixa')
        .select('caixa.saida_previsto', 'rota.codigo as descricao', 'caixa.data_leitura','caixa.estacao_leitura')
        .leftJoin('rota', 'caixa.id_rota', 'rota.id_rota')
        .where({ etiqueta: req.params.etiqueta})
   //     .whereNull('caixa.id_pallet')
        .whereNot('caixa.saida_previsto', 1)
        .orderBy('caixa.data_leitura', 'desc')
        .then(rejeitados => res.json(rejeitados))
        .catch(err => res.status(500).send(err))
    }

    const consultarFaltaConferencia = async (req, res) => {

        app.bd('pedidos_volumes')
        .select('pedidos_volumes.id_pedido_volume')
        .where({ numero_caixa: req.params.etiqueta})
        .whereNull('data_finalizacao_conferencia')
        .whereIn('onda', [
            app.bd('pedidos_log')
            .select('onda')
            .where({ operacao: 'Sim' })
        ])
        .then(faltaconferencia => res.json(faltaconferencia))
        .catch(err => res.status(500).send(err))
    }


    return { consultarId, consultarFaltaConferencia }
}