module.exports = app => {

    const axios = require('axios')

    // Buscar logs de impressão por período
    const consultarPorPeriodo = async (req, res) => {
        const { data_inicial, data_final } = req.params

        const query = app.bd('LOGIMPRESSOES')
            .select('*')
            .where('EXCLUIDO', false)
            .whereBetween('CREATEDAT', [data_inicial, data_final])
            .orderBy('CREATEDAT', 'desc')

        query.then(resultado => {
            res.json(resultado)
        })
        .catch(err => res.status(500).send(err))
    }

    // Reimprimir etiqueta
    const reimprimir = async (req, res) => {
        try {
            const { idlog } = req.params
            const { impressora } = req.body

            // Buscar dados do log
            const log = await app.bd('LOGIMPRESSOES')
                .select('*')
                .where('IDLOGIMPRESSAO', idlog)
                .where('EXCLUIDO', false)
                .first()

            if (!log) {
                return res.status(404).json({ error: 'Log não encontrado' })
            }

            // Verificar se tem DADOSIMPRESSAO (dados da etiqueta)
            if (!log.DADOSIMPRESSAO) {
                return res.status(400).json({ error: 'Log não possui dados para reimprimir' })
            }

            // Parsear os dados
            let dadosEtiqueta
            try {
                dadosEtiqueta = JSON.parse(log.DADOSIMPRESSAO)
            } catch (e) {
                return res.status(400).json({ error: 'Dados da etiqueta inválidos' })
            }

            // Validar impressora
            if (!impressora) {
                return res.status(400).json({ error: 'Impressora não informada' })
            }

            // Montar payload para API de impressão
            const payload = {
                etiquetas: Array.isArray(dadosEtiqueta) ? dadosEtiqueta : [dadosEtiqueta],
                etiqueta: log.ETIQUETA || 'etiqueta_padrao', // Nome do template
                impressora: impressora
            }

            // Chamar API de impressão (porta 4005)
            const responseImpressao = await axios.post('http://localhost:4005/api/imprimir', payload)

            res.json({
                success: true,
                message: 'Etiqueta reenviada para impressão',
                data: responseImpressao.data
            })

        } catch (error) {
            console.error('Erro ao reimprimir:', error)
            res.status(500).json({
                error: 'Erro ao reimprimir etiqueta',
                details: error.message
            })
        }
    }

    return { consultarPorPeriodo, reimprimir }
}
