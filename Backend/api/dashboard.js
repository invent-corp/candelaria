module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultarDireito = async (req, res) => {
        knex.raw("SELECT '' as onda , '' as ultimo_produto,\
        COUNT(rel.oblpn) AS qtde_prevista, \
        SUM(rel.qtde_sorter) AS percentual, \
        SUM(rel.qtde_pallet) AS qtde_lida, \
        rel.rota as centro_destino\
    FROM \
        (\
        SELECT \
            DISTINCT oblpn , \
            ordem, \
            rota, \
            COALESCE(\
                (\
                SELECT \
                    COUNT(c.id_caixa) AS realizado \
                FROM \
                    caixa c\
                    INNER JOIN rota r ON r.id_rota = c.id_rota \
                WHERE \
                    NOT c.data_saida IS NULL AND \
                    c.saida_previsto > 1 AND \
                    c.etiqueta = pe.oblpn AND \
                    c.ordem = pe.ordem AND \
                    r.codigo = pe.rota\
                GROUP BY \
                    r.codigo\
                ), 0) AS qtde_sorter,\
            COALESCE(\
                (\
                SELECT \
                    COUNT(c.id_caixa) AS realizado \
                FROM \
                    caixa c\
                    INNER JOIN rota r ON r.id_rota = c.id_rota \
                WHERE \
                    NOT c.id_pallet IS NULL AND \
                    c.etiqueta = pe.oblpn AND \
                    c.ordem = pe.ordem AND \
                    r.codigo = pe.rota\
                GROUP BY \
                    r.codigo\
                ), 0) AS qtde_pallet \
        FROM \
            pedidos pe\
        WHERE \
            pe.data_processamento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second')\
            and pe.conferencia = 'null'\
        ) AS rel\
    GROUP BY \
        rel.rota")
        .then((dash_direito) => {
            const conteudoDosRegistros = dash_direito.rows;
            res.json(conteudoDosRegistros);
          })
    
        .catch(err => res.status(500).send(err))           
    }

    const consultarTotal = async (req, res) => {
        knex.raw("SELECT  COUNT(rel.oblpn) AS qtde_prevista, \
        coalesce(SUM(rel.qtde_sorter),0) AS qtde_sorter, \
        coalesce(SUM(rel.qtde_pallet),0) AS qtde_lida \
        FROM \
        (\
        SELECT \
            DISTINCT oblpn , \
            ordem,\
            rota, \
            COALESCE(\
                (\
                SELECT \
                    COUNT(c.id_caixa) AS realizado \
                FROM \
                    caixa c\
                    INNER JOIN rota r ON r.id_rota = c.id_rota \
                WHERE \
                    NOT c.data_saida IS NULL AND \
                    c.saida_previsto > 1 AND \
                    c.etiqueta = pe.oblpn AND \
                    c.ordem = pe.ordem AND \
                    r.codigo = pe.rota\
                GROUP BY \
                    r.codigo\
                ), 0) AS qtde_sorter,\
            COALESCE(\
                (\
                SELECT \
                    COUNT(c.id_caixa) AS realizado \
                FROM \
                    caixa c\
                    INNER JOIN rota r ON r.id_rota = c.id_rota \
                WHERE \
                    NOT c.id_pallet IS NULL AND \
                    c.etiqueta = pe.oblpn AND \
                    c.ordem = pe.ordem AND \
                    r.codigo = pe.rota\
                GROUP BY \
                    r.codigo\
                ), 0) AS qtde_pallet \
        FROM \
            pedidos pe\
        WHERE \
            pe.data_processamento BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second')\
            and pe.conferencia = 'null'\
        ) AS rel")
        .then((dash_total) => {
            const conteudoDosRegistros = dash_total.rows;
            res.json(conteudoDosRegistros);
          })
    
        .catch(err => res.status(500).send(err))           
    }


    const consultarEsquerdo = async (req, res) => {
        knex.raw("SELECT onda, centro_destino, qtde_prevista, qtde_lida, CAST(qtde_lida * 100 / qtde_prevista AS numeric(15, 2)) AS percentual, ultimo_produto \
        FROM    (SELECT onda, centro_destino, qtde_prevista, \
                    (SELECT COUNT(id_pallet) AS Expr1 \
                        FROM    dbo.pallet_itens AS p \
                        WHERE   (centro_destino = cc.centro_destino) AND (onda = cc.onda)) AS qtde_lida, ISNULL \
                    ((SELECT TOP (1) etiqueta \
                        FROM            dbo.pallet_itens AS i \
                        WHERE        (centro_destino = cc.centro_destino) AND (onda = cc.onda) \
                        ORDER BY id_pallet_itens DESC), '') AS ultimo_produto \
                FROM    (SELECT c.onda, c.centro_destino, SUM(c.qtde) AS qtde_prevista \
                        FROM    dbo.int_caixa AS c INNER JOIN \
                                dbo.rota AS rr ON rr.codigo = c.centro_destino INNER JOIN \
                                dbo.rota_sorter AS sr ON sr.id_rota = rr.id_rota INNER JOIN \
                                dbo.sorter AS so ON so.id_sorter = sr.id_sorter INNER JOIN \
                                dbo.rampa AS ra ON ra.id_rampa = so.id_rampa AND ra.descricao = 'Lado Esquerdo' \
                                inner join dbo.mapa_sorter m on m.id_mapa_sorter = so.id_mapa_sorter and m.operacao = 'Sim' and m.situacao = 'Ativo' \
        WHERE   (c.onda IN \
            (SELECT TOP (1) onda \
            FROM    dbo.int_caixa_log AS l \
            WHERE   (operacao = 'Sim'))) \
        GROUP BY c.onda, c.centro_destino) AS cc) AS dash \
        ")
        .then(dash_esquerdo => res.json(dash_esquerdo))
        .catch(err => res.status(500).send(err))           
    }

    const consultarRejeito = async (req, res) => {
   //     app.bd('caixa AS i')
   //     .select('etiqueta')
   //     .whereRaw('1 = 1')
   //     .andWhere('saida_previsto', 999)
   //     .orderBy('data_leitura', 'desc')
   //     .limit(1)        
        knex.raw("SELECT qtde_lida, CAST('0' AS numeric(15, 2)) as percentual, '' as ultimo_produto \
        FROM (SELECT COUNT(id_caixa) AS qtde_lida\
              FROM  caixa\
              WHERE saida_previsto = 999 \
              AND data_leitura BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second')) as rel \
        ")
        .then((dash_esquerdo) => {
            const conteudoDosRegistros = dash_esquerdo.rows;
            res.json(conteudoDosRegistros);
          })
   //     .then(dash_esquerdo => res.json(dash_esquerdo))
        .catch(err => res.status(500).send(err))           
    }

    const consultarEsquerdoSorter = async (req, res) => {
        knex.raw("select onda,centro_destino,qtde_prevista,qtde_tratada,CAST(qtde_tratada * 100 / qtde_prevista AS numeric(15, 2)) AS percentual \
        from \
        (SELECT cc.onda, cc.centro_destino, cc.qtde_prevista, (select count(c.id_caixa) from caixa c where c.onda = cc.onda and c.centro_destino = cc.centro_destino and not c.data_saida is null) as qtde_tratada \
                        from \
                        (SELECT c.onda, c.centro_destino, SUM(c.qtde) AS qtde_prevista \
                                FROM    dbo.int_caixa AS c \
                                INNER JOIN dbo.rota AS rr ON rr.codigo = c.centro_destino \
                                INNER JOIN dbo.rota_sorter AS sr ON sr.id_rota = rr.id_rota \
                                INNER JOIN dbo.sorter AS so ON so.id_sorter = sr.id_sorter \
                                INNER JOIN dbo.rampa AS ra ON ra.id_rampa = so.id_rampa AND ra.descricao = 'Lado Esquerdo' \
                                inner join dbo.mapa_sorter m on m.id_mapa_sorter = so.id_mapa_sorter and m.operacao = 'Sim' and m.situacao = 'Ativo' \
                        WHERE c.onda IN (SELECT TOP (1) onda FROM dbo.int_caixa_log AS l WHERE operacao = 'Sim') \
                    GROUP BY c.onda, c.centro_destino) as cc) as dash")
        .then(dash_esquerdo => res.json(dash_esquerdo))
        .catch(err => res.status(500).send(err))           
    }

    const consultarDireitoSorter = async (req, res) => {
        knex.raw("select onda,centro_destino,qtde_prevista,qtde_tratada,CAST(qtde_tratada * 100 / qtde_prevista AS numeric(15, 2)) AS percentual \
        from \
        (SELECT cc.onda, cc.centro_destino, cc.qtde_prevista, (select count(c.id_caixa) from caixa c where c.onda = cc.onda and c.centro_destino = cc.centro_destino and not c.data_saida is null) as qtde_tratada \
                        from \
                        (SELECT c.onda, c.centro_destino, SUM(c.qtde) AS qtde_prevista \
                                FROM    dbo.int_caixa AS c \
                                INNER JOIN dbo.rota AS rr ON rr.codigo = c.centro_destino \
                                INNER JOIN dbo.rota_sorter AS sr ON sr.id_rota = rr.id_rota \
                                INNER JOIN dbo.sorter AS so ON so.id_sorter = sr.id_sorter \
                                INNER JOIN dbo.rampa AS ra ON ra.id_rampa = so.id_rampa AND ra.descricao = 'Lado Direito' \
                                inner join dbo.mapa_sorter m on m.id_mapa_sorter = so.id_mapa_sorter and m.operacao = 'Sim' and m.situacao = 'Ativo' \
                        WHERE c.onda IN (SELECT TOP (1) onda FROM dbo.int_caixa_log AS l WHERE operacao = 'Sim') \
                    GROUP BY c.onda, c.centro_destino) as cc) as dash")
        .then(dash_direito => res.json(dash_direito))
        .catch(err => res.status(500).send(err))           
    }

    const consultarRejeitoSorter = async (req, res) => {
        knex.raw("SELECT qtde_lida, CAST(qtde_lida * 100 / qtde_total AS numeric(15, 2)) AS percentual \
                FROM \
                (select onda, 0 as qtde_prevista, qtde_lida, \
                 isnull((select count(id_caixa) from caixa as c where c.onda = cai.onda and c.saida_previsto <> 999),'0') as qtde_total \
                FROM \
                     (SELECT onda, COUNT(id_caixa) AS qtde_lida \
                     FROM    caixa AS ca \
                      WHERE saida_previsto = 999 AND onda IN (SELECT TOP (1) onda FROM    int_caixa_log AS l WHERE operacao = 'Sim') \
                      GROUP BY onda) AS cai) AS rej")
        .then(dash_esquerdo => res.json(dash_esquerdo))
        .catch(err => res.status(500).send(err))           
    }    


    const consultarEsquerdoFaltaBipar = async (req, res) => {
        knex.raw("select onda, centro_destino, (SELECT COUNT(p.id_pallet) AS expr1 \
                 FROM  dbo.pallet_itens AS p WITH(NOLOCK) \
                inner join caixa as cai WITH(NOLOCK) on cai.id_caixa  = p.id_caixa and cai.estacao_leitura <> 'manual' \
                 WHERE p.centro_destino = cc.centro_destino AND p.onda = cc.onda) AS qtde_pallet, \
                (SELECT COUNT(id_caixa) AS expr2 \
                 FROM  dbo.caixa AS c WITH(NOLOCK) \
                WHERE c.centro_destino = cc.centro_destino AND c.onda = cc.onda \
                and c.estacao_leitura <> 'manual' \
                 ) AS qtde_sorter \
                 from ( \
                select distinct ca.centro_destino,ca.onda from caixa ca WITH(NOLOCK) \
                inner join dbo.rampa r on r.numero_rampa = ca.saida_previsto and r.descricao = 'Lado Esquerdo' \
                where ca.onda in (SELECT TOP (1) onda \
                FROM    dbo.int_caixa_log AS l \
                WHERE   (operacao = 'Sim')) \
                and ca.id_pallet is null \
                and ca.saida_previsto <> 999 \
                and ca.estacao_leitura <> 'manual' \
                and datediff(MINUTE,ca.data_leitura,getdate()) > 2 \
                ) as cc")
        .then(dash_esquerdo => res.json(dash_esquerdo))
        .catch(err => res.status(500).send(err))           
    }

    const consultarDireitoFaltaBipar = async (req, res) => {
        knex.raw("select onda, centro_destino, (SELECT COUNT(p.id_pallet) AS expr1 \
                 FROM  dbo.pallet_itens AS p WITH(NOLOCK) \
                inner join caixa as cai WITH(NOLOCK) on cai.id_caixa  = p.id_caixa and cai.estacao_leitura <> 'manual' \
                 WHERE p.centro_destino = cc.centro_destino AND p.onda = cc.onda) AS qtde_pallet, \
                (SELECT COUNT(id_caixa) AS expr2 \
                 FROM  dbo.caixa AS c WITH(NOLOCK) \
                WHERE c.centro_destino = cc.centro_destino AND c.onda = cc.onda \
                and c.estacao_leitura <> 'manual' \
                 ) AS qtde_sorter \
                 from ( \
                select distinct ca.centro_destino,ca.onda from caixa ca WITH(NOLOCK) \
                inner join dbo.rampa r on r.numero_rampa = ca.saida_previsto and r.descricao = 'Lado Direito' \
                where ca.onda in (SELECT TOP (1) onda \
                FROM    dbo.int_caixa_log AS l \
                WHERE   (operacao = 'Sim')) \
                and ca.id_pallet is null \
                and ca.saida_previsto <> 999 \
                and ca.estacao_leitura <> 'manual' \
                and datediff(MINUTE,ca.data_leitura,getdate()) > 2 \
                ) as cc")
        .then(dash_direito => res.json(dash_direito))
        .catch(err => res.status(500).send(err))           
    }



    return { consultarDireito, consultarTotal, consultarEsquerdo, consultarRejeito, consultarEsquerdoSorter, consultarDireitoSorter, consultarRejeitoSorter, consultarEsquerdoFaltaBipar, consultarDireitoFaltaBipar  }
 }
