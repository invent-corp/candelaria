module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const consultar = async (req, res) => {
        app.bd([
            app.bd('pallet', 'usuario')
            .distinct('pallet.id_pallet', 'usuario.login', 'usuario.nome')
            .innerJoin('pallet_itens', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .innerJoin('usuario', 'usuario.id_usuario', 'pallet_itens.id_usuario')
        ])
        .count('id_pallet', {as: 'qtde'})
        .select('login', 'nome')
        .groupBy('login', 'nome')
        .then(pallets_operador => res.json(pallets_operador))
        .catch(err => res.status(500).send(err))
    }

    // const consultarData = async (req, res) => {
    //     var data_inicial = req.params.data_inicial
    //     var data_final = req.params.data_final
    //     knex.raw("SELECT COUNT \
    //         (r.id_pallet) AS qtde, \
    //         r.login, \
    //         r.nome \
    //     FROM \
    //         (SELECT DISTINCT \
    //             p.id_pallet, \
    //             u.login, \
    //             u.nome \
    //         FROM \
    //             pallet AS p \
    //             INNER JOIN \
    //                 pallet_itens AS i ON \
    //                 i.id_pallet = p.id_pallet \
    //             INNER JOIN \
    //                 usuario AS u ON \
    //                 u.id_usuario = i.id_usuario \
    //             WHERE \
    //                 p.data_finalizacao BETWEEN '" + data_inicial + "' AND '" + data_final + "' ) r \
    //             GROUP BY \
    //                 r.login, \
    //                 r.nome \
    //         ")
    //     .then(pallets_operador => res.json(pallets_operador))
    //     .catch(err => res.status(500).send(err))           
    // }

    const consultarData = async (req, res) => {
        app.bd([
            app.bd('pallet', 'usuario')
            .distinct('pallet.id_pallet', 'usuario.login', 'usuario.nome')
            .innerJoin('pallet_itens', 'pallet_itens.id_pallet', 'pallet.id_pallet')
            .innerJoin('usuario', 'usuario.id_usuario', 'pallet_itens.id_usuario')
            .whereBetween('pallet.data_finalizacao', [req.params.data_inicial, req.params.data_final])
        ])
        .count('id_pallet', {as: 'qtde'})
        .select('login', 'nome')
        .groupBy('login', 'nome')
        .then(pallets_operador => res.json(pallets_operador))
        .catch(err => res.status(500).send(err))           
    }

    return { consultar, consultarData }
 }
