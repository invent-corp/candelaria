module.exports = app => {
    
    const sql = require('mssql')    
    const { existeOuErro } = app.api.validacao
    const config = require('../knexfile.js')

    const salvar = async (req, res) => {
        var onda = req.params.onda
        var id_usuario = req.params.id_usuario
        sql.connect(config.connection)
        .then(result => {
            // Stored procedure
        return result.request()
             .input('ONDA', sql.Numeric, onda)
             .input('ID_USUARIO', sql.Numeric, id_usuario)
             .output('resultado', sql.VarChar(100))
             .execute('SP_REPROCESSAR_ONDA')
        })
        .then(result => res.json(result.output))
        .catch(err => res.status(500).send(err))
    }

    const consultar = async (req, res) => {
        app.bd('int_caixa_reprocessada')
        .select('onda', 'data_reprocessamento','usuario.nome')
        .innerJoin('usuario', 'int_caixa_reprocessada.id_usuario', 'usuario.id_usuario')
        .orderBy('data_reprocessamento','desc')
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        var data = new Date()
        data.setDate(data.getDate() - 7)
        data.setHours(data.getHours() - 3)
        var jsonData = data.toJSON()

        app.bd('int_caixa_log')
        .select('onda', 'id_int_caixa_log')
        .where( 'data_inicio', '>=', jsonData )
        .orderBy('data_inicio')
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))

    }

    const consultarId = async (req, res) => {

        const ondaExiste = await
        app.bd('int_caixa_log')
        .select( 'id_int_caixa_log' )
        .where({ id_int_caixa_log: req.params.id_int_caixa_log })

        try {
            existeOuErro(ondaExiste, 'Onda inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }
        
        app.bd('int_caixa_log')
        .select('id_int_caixa_log', 'onda', 'data_inicio', 'data_fim', 'operacao', 'concluido')
        .where({ id_int_caixa_log: req.params.id_int_caixa_log })
        .first()
        .then(onda => res.json(onda))
        .catch(err => res.status(500).send(err))
    }


    return { salvar, consultar, consultarAtivo, consultarId }
}