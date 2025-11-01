module.exports = app => {

    const postgres = require('pg')
    const config = require('../knexfile.js')

    var pg = new postgres.Pool(config.connection)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        var numero_caixa = req.params.numero_caixa
        var id_pedido_volume = req.params.id_pedido_volume
  
        pg.connect()
        .then(client => {
            // Stored procedure
            return client.query(`SELECT * from public."SP_ORDERSTART"('${id_pedido_volume}','${numero_caixa}')`)
            .then(result => { 
                client.release()
                res.json(result.rows[0])      
            })
            .catch(err => res.status(500).send(err))
        })

     }

     const processarpedidos = (req, res) => {
        pg.connect()
        .then(client => {
            // Stored procedure
            return client.query(`SELECT public."sp_gerar_pedidos_detalhe_vol"()`)
            .then(result => { 
                client.release()
                res.status(200).send({ mensagem: "Pedidos processados com sucesso!" });      
            })
            .catch(err => {
                client.release()
                console.error(err)
                res.status(500).send({ mensagem: "Ocorreu um erro ao executar o processamento de pedidos!"})
            })
        })
    }

/*    const consultar = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Sim' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }
*/
 /*   const contar = async (req, res) => {
        app.bd('mapa_sorter')
        .count({qtde: 'id_mapa_sorter'})
        .first()
        .where({ operacao: 'Sim' })
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }
*/
 /*   const consultarAtivo = async (req, res) => {
        app.bd('mapa_sorter')
        .select('id_mapa_sorter', 'nome', 'descricao', 'situacao', 'operacao')
        .where({ operacao: 'Não' })
        .orderBy('nome')
        .then(mapa => res.json(mapa))
        .catch(err => res.status(500).send(err))
    }
*/
    const consultarPedidosDisponiveis = async (req, res) => {
        app.bd('pedidos_volumes')
        .select('id_pedido_volume', 'ordem','volume','total_volume','descricao_destino' )
        .innerJoin('pedidos_log', 'pedidos_log.onda', 'pedidos_volumes.onda')
        .where({ id_orderstart: req.params.id_orderstart})
        .where('pedidos_log.operacao', '=', 'Sim')
        .whereNull('pedidos_volumes.data_orderstart')
        .orderBy('pedidos_volumes.data_criacao')
        .orderBy('pedidos_volumes.ordem')
        .orderBy('pedidos_volumes.volume')
        .then(orderStart => res.json(orderStart))
        .catch(err => res.status(500).send(err))
    }

  /*  const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('mapa_sorter')
            .update({ operacao: "Não" })
            .where({ id_mapa_sorter: req.params.id_mapa_sorter })
            existeOuErro(linhaDesativada, 'Mapa Sorter inexistente!')
            res.status(200).send('Mapa Sorter desativado com Sucesso!')
        }

        catch(msg) {
            res.status(400).send(msg)
        } 
    }
*/
    return { consultarPedidosDisponiveis, salvar, processarpedidos }
}