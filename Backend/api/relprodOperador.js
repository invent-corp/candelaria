module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultar = async (req, res) => {
        // Query para SORTER (id_usuario em pallet_itens, endereco_ptm vazio)
        const querySorter = app.bd('pallet_itens')
            .select('usuario.login', 'usuario.nome')
            .select(knex.raw("'SORTER' as tipo"))
            .count({qtde:'pallet_itens.id_pallet_itens'})
            .innerJoin('usuario', 'pallet_itens.id_usuario', 'usuario.id_usuario')
            .innerJoin('pallet', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .whereRaw('(pallet.endereco_ptm IS NULL OR pallet.endereco_ptm = ?)', [''])
            .groupBy('usuario.login', 'usuario.nome')

        // Query para CONTINGÊNCIA (id_usuario em pallet, conta pallet_itens, endereco_ptm preenchido)
        const queryContingencia = app.bd('pallet_itens')
            .select('usuario.login', 'usuario.nome')
            .select(knex.raw("'CONTINGÊNCIA' as tipo"))
            .count({qtde:'pallet_itens.id_pallet_itens'})
            .innerJoin('pallet', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .innerJoin('usuario', 'pallet.id_usuario', 'usuario.id_usuario')
            .whereNotNull('pallet.endereco_ptm')
            .where('pallet.endereco_ptm', '<>', '')
            .groupBy('usuario.login', 'usuario.nome')

        // Union das duas queries
        knex.raw(`
            SELECT login, nome, tipo, qtde::integer FROM (
                (${querySorter.toString()})
                UNION ALL
                (${queryContingencia.toString()})
            ) as resultado
            ORDER BY login, tipo
        `)
        .then(resultado => res.json(resultado.rows))
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        const dataInicial = req.params.data_inicial
        const dataFinal = req.params.data_final

        // Query para SORTER (id_usuario em pallet_itens, endereco_ptm vazio)
        const querySorter = app.bd('pallet_itens')
            .select('usuario.login', 'usuario.nome')
            .select(knex.raw("'SORTER' as tipo"))
            .count({qtde:'pallet_itens.id_pallet_itens'})
            .innerJoin('usuario', 'pallet_itens.id_usuario', 'usuario.id_usuario')
            .innerJoin('pallet', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .whereRaw('(pallet.endereco_ptm IS NULL OR pallet.endereco_ptm = ?)', [''])
            .whereBetween('pallet_itens.data_leitura', [dataInicial, dataFinal])
            .groupBy('usuario.login', 'usuario.nome')

        // Query para CONTINGÊNCIA (id_usuario em pallet, conta pallet_itens, filtro por pallet_itens.data_leitura)
        const queryContingencia = app.bd('pallet_itens')
            .select('usuario.login', 'usuario.nome')
            .select(knex.raw("'CONTINGÊNCIA' as tipo"))
            .count({qtde:'pallet_itens.id_pallet_itens'})
            .innerJoin('pallet', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .innerJoin('usuario', 'pallet.id_usuario', 'usuario.id_usuario')
            .whereNotNull('pallet.endereco_ptm')
            .where('pallet.endereco_ptm', '<>', '')
            .whereBetween('pallet_itens.data_leitura', [dataInicial, dataFinal])
            .groupBy('usuario.login', 'usuario.nome')

        // Union das duas queries
        knex.raw(`
            SELECT login, nome, tipo, qtde::integer FROM (
                (${querySorter.toString()})
                UNION ALL
                (${queryContingencia.toString()})
            ) as resultado
            ORDER BY nome, tipo
        `)
        .then(resultado => res.json(resultado.rows))
        .catch(err => res.status(500).send(err))
    }

    return { consultar, consultarData }
}
