module.exports = app => {

    const postgres = require('pg')
    const config = require('../knexfile.js')

    var pg = new postgres.Pool(config.connection)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        var num_caixa = req.params.numero_caixa
        var produto = req.params.sku
        var id_usuario = req.params.id_usuario
        
           app.bd('pedidos_conferencia')
           .select('pedidos_conferencia.id_pedido_conferencia','pedidos_conferencia.sku','pedidos_conferencia.qtde_lida','pedidos_conferencia.qtde_separada','pedidos_conferencia.qtde_sku')
           .join('produtos', 'pedidos_conferencia.sku', '=', 'produtos.sku')
           .join('pedidos_log', 'pedidos_conferencia.onda', '=', 'pedidos_log.onda')
           .where('pedidos_log.operacao', '=', 'Sim')
           .where({ numero_caixa: num_caixa })
           .where('produtos.codigo_produto','=', produto)
      //     .where('qtde_lida', '<', app.bd.raw('qtde_sku'))
           .first()
           .then(conferencia => {
            if (!conferencia) {
                // O objeto conferencia é nulo ou undefined
                res.json({ message: 'Registro não encontrado' });
                return;
            }  
            if (conferencia.id_pedido_conferencia > 0) {
              if (parseInt(conferencia.qtde_lida) < parseInt(conferencia.qtde_sku)) {
                  app.bd('pedidos_conferencia')
                  .update({data_conferencia: app.bd.raw('now()'), tipo_conferencia : 'MANUAL'})
                  .where({ id_pedido_conferencia: conferencia.id_pedido_conferencia })
                  .where('qtde_lida', '<', conferencia.qtde_sku)
                  .increment('qtde_lida', 1)
                  .then(() => {
                    qtde_lida_atual = parseInt(conferencia.qtde_lida) + 1

                    app.bd('pedidos_conferencia_log')
                    .insert({
                      id_pedido_conferencia: conferencia.id_pedido_conferencia,
                      sku: conferencia.sku,
                      qtde: 1,
                      data_conferencia: app.bd.raw('now()'),
                      id_usuario_conferencia: id_usuario
                    })
                    .then(() => {
                    })
                    .catch((err) => {
                      console.log('Erro ao inserir registro: ', err);
                    });


                    if (qtde_lida_atual == parseInt(conferencia.qtde_separada)) {
                      // Atualiza o campo concluido
                      app.bd('pedidos_conferencia')
                      .update({ id_usuario_conferencia: id_usuario, concluido: 'S' , data_conferencia: app.bd.raw('now()')})
                      .where({ id_pedido_conferencia: conferencia.id_pedido_conferencia })
                      .then(() => {
                          res.json({ message: 'Conferência produto concluída' })
                        })
                        .catch(err => {
                          res.status(500).send(err)
                        })
                    } else {
                      res.json({ message: 'Volume lido com sucesso' })
                    }                 
                  })
                 .catch(err => {
                   res.status(500).send(err)
                  })
              } 
              else {
                res.json({ message: 'Qtde não pode ser maior que a Qtde Total' });
                return;
              }
            } else {
              res.json({ message: 'Registro não encontrado' })
            }
          })
          .catch(err => {
            res.status(500).send(err)
          })           
     }

     const reiniciar = (req, res) => {
      var num_caixa = req.params.numero_caixa
      
        app.bd('pedidos_conferencia')
        .update({id_usuario_conferencia: null,
                data_conferencia: null,
                concluido: 'N',
                qtde_lida: 0 })
        .where({ 
              numero_caixa: num_caixa,
              onda: app.bd.raw(`(
                    SELECT onda FROM pedidos_log WHERE operacao = 'Sim' LIMIT 1)`)
              }).then(() => {
            res.json({ message: 'Conferência reiniciada com sucesso!' })
        })
     //   .catch(err => {
     //       res.status(500).send(err)
    //    })
     }


     const finalizar = (req, res) => {
      var numero_caixa = req.params.numero_caixa
      var id_usuario = req.params.id_usuario

      pg.connect()
      .then(client => {
          // Stored procedure
          return client.query(`SELECT * from public."SP_FINALIZACONFERENCIA"('${id_usuario}','${numero_caixa}')`)
          .then(result => { 
              client.release()
              res.json(result.rows[0])      
          })
          .catch(err => res.status(500).send(err))
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
    const consultarPedidosConferencia = async (req, res) => {
        app.bd('pedidos_conferencia')
        .select('pedidos_conferencia.id_pedido_conferencia','produtos.codigo_produto as sku', 'pedidos_conferencia.qtde_sku',
                'pedidos_conferencia.qtde_falta','pedidos_conferencia.qtde_separada','pedidos_conferencia.qtde_lida',
                'pedidos_conferencia.data_conferencia','pedidos_conferencia.concluido','pedidos_conferencia.descricao_sku',
                'pedidos_conferencia.tipo_conferencia','pedidos_volumes.data_finalizacao_conferencia')
        .join('produtos', 'pedidos_conferencia.sku', '=', 'produtos.sku')
        .join('pedidos_log', 'pedidos_conferencia.onda', '=', 'pedidos_log.onda')
        .leftJoin('pedidos_volumes', function() {
          this.on('pedidos_conferencia.onda', '=', 'pedidos_volumes.onda')
              .andOn('pedidos_conferencia.numero_caixa', '=', 'pedidos_volumes.numero_caixa');
        })
        .where('pedidos_log.operacao', '=', 'Sim')
        .where('pedidos_conferencia.numero_caixa', '=', req.params.numero_caixa)
    //    .orderBy('concluido')
        .orderByRaw('pedidos_conferencia.data_conferencia IS NULL, pedidos_conferencia.data_conferencia DESC')
        .then(conferencia => res.json(conferencia))
    //    .catch(err => res.status(500).send(err))
    }

    const pedidoconferidoqtde = async (req, res) => {
          app.bd('pedidos_conferencia')
          .count('id_pedido_conferencia as qtde')
          .join('pedidos_log', 'pedidos_conferencia.onda', '=', 'pedidos_log.onda')
          .where('pedidos_log.operacao', '=', 'Sim')
          .where('pedidos_conferencia.numero_caixa', '=', req.params.numero_caixa)
          .where('concluido', '=', 'S')
          .then(conferencia => res.json(conferencia))
          //    .catch(err => res.status(500).send(err))
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
    return { consultarPedidosConferencia, salvar, finalizar, reiniciar, pedidoconferidoqtde }
}