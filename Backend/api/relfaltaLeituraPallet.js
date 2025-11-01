module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)    

    const consultar = async (req, res) => {
        knex.raw("select etiqueta,centro_destino, saida_previsto, qtde_total,qtde_pallet,\
                  (qtde_total-qtde_pallet) as qtde_sem_pallet from (select rel.etiqueta, rel.centro_destino,\
                  rel.saida_previsto, rel.qtde_total, (select count(ca.id_caixa)\
                  from caixa ca where ca.onda = 0 and ca.etiqueta = rel.etiqueta and \
                  ca.centro_destino = rel.centro_destino and ca.saida_previsto = rel.saida_previsto\
                  and not ca.id_pallet is null) as qtde_pallet from (select c.etiqueta,c.centro_destino,\
                  c.saida_previsto, count(c.id_caixa) as qtde_total from caixa c\
                  where c.onda = 0 and not c.centro_destino is null group by c.etiqueta,c.centro_destino,c.saida_previsto) as rel) as relatorio\
                  order by qtde_pallet,etiqueta,centro_destino desc")
        .then(falta_leitura => res.json(falta_leitura))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        knex.raw("select etiqueta,centro_destino, saida_previsto, qtde_total,qtde_pallet,\
                  (qtde_total-qtde_pallet) as qtde_sem_pallet from (select rel.etiqueta, rel.centro_destino,\
                  rel.saida_previsto, rel.qtde_total, (select count(ca.id_caixa)\
                  from caixa ca where ca.onda = "+req.params.onda+" and ca.etiqueta = rel.etiqueta and \
                  ca.centro_destino = rel.centro_destino and ca.saida_previsto = rel.saida_previsto\
                  and not ca.id_pallet is null) as qtde_pallet from (select c.etiqueta,c.centro_destino,\
                  c.saida_previsto, count(c.id_caixa) as qtde_total from caixa c\
                  where c.onda = "+req.params.onda+" and not c.centro_destino is null group by c.etiqueta,c.centro_destino,c.saida_previsto) as rel) as relatorio\
                  order by qtde_pallet,etiqueta,centro_destino desc")
        
        .then(falta_leitura => res.json(falta_leitura))
        .catch(err => res.status(500).send(err))           

//        app.bd('caixa')
//        .count({qtde:'caixa.id_caixa'})
//        .select({rampa:'caixa.saida_real'}, {etiqueta: 'caixa.etiqueta'}, {centro_destino: 'caixa.centro_destino'})
//        .whereNotNull('caixa.data_saida')
//        .whereNotNull('caixa.saida_real')
//        .whereNull('caixa.id_pallet')
//        .where({ 'onda': req.params.onda })
//        .groupBy('caixa.etiqueta','caixa.centro_destino','caixa.saida_real')
//        .orderBy('caixa.etiqueta','caixa.centro_destino')
//        .then(falta_leitura => res.json(falta_leitura))
//        .catch(err => res.status(500).send(err))           
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
 
    return { consultar, consultarData , consultarCbx}
 }