module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultar = async (req, res) => {
        knex.raw(`
            SELECT
                c.etiqueta,
                c.saida_previsto as rampa,
                ro.codigo as nome_rampa,
                c.centro_destino as destino,
                TO_CHAR(c.data_leitura, 'DD/MM/YYYY HH24:MI:SS') as primeira_leitura,
                c.ordem as descricao
            FROM
                caixa c
            INNER JOIN
                rampa r ON r.numero_rampa = c.saida_previsto
            inner join 
            	ROTA RO on RO.ID_ROTA = C.ID_ROTA
            WHERE
                c.data_leitura IS NOT NULL
                AND c.id_pallet IS NULL
                AND c.saida_previsto <> 999
            ORDER BY
                c.saida_previsto, c.data_leitura DESC
        `)
            .then((volumes_pendentes) => {
                const conteudoDosRegistros = volumes_pendentes.rows;
                res.json(conteudoDosRegistros);
            })
            .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        knex.raw(`
            SELECT
                c.etiqueta,
                c.saida_previsto as rampa,
                ro.codigo as nome_rampa,
                c.centro_destino as destino,
                TO_CHAR(c.data_leitura, 'DD/MM/YYYY HH24:MI:SS') as primeira_leitura,
                c.ordem as descricao
            FROM
                caixa c
            INNER JOIN
                rampa r ON r.numero_rampa = c.saida_previsto
            inner join 
            	ROTA RO on RO.ID_ROTA = C.ID_ROTA
            WHERE
                c.data_leitura IS NOT NULL
                AND c.id_pallet IS NULL
                AND c.saida_previsto <> 999
                AND c.data_leitura BETWEEN ? AND ?
            ORDER BY
                c.saida_previsto, c.data_leitura DESC
        `, [req.params.data_inicial, req.params.data_final])
            .then((volumes_pendentes) => {
                const conteudoDosRegistros = volumes_pendentes.rows;
                res.json(conteudoDosRegistros);
            })
            .catch(err => res.status(500).send(err))
    }

    const consultarPorRampa = async (req, res) => {
        knex.raw(`
            SELECT
                c.etiqueta,
                c.saida_previsto as rampa,
                ro.codigo as nome_rampa,
                c.centro_destino as destino,
                TO_CHAR(c.data_leitura, 'DD/MM/YYYY HH24:MI:SS') as primeira_leitura,
                c.ordem as descricao
            FROM
                caixa c
            INNER JOIN
                rampa r ON r.numero_rampa = c.saida_previsto
            inner join 
            	ROTA RO on RO.ID_ROTA = C.ID_ROTA
            WHERE
                c.data_leitura IS NOT NULL
                AND c.id_pallet IS NULL
                AND c.saida_previsto = ?
                AND c.data_leitura BETWEEN ? AND ?
            ORDER BY
                c.data_leitura DESC
        `, [req.params.rampa, req.params.data_inicial, req.params.data_final])
            .then((volumes_pendentes) => {
                const conteudoDosRegistros = volumes_pendentes.rows;
                res.json(conteudoDosRegistros);
            })
            .catch(err => res.status(500).send(err))
    }

    const consultarResumo = async (req, res) => {
        knex.raw(`
            SELECT
                r.numero_rampa as rampa,
                ro.codigo as nome_rampa,
                COUNT(c.id_caixa) as qtde_pendente,
                TO_CHAR(MAX(c.data_leitura), 'DD/MM/YYYY HH24:MI:SS') as ultima_leitura
            FROM
                caixa c
            INNER JOIN
                rampa r ON r.numero_rampa = c.saida_previsto
            inner join 
            	ROTA RO on RO.ID_ROTA = C.ID_ROTA
            WHERE
                c.data_leitura IS NOT NULL
                AND c.id_pallet IS NULL
                AND c.saida_previsto <> 999
                AND c.data_leitura BETWEEN ? AND ?
            GROUP BY
                r.numero_rampa, r.nome
            ORDER BY
                qtde_pendente DESC, r.numero_rampa
        `, [req.params.data_inicial, req.params.data_final])
            .then((resumo) => {
                const conteudoDosRegistros = resumo.rows;
                res.json(conteudoDosRegistros);
            })
            .catch(err => res.status(500).send(err))
    }

    return { consultar, consultarData, consultarPorRampa, consultarResumo }
}
