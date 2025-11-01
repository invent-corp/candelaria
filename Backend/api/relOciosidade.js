module.exports = app => {

    const consultarPorPeriodo = async (req, res) => {
        const { data_inicial, data_final } = req.params

        try {
            // Buscar dados de ociosidade do período
            const ociosidades = await app.bd('OCIOSIDADE')
                .select('*')
                .whereBetween('TIMEINICIO', [data_inicial, data_final])
                .orderBy('TIMEINICIO', 'desc')

            // Calcular métricas
            const totalOcioso = ociosidades.reduce((acc, item) => acc + (parseFloat(item.DIFERENCA) || 0), 0)

            // Calcular tempo total do período (em segundos)
            const inicio = new Date(data_inicial)
            const fim = new Date(data_final)
            const tempoTotalPeriodo = (fim - inicio) / 1000 // em segundos

            const tempoAtivo = tempoTotalPeriodo - totalOcioso
            const percentualOcioso = tempoTotalPeriodo > 0 ? (totalOcioso / tempoTotalPeriodo * 100).toFixed(2) : 0

            // Agrupar por dia para o gráfico
            const ociosoPorDia = {}
            ociosidades.forEach(item => {
                const dia = new Date(item.TIMEINICIO).toLocaleDateString('pt-BR')
                if (!ociosoPorDia[dia]) {
                    ociosoPorDia[dia] = 0
                }
                ociosoPorDia[dia] += parseFloat(item.DIFERENCA) || 0
            })

            // Calcular maior e menor ociosidade
            const diferencas = ociosidades.map(item => parseFloat(item.DIFERENCA) || 0)
            const maiorOciosidade = diferencas.length > 0 ? Math.max(...diferencas) : 0
            const menorOciosidade = diferencas.length > 0 ? Math.min(...diferencas) : 0
            const mediaOciosidade = diferencas.length > 0 ? diferencas.reduce((a, b) => a + b, 0) / diferencas.length : 0

            res.json({
                ociosidades,
                metricas: {
                    tempoTotalOcioso: totalOcioso,
                    tempoAtivo,
                    percentualOcioso,
                    maiorOciosidade,
                    menorOciosidade,
                    mediaOciosidade,
                    totalRegistros: ociosidades.length
                },
                ociosoPorDia
            })

        } catch (err) {
            console.error('Erro ao consultar ociosidade:', err)
            res.status(500).send(err)
        }
    }

    const consultarPorDia = async (req, res) => {
        const { data } = req.params

        try {
            const dataInicio = `${data} 00:00:00`
            const dataFim = `${data} 23:59:59`

            const ociosidades = await app.bd('OCIOSIDADE')
                .select('*')
                .whereBetween('TIMEINICIO', [dataInicio, dataFim])
                .orderBy('TIMEINICIO', 'desc')

            res.json(ociosidades)

        } catch (err) {
            console.error('Erro ao consultar ociosidade por dia:', err)
            res.status(500).send(err)
        }
    }

    return { consultarPorPeriodo, consultarPorDia }
}
