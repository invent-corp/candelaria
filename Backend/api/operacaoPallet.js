module.exports = app => {

    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const pallet = { ...req.body }

        if (req.params.id_pallet) pallet.id_pallet = req.params.id_pallet

        try {
            existeOuErro(pallet.id_pallet, 'Pallet não informado!')
        }
        catch (msg) {
            return res.status(400).send(msg)
        }

        if (pallet.id_pallet) {
            app.bd('pallet')
                .update({ data_finalizacao: null })
                .where({ id_pallet: pallet.id_pallet })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const consultarCbx = async (req, res) => {
        var data = new Date()
        data.setDate(data.getDate() - 7)
        data.setHours(data.getHours() - 3)
        var jsonData = data.toJSON()

        app.bd('pedidos_log')
            .select('onda', 'id_pedidos_log')
            .where('data_inicio', '>=', jsonData)
            .orderBy('data_inicio')
            .then(onda => res.json(onda))
            .catch(err => res.status(500).send(err))
    }

    const consultarOnda = async (req, res) => {
        app.bd('pallet')
            .select('pallet.id_pallet', 'onda', 'numero_identificador', 'data_criacao', 'data_finalizacao', 'qtde_volumes', 'rota.codigo')
            .innerJoin('pallet_rota', 'pallet_rota.id_pallet', 'pallet.id_pallet')
            .innerJoin('rota', 'rota.id_rota', 'pallet_rota.id_rota')
            .whereBetween('data_criacao', [req.params.data_inicial, req.params.data_final])
            //        .where({ 'onda': req.params.onda })
            .orderBy('data_criacao')
            .then(onda => res.json(onda))
            .catch(err => res.status(500).send(err))
    }

    const consultarItens = async (req, res) => {

        const itensExiste = await
            app.bd('pallet_itens')
                .select('id_pallet')
                .where({ id_pallet: req.params.id_pallet })

        try {
            existeOuErro(itensExiste, 'Itens inexistentes!')
        }
        catch (msg) {
            res.status(400).send(msg)
        }

        app.bd('pallet_itens', 'pallet')
            .select('pallet_itens.id_pallet_itens', 'pallet.numero_identificador', 'pallet_itens.etiqueta', 'pallet_itens.sku', 'pallet_itens.data_leitura')
            .innerJoin('pallet', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .where({ 'pallet_itens.id_pallet': req.params.id_pallet })
            .orderBy('pallet_itens.data_leitura')
            .then(itens => res.json(itens))
            .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            // 1. Busca o item para obter o id_pallet associado
            const item = await app.bd('pallet_itens')
                .where({ id_pallet_itens: req.params.id_pallet_itens })
                .first()

            existeOuErro(item, 'Item inexistente!');

            // 2. Busca o pallet para verificar seu status
            const pallet = await app.bd('pallet')
                .where({ id_pallet: item.id_pallet })
                .first()

            // 3. Valida se o pallet está finalizado (data_finalizacao não é nula)
            if (pallet.data_finalizacao) {
                return res.status(400).send('Não é possível excluir item de um pallet finalizado.');
            }

            // 4. Se a validação passar, exclui o item
            await app.bd('pallet_itens')
                .where({ id_pallet_itens: req.params.id_pallet_itens })
                .del() // O método correto para exclusão no Knex é .del() ou .delete()

            res.status(200).send('Item excluído com Sucesso!')
        }
        catch (msg) {
            // Se o erro for uma string (como o da validação), envia como 400
            // Caso contrário, pode ser um erro de banco (500)
            if (typeof msg === 'string') {
                return res.status(400).send(msg)
            }
            res.status(500).send(msg)
        }
    }

    /*  const excluir = async (req, res) => {
          try {
              const linhaExcluida = await app.bd('pallet_itens')
              .delete('id_pallet_itens')
              .where({ id_pallet_itens: req.params.id_pallet_itens })
              existeOuErro(linhaExcluida, 'Item inexistente!')
              res.status(200).send('Item excluído com Sucesso!')
          }
          catch(msg) {
              res.status(400).send(msg)
          } 
      }*/

    return { salvar, consultarCbx, consultarOnda, consultarItens, excluir }
}