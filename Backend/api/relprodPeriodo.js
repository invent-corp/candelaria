const { Knex } = require('knex')

module.exports = app => {
    
    const config = require('../knexfile.js')
    const knex = require('knex')(config)

        const consultar = async (req, res) => {
        app.bd('caixa')
        .select({qtde: 'id_caixa'})
        .whereBetween('data_leitura', ['1800-1-1', '1800-1-1'])
        .then(prod_operador => res.json(prod_operador))
        .catch(err => res.status(500).send(err))
    }

    // const consultarData = async (req, res) => {
    //     var data_inicial = req.params.data_inicial
    //     var data_final = req.params.data_final
    //     knex.raw(" \
    //     SELECT \
    //         ISNULL(COUNT(c.id_caixa),0) AS qtde, \
    //         'TRATADOS' AS tipo \
    //     FROM \
    //         caixa AS c \
    //     WHERE \
    //         c.data_leitura BETWEEN '" + data_inicial + "' AND '" + data_final + "' \
    //     AND \
    //         c.data_saida IS NOT NULL \
    //         UNION SELECT \
    //             ISNULL(COUNT(c.id_caixa),0) AS qtde, \
    //             'NÃO TRATADOS' AS tipo \
    //         FROM \
    //             caixa AS c \
    //         WHERE \
    //             c.data_leitura BETWEEN '" + data_inicial + "' AND '" + data_final + "' \
    //         AND \
    //             c.data_saida IS NOT NULL \
    //         AND \
    //             c.etiqueta <= 0 \
    //         UNION SELECT \
    //             ISNULL(COUNT(C.id_caixa),0) AS qtde, \
    //             'REJEITADOS' AS tipo \
    //         FROM \
    //             caixa AS c \
    //         WHERE \
    //             c.data_leitura BETWEEN '" + data_inicial + "' AND '" + data_final + "' \
    //         AND \
    //             c.data_saida IS NOT NULL \
    //         AND \
    //             C.saida_real = 1 \
    //         UNION SELECT \
    //             ISNULL(SUM(C.numero_recirculacao),0) AS qtde, \
    //             'RECIRCULADOS' AS tipo \
    //         FROM \
    //             caixa AS c \
    //         WHERE \
    //             c.data_leitura BETWEEN '" + data_inicial + "' AND '" + data_final + "' \
    //         AND \
    //             c.data_saida IS NOT NULL \
    //         AND \
    //             C.numero_recirculacao > 0 \
    //     ")
    //     .then(prod_operador => res.json(prod_operador))
    //     .catch(err => res.status(500).send(err))           
    // }

const consultarData = async (req, res) => {
        
        // Constantes para os nomes mágicos, facilitando a manutenção
        const estacaoLeituraField = 'estacao_leitura';
        const contingenciaValue = 'CONTINGÊNCIA';

        try {
            const prod_operador = await app.bd('caixa')
                // 1. TRATADOS (Normal) 
                // Critérios originais E estação NÃO É contingência (ou é NULA)
                .countDistinct({qtde: 'etiqueta'})
                .select(knex.raw("'TRATADOS' AS tipo"))
                .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
                .whereNotNull('data_saida')
                .where(function() { // Agrupa condições com parênteses
                    this.where(estacaoLeituraField, '<>', contingenciaValue)
                        .orWhereNull(estacaoLeituraField)
                })

                // 2. TRATADOS (CONTINGÊNCIA) - (NOVO BLOCO)
                // Critérios originais E estação É contingência
                .union([
                    app.bd('caixa')
                        .countDistinct({qtde: 'etiqueta'})
                        .select(knex.raw("'TRATADOS (CONTINGÊNCIA)' AS tipo"))
                        .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
                        .whereNotNull('data_saida') // Mantém a regra original de 'TRATADOS'
                        .where(estacaoLeituraField, '=', contingenciaValue)
                ])

                // 3. REJEITADOS (SEM ONDA) - (Lógica original)
                .union([
                    app.bd('caixa')
                        .countDistinct({qtde: 'etiqueta'})
                        .select(knex.raw("'REJEITADOS (SEM ONDA)' AS tipo"))
                        .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
                        .where('saida_previsto', '=', 999)
                        .where('etiqueta', '<>', 'NOREAD')
                ])

                // 4. REJEITADOS (NOREAD) - (Lógica original)
                .union([
                    app.bd('caixa')
                        .count({qtde: 'id_caixa'})
                        .select(knex.raw("'REJEITADOS (NOREAD)' AS tipo"))
                        .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
                        //  .whereNotNull('data_saida')
                        .where('etiqueta', '=', 'NOREAD')
                        .where('saida_previsto', '=', 999)
                ])

                // 5. REJEITADOS (SEM DESVIO) - (Lógica original)
                .union([
                    app.bd('caixa')
                        .countDistinct({qtde: 'etiqueta'})
                        .select(knex.raw("'REJEITADOS (SEM DESVIO)' AS tipo"))
                        .whereBetween('data_leitura', [req.params.data_inicial, req.params.data_final])
                        //  .whereNotNull('data_saida')
                        .where('etiqueta', '<>', 'NOREAD')
                        .whereNull('data_saida')
                        .where('saida_previsto', '<>', 999)
                ]) // Fim do último union
                .orderBy('tipo');
            
            // O 'await' acima espera a query terminar
            res.json(prod_operador);

        } catch (err) {
            // Se qualquer parte da query falhar, o catch captura
            res.status(500).send(err);
        }
    }
 
    return { consultar, consultarData }
 }