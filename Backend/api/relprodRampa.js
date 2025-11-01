module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultar = async (req, res) => {
        // Buscar dados agrupados por rampa e rota
        const query = app.bd('caixa')
            .select('rampa.numero_rampa as rampa')
            .select('rampa.nome as nome_rampa')
            .select('rota.codigo as rota')
            .count({qtde:'caixa.id_caixa'})
            .innerJoin('rampa', 'caixa.saida_previsto', 'rampa.numero_rampa')
            .leftJoin('rota', 'caixa.id_rota', 'rota.id_rota')
            .whereNotNull('caixa.data_saida')
            .groupBy('rampa.numero_rampa', 'rampa.nome', 'rota.codigo')
            .orderBy('rampa.numero_rampa')
            .orderBy('rota.codigo')

        query.then(resultado => {
            // Transformar os dados em estrutura hierárquica
            const dadosAgrupados = agruparPorRampaComPercentual(resultado)
            res.json(dadosAgrupados)
        })
        .catch(err => res.status(500).send(err))
    }

    const consultarData = async (req, res) => {
        // Buscar dados agrupados por rampa e rota
        const query = app.bd('caixa')
            .select('rampa.numero_rampa as rampa')
            .select('rampa.nome as nome_rampa')
            .select('rota.codigo as rota')
            .count({qtde:'caixa.id_caixa'})
            .innerJoin('rampa', 'caixa.saida_previsto', 'rampa.numero_rampa')
            .leftJoin('rota', 'caixa.id_rota', 'rota.id_rota')
            .whereNotNull('caixa.data_saida')
            .whereBetween('caixa.data_leitura', [req.params.data_inicial, req.params.data_final])
            .groupBy('rampa.numero_rampa', 'rampa.nome', 'rota.codigo')
            .orderBy('rampa.numero_rampa')
            .orderBy('rota.codigo')

        query.then(resultado => {
            // Transformar os dados em estrutura hierárquica
            const dadosAgrupados = agruparPorRampaComPercentual(resultado)
            res.json(dadosAgrupados)
        })
        .catch(err => res.status(500).send(err))
    }

    // Função auxiliar para agrupar dados por rampa com percentual
    function agruparPorRampaComPercentual(dados) {
        const rampasMap = new Map()
        let totalGeral = 0

        // Primeiro passo: agrupar por rampa e calcular totais
        dados.forEach(item => {
            const chaveRampa = `${item.rampa}-${item.nome_rampa}`
            const qtde = parseInt(item.qtde)
            totalGeral += qtde

            if (!rampasMap.has(chaveRampa)) {
                rampasMap.set(chaveRampa, {
                    rampa: item.rampa,
                    nome: item.nome_rampa,
                    qtde: 0,
                    rotas: []
                })
            }

            const rampaAtual = rampasMap.get(chaveRampa)

            if (item.rota) {
                rampaAtual.rotas.push({
                    nome: item.rota,
                    qtde: qtde
                })
            }
            rampaAtual.qtde += qtde
        })

        // Segundo passo: calcular percentuais e formatar estrutura hierárquica
        const resultado = []

        rampasMap.forEach((rampaData) => {
            const percentualRampa = totalGeral > 0 ? (rampaData.qtde / totalGeral * 100).toFixed(2) : 0

            // Criar objeto da rampa
            const rampaObj = {
                rampa: rampaData.rampa,
                nome: rampaData.nome,
                volume: rampaData.qtde,
                participacao: `${percentualRampa}%`,
                tipo: 'rampa'
            }

            // Adicionar children apenas se houver rotas
            if (rampaData.rotas.length > 0) {
                rampaObj.children = []

                rampaData.rotas.forEach(rota => {
                    const percentualRota = totalGeral > 0 ? (rota.qtde / totalGeral * 100).toFixed(2) : 0

                    rampaObj.children.push({
                        rampa: rampaData.rampa,
                        nome: rota.nome,
                        volume: rota.qtde,
                        participacao: `${percentualRota}%`,
                        tipo: 'rota'
                    })
                })
            }

            resultado.push(rampaObj)
        })

        // Adicionar linha de TOTAL
        resultado.push({
            rampa: '',
            nome: 'Total',
            volume: totalGeral,
            participacao: '100.00%',
            tipo: 'total'
        })

        return resultado
    }

    return { consultar, consultarData }
}
