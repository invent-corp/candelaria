module.exports = app => {
    
	const consultar = async (req, res) => {
		app.bd('mensagem_log')
		.select('id_log', 'mensagem', 'tipo', 'envio_recebe', 'data')
		.orderBy('data', 'desc')
		.where({tipo: 'LOG'})
		.then(mensagem_log => res.json(mensagem_log))
		.catch(err => res.status(500).send(err))
	}

	const consultarData = async (req, res) => {
		app.bd( 'mensagem_log')
		.select('id_log', 'mensagem', 'tipo', 'envio_recebe', 'data')
		.orderBy('data', 'desc')
		.where('tipo', '<>', req.params.tipo)
		.whereBetween('data', [req.params.data_inicial, req.params.data_final])
		.then(mensagem_log => res.json(mensagem_log))
		.catch(err => res.status(500).send(err))           
	}

   	return { consultar, consultarData }
}