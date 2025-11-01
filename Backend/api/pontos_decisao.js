module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const pontos = { ...req.body }

        if(req.params.id_ponto) pontos.id_ponto = req.params.id_ponto

        if(pontos.id_ponto) {
            app.bd('ponto_decisao')
            .update({ codigo_produto: produtos.codigo_produto, descricao: produtos.descricao, largura: produtos.largura, 
                      altura: produtos.altura, comprimento: produtos.comprimento, peso: produtos.peso, cubagem: produtos.cubagem,
                      peso_liquido: produtos.peso_liquido, tara: produtos.tara, situacao: produtos.situacao })
            .where({id_produto: produtos.id_produto})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('produtos')
            .insert({ codigo_produto: produtos.codigo_produto, descricao: produtos.descricao, largura: produtos.largura, 
                altura: produtos.altura, comprimento: produtos.comprimento, peso: produtos.peso, cubagem: produtos.cubagem,
                peso_liquido: produtos.peso_liquido, tara: produtos.tara, situacao: produtos.situacao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('produtos')
        .select({id_produto:'id_produto'}, {codigo_produto:'codigo_produto'}, {descricao:'descricao'}, {largura:'largura'}, 
                {altura:'altura'}, {comprimento:'comprimento'},{peso:'peso'},{cubagem:'cubagem'},{peso_liquido:'peso_liquido'},
                {tara:'tara'}, {situacao:'situacao'})
        .then(produtos => res.json(produtos))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const consPostos = await
        app.bd('produtos')
        .select({id_produto:'id_produto'})
        .where({ id_produto: req.params.id_produto })

        try {
            existeOuErro(consPostos, 'Produto inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('produtos')
        .select({id_produto:'id_produto'}, {codigo_produto:'codigo_produto'}, {descricao:'descricao'}, {largura:'largura'}, 
                {altura:'altura'}, {comprimento:'comprimento'},{peso:'peso'},{cubagem:'cubagem'},{peso_liquido:'peso_liquido'},
                {tara:'tara'}, {situacao:'situacao'})
        .where({ id_produto: req.params.id_produto})
        .first()
        .then(produtos => res.json(produtos))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('produtos')
        .select({id_produto:'id_produto'}, {codigo_produto:'codigo_produto'}, {descricao:'descricao'}, {largura:'largura'}, 
                {altura:'altura'}, {comprimento:'comprimento'},{peso:'peso'},{cubagem:'cubagem'},{peso_liquido:'peso_liquido'},
                {tara:'tara'}, {situacao:'situacao'})
        .where({ id_produto: req.params.id_produto })
        .orderBy('descricao')
        .then(produtos => res.json(produtos))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('produtos')
            .update({ situacao: "Inativo" })
            .where({ id_produto: req.params.id_produto })
            existeOuErro(linhaDesativada, 'Produto inexistente!')
            res.status(200).send('Produto desativado com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}