module.exports = app => {
    
    const salvar = (req, res) => {
        const config = { ...req.body }
        
        if(req.params.id_config) config.id_config = req.params.id_config

        if(config.id_config) {
            app.bd('config')
            .update({ ip_plc: config.ip_plc, porta_plc_log: config.porta_plc_log, porta_plc_vol: config.porta_plc_vol, 
                    porta_plc_sinal: config.porta_plc_sinal, sorter: config.sorter, ptl: config.ptl, 
                    picking: config.picking, coletor: config.coletor,  picking_coletor: config.picking_coletor,
                    modo_debug : config.modo_debug, saida_inicial: config.saida_inicial, saida_final: config.saida_final})
            .where({ id_config: config.id_config })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('config')
            .insert(config)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('config')
        .select('id_config', 'sorter', 'ptl', 'picking', 'coletor', 'picking_coletor', 'ip_plc', 'porta_plc_log', 
            'porta_plc_vol', 'porta_plc_sinal', 'modo_debug', 'saida_inicial', 'saida_final')
        .first()
        .then(config => res.json(config))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('config')
        .select('id_config', 'sorter', 'ptl', 'picking', 'coletor', 'picking_coletor', 'ip_plc', 
            'porta_plc_log', 'porta_plc_vol', 'porta_plc_sinal', 'modo_debug', 'saida_inicial', 'saida_final')
        .where({ id_config: req.params.id_config})
        .first()
        .then(config => res.json(config))
        .catch(err => res.status(500).send(err))
    }

    return { salvar, consultar, consultarId }
}