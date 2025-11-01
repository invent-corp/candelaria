module.exports = app => {

    const multer = require('multer')
    const xlsx = require('xlsx')
    const path = require('path')
    const fs = require('fs')

    // Configuração do multer para upload de arquivos
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadDir = path.join(__dirname, '../uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }
            cb(null, uploadDir)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, 'produtos-' + uniqueSuffix + path.extname(file.originalname))
        }
    })

    const upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase()
            if (ext !== '.xlsx' && ext !== '.xls') {
                return cb(new Error('Apenas arquivos Excel (.xlsx ou .xls) são permitidos!'))
            }
            cb(null, true)
        },
        limits: {
            fileSize: 10 * 1024 * 1024 // Limite de 10MB
        }
    }).single('file')

    const importar = async (req, res) => {
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: 'Erro no upload: ' + err.message })
            } else if (err) {
                return res.status(400).json({ error: err.message })
            }

            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo foi enviado!' })
            }

            try {
                // Ler o arquivo Excel
                const workbook = xlsx.readFile(req.file.path)
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                const data = xlsx.utils.sheet_to_json(worksheet)

                if (data.length === 0) {
                    fs.unlinkSync(req.file.path) // Remove o arquivo
                    return res.status(400).json({ error: 'O arquivo Excel está vazio!' })
                }

                let sucesso = 0
                let erros = 0
                let detalhesErros = []

                // Processar cada linha do Excel
                for (let i = 0; i < data.length; i++) {
                    const row = data[i]

                    // Validar campos obrigatórios
                    if (!row.sku || !row.descricao || !row.etiqueta) {
                        erros++
                        detalhesErros.push({
                            linha: i + 2, // +2 porque linha 1 é cabeçalho e arrays começam em 0
                            erro: 'Campos obrigatórios faltando (sku, descricao ou etiqueta)'
                        })
                        continue
                    }

                    try {
                        // Verificar se o produto já existe
                        const produtoExiste = await app.bd('produtos')
                            .where('sku', row.sku)
                            .first()

                        if (produtoExiste) {
                            // Atualizar produto existente
                            await app.bd('produtos')
                                .where('sku', row.sku)
                                .update({
                                    descricao: row.descricao,
                                    etiqueta: row.etiqueta,
                                    data_atualizacao: app.bd.fn.now()
                                })
                        } else {
                            // Inserir novo produto
                            await app.bd('produtos').insert({
                                sku: row.sku,
                                descricao: row.descricao,
                                etiqueta: row.etiqueta,
                                situacao: 'Ativo',
                                data_cadastro: app.bd.fn.now()
                            })
                        }
                        sucesso++
                    } catch (dbError) {
                        erros++
                        detalhesErros.push({
                            linha: i + 2,
                            sku: row.sku,
                            erro: 'Erro ao processar: ' + dbError.message
                        })
                    }
                }

                // Remover o arquivo após processar
                fs.unlinkSync(req.file.path)

                res.json({
                    success: true,
                    mensagem: `Importação concluída!`,
                    total: data.length,
                    sucesso: sucesso,
                    erros: erros,
                    detalhesErros: detalhesErros.length > 0 ? detalhesErros : null
                })

            } catch (error) {
                // Remover o arquivo em caso de erro
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path)
                }
                res.status(500).json({ error: 'Erro ao processar arquivo: ' + error.message })
            }
        })
    }

    const downloadTemplate = async (req, res) => {
        try {
            // Criar um arquivo Excel de template
            const wb = xlsx.utils.book_new()

            // Dados de exemplo
            const ws_data = [
                ['sku', 'descricao', 'etiqueta'],
                ['12345', 'Produto Exemplo 1', 'ETIQ001'],
                ['67890', 'Produto Exemplo 2', 'ETIQ002']
            ]

            const ws = xlsx.utils.aoa_to_sheet(ws_data)

            // Ajustar largura das colunas
            ws['!cols'] = [
                { wch: 15 },  // sku
                { wch: 40 },  // descricao
                { wch: 15 }   // etiqueta
            ]

            xlsx.utils.book_append_sheet(wb, ws, 'Produtos')

            // Gerar o arquivo
            const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' })

            res.setHeader('Content-Disposition', 'attachment; filename=template_produtos.xlsx')
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            res.send(buffer)

        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar template: ' + error.message })
        }
    }

    return { importar, downloadTemplate }
}
