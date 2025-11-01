module.exports = app => {
    
    const { existeOuErro } = app.api.validacao

    const limparTodosPostos = (req, res) => {
        app.bd('postos_status')
        .update({ status: 'LIVRE', numero_caixa: null })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))

        app.bd('postos_fila')
        .del()
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }

    const limparPosto = (req, res) => {
        app.bd('postos_status')
        .update({ status: 'LIVRE', numero_caixa: null })
        .where({ id_posto : req.params.id_posto})
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))

        app.bd('postos_fila')
        .del()
        .where({ id_posto : req.params.id_posto})
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err));
    }

    const consultarPostos = async (req, res) => {
        app.bd('postos_status')
        .select('postos.id_posto','postos.descricao', 'postos_status.status', 'postos_status.numero_caixa')
        .innerJoin('postos', 'postos.id_posto', 'postos_status.id_posto')
        .orderBy('postos.descricao')
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).send(erro));
    }

    const consultarItensPostos = async (req, res) => {

        const itensExiste = await
        app.bd('postos_fila')
        .select( 'id_posto' )
        .where({ id_posto: req.params.id_posto })

        try {
            existeOuErro(itensExiste, 'Itens inexistentes!')
        }
        catch(msg) {
            res.status(200).send(msg)
        }
        
        app.bd('postos_fila')
        .select('postos_fila.numero_caixa','postos.descricao')
        .innerJoin('postos', 'postos.id_posto', 'postos_fila.id_posto')
        .where({ 'postos_fila.id_posto': req.params.id_posto})
        .orderBy('postos_fila.id_posto_fila')
        .then(itens => res.json(itens))
   //     .catch(err => res.status(500).send(err))
    }


    return { limparTodosPostos, consultarPostos, consultarItensPostos, limparPosto }
}