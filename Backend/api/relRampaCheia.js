module.exports = app => {

    const consultarData = async (req, res) => {
        try {
            const { data_inicial, data_final } = req.params

            // Buscar todas as mensagens ACKN com A99 (rampa cheia) no período
            const mensagensAckn = await app.bd('mensagem_log')
                .select('id_log', 'mensagem', 'data')
                .where('tipo', 'ACKN')
                .where('mensagem', 'like', '%A99%')
                .whereBetween('data', [data_inicial, data_final])
                .orderBy('data', 'asc')

            // Array para armazenar os dados processados
            const rampasCheias = []

            // Para cada ACKN, buscar o DLST correspondente
            for (const ackn of mensagensAckn) {
                // Extrair código de correlação do ACKN
                // Formato: F001;MFS1;1949;LREP;1942;...
                const partesAckn = ackn.mensagem.split(';')
                let codigoCorrelacao = null

                // O código de correlação está na posição 4 (índice 4)
                if (partesAckn.length >= 5) {
                    codigoCorrelacao = partesAckn[4]
                }

                if (!codigoCorrelacao) continue

                // Buscar DLST correspondente nos últimos 1 minuto antes do ACKN
                const dataAckn = new Date(ackn.data)
                const dataInicioBusca = new Date(dataAckn.getTime() - 60000) // 1 minuto antes

                const dlst = await app.bd('mensagem_log')
                    .select('mensagem', 'data')
                    .where('tipo', 'DLST')
                    .where('mensagem', 'like', `%;${codigoCorrelacao};%`)
                    .whereBetween('data', [dataInicioBusca, dataAckn])
                    .orderBy('data', 'desc')
                    .first()

                if (dlst) {
                    // Extrair rampa do DLST
                    // Formato: MFS1;F001;1844;DLST;000000014784554...;0006;1844;SRT01...;.....
                    const partesDlst = dlst.mensagem.split(';')
                    let rampa = 'N/A'

                    // A rampa está na posição 5 (índice 5)
                    if (partesDlst.length >= 6) {
                        rampa = partesDlst[5].trim()
                    }

                    rampasCheias.push({
                        rampa: rampa,
                        data_ackn: ackn.data,
                        codigo_correlacao: codigoCorrelacao,
                        mensagem_ackn: ackn.mensagem,
                        mensagem_dlst: dlst.mensagem
                    })
                }
            }

            // Totalizar por rampa
            const totalizacao = {}
            const detalhes = {}

            rampasCheias.forEach(item => {
                if (!totalizacao[item.rampa]) {
                    totalizacao[item.rampa] = 0
                    detalhes[item.rampa] = []
                }
                totalizacao[item.rampa]++
                detalhes[item.rampa].push({
                    data: item.data_ackn,
                    codigo_correlacao: item.codigo_correlacao
                })
            })

            // Converter para array ordenado
            const resultado = Object.keys(totalizacao).map(rampa => ({
                rampa: rampa,
                quantidade: totalizacao[rampa],
                detalhes: detalhes[rampa]
            })).sort((a, b) => b.quantidade - a.quantidade)

            // Calcular totais
            const totalGeral = rampasCheias.length
            const totalRampas = resultado.length

            res.json({
                dados: resultado,
                metricas: {
                    totalOcorrencias: totalGeral,
                    totalRampas: totalRampas,
                    mediaOcorrenciasPorRampa: totalRampas > 0 ? (totalGeral / totalRampas).toFixed(2) : 0
                },
                periodo: {
                    inicio: data_inicial,
                    fim: data_final
                }
            })

        } catch (err) {
            console.error('Erro ao consultar rampa cheia:', err)
            res.status(500).send(err)
        }
    }

    const consultarDetalhes = async (req, res) => {
        try {
            const { data_inicial, data_final, rampa } = req.params

            // Buscar todas as mensagens ACKN com A99 (rampa cheia) no período
            const mensagensAckn = await app.bd('mensagem_log')
                .select('id_log', 'mensagem', 'data')
                .where('tipo', 'ACKN')
                .where('mensagem', 'like', '%A99%')
                .whereBetween('data', [data_inicial, data_final])
                .orderBy('data', 'asc')

            const detalhes = []

            for (const ackn of mensagensAckn) {
                const partesAckn = ackn.mensagem.split(';')
                let codigoCorrelacao = null

                if (partesAckn.length >= 5) {
                    codigoCorrelacao = partesAckn[4]
                }

                if (!codigoCorrelacao) continue

                const dataAckn = new Date(ackn.data)
                const dataInicioBusca = new Date(dataAckn.getTime() - 60000)

                const dlst = await app.bd('mensagem_log')
                    .select('mensagem', 'data')
                    .where('tipo', 'DLST')
                    .where('mensagem', 'like', `%;${codigoCorrelacao};%`)
                    .whereBetween('data', [dataInicioBusca, dataAckn])
                    .orderBy('data', 'desc')
                    .first()

                if (dlst) {
                    const partesDlst = dlst.mensagem.split(';')
                    let rampaEncontrada = 'N/A'

                    if (partesDlst.length >= 6) {
                        rampaEncontrada = partesDlst[5].trim()
                    }

                    // Filtrar pela rampa se especificada
                    if (!rampa || rampaEncontrada === rampa) {
                        detalhes.push({
                            rampa: rampaEncontrada,
                            data: ackn.data,
                            codigo_correlacao: codigoCorrelacao,
                            mensagem_ackn: ackn.mensagem,
                            mensagem_dlst: dlst.mensagem
                        })
                    }
                }
            }

            res.json(detalhes)

        } catch (err) {
            console.error('Erro ao consultar detalhes rampa cheia:', err)
            res.status(500).send(err)
        }
    }

    return { consultarData, consultarDetalhes }
}
