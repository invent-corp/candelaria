module.exports = app => {
	
	const caminhoBat = 'c:/11.Invent/Backend/servico'
	const caminhoBatWeb = 'c:/11.Invent/Webservice'
	const { execFile } = require('child_process')

	const statusPlc = async (req, res) => {
		execFile(`${caminhoBat}/status_plc.bat`, (error, stdout, stderr) => {
		if (error) {
			throw error
		}
		res.send(stdout)
		})
	}

	const stopPlc = async (req, res) => {
		execFile(`./servico/PLC.exe`, ['stop'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PLC" Parando...')
	}

	const startPlc = async (req, res) => {
		execFile(`./servico/PLC.exe`, ['start'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PLC" Iniciando...')
	}

	const restartPlc = async (req, res) => {
		execFile(`./servico/PLC.exe`, ['restart'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PLC" Reiniciando...')
	}

	const statusPtl = async (req, res) => {
		execFile(`${caminhoBat}/status_ptl.bat`, (error, stdout, stderr) => {
		if (error) {
			throw error
		}
		res.send(stdout)
		})
	}

	const stopPtl = async (req, res) => {
		execFile(`./servico/PTL.exe`, ['stop'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PTL" Parando...')
	}

	const startPtl = async (req, res) => {
		execFile(`./servico/PTL.exe`, ['start'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PTL" Iniciando...')
	}

	const restartPtl = async (req, res) => {
		execFile(`./servico/PTL.exe`, ['restart'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent PTL" Reiniciando...')
	}

	const statusWebService = async (req, res) => {
		execFile(`${caminhoBatWeb}/status_webservice.bat`, (error, stdout, stderr) => {
		if (error) {
			throw error
		}
		res.send(stdout)
		})
	}

	const stopWebService = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE.exe`, ['stop'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE" Parando...')
	}

	const startWebService = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE.exe`, ['start'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE" Iniciando...')
	}

	const restartWebService = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE.exe`, ['restart'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE" Reiniciando...')
	}

	const statusWebServiceRetorno = async (req, res) => {
		execFile(`${caminhoBatWeb}/status_webserviceretorno.bat`, (error, stdout, stderr) => {
		if (error) {
			throw error
		}
		res.send(stdout)
		})
	}

	const stopWebServiceRetorno = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE_RETORNO.exe`, ['stop'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE RETORNO" Parando...')
	}

	const startWebServiceRetorno = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE_RETORNO.exe`, ['start'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE RETORNO" Iniciando...')
	}

	const restartWebServiceRetorno = async (req, res) => {
		execFile(`${caminhoBatWeb}/WEBSERVICE_RETORNO.exe`, ['restart'], (error, stdout, stderr) => {
			if (error) {
				throw error
			}
		})
		res.send('Service "Invent WEBSERVICE RETORNO" Reiniciando...')
	}

	return { statusPlc, stopPlc, startPlc, restartPlc, statusPtl, stopPtl, startPtl, restartPtl, 
			 statusWebService, stopWebService, startWebService, restartWebService,
			 statusWebServiceRetorno, stopWebServiceRetorno, startWebServiceRetorno, restartWebServiceRetorno }
}