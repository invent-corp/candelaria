module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const { existeOuErro } = app.api.validacao

    const salvar = async (req, res) => {
        const caixas = { ...req.body }

        if(req.params.id_caixas) caixas.id_caixas = req.params.id_caixas

    //    console.log(caixas.peso_caixa)
        if(caixas.id_caixas) {
     //       var peso = caixas.peso_caixa.replace('.',',')
            var peso = caixas.peso_caixa
            app.bd('caixas')
            .update({ descricao: caixas.descricao, numero: caixas.numero, peso_caixa: peso, peso_suportavel: caixas.peso_suportavel,
                tamanho: caixas.tamanho, altura: caixas.altura, largura: caixas.largura, comprimento: caixas.comprimento,
                cm3: caixas.cm3, perc_ocupacao: caixas.perc_ocupacao, cm3_ocupacao: caixas.cm3_ocupacao, situacao: caixas.situacao })
            .where({id_caixas: caixas.id_caixas})
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
//            var peso = caixas.peso_caixa.replace('.',',')
            var peso = caixas.peso_caixa
            app.bd('caixas')
            .insert({ descricao: caixas.descricao, numero: caixas.numero, peso_caixa: peso, peso_suportavel: caixas.peso_suportavel,
                tamanho: caixas.tamanho, altura: caixas.altura, largura: caixas.largura, comprimento: caixas.comprimento,
                cm3: caixas.cm3, perc_ocupacao: caixas.perc_ocupacao, cm3_ocupacao: caixas.cm3_ocupacao, situacao: caixas.situacao })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('caixas')
        .select({id_caixas:'id_caixas'}, {descricao:'descricao'}, {numero:'numero'}, {peso_caixa:'peso_caixa'}, {peso_suportavel:'peso_suportavel'}, 
                {tamanho:'tamanho'}, {altura:'altura'}, {largura:'largura'}, {comprimento:'comprimento'}, {cm3:'cm3'}, {perc_ocupacao:'perc_ocupacao'},
                {cm3_ocupacao:'cm3_ocupacao'}, {situacao:'situacao'})
        .then(caixas => res.json(caixas))
        .catch(err => res.status(500).send(err))
    }
    
    const consultarId = async (req, res) => {
        const pickingCaixas = await
        app.bd('caixas')
        .select({id_caixas:'id_caixas'})
        .where({ id_caixas: req.params.id_caixas })

        try {
            existeOuErro(pickingCaixas, 'Caixa inexistente!')
        }
        catch(msg) {
            res.status(400).send(msg)
        }

        app.bd('caixas')
        .select({id_caixas:'id_caixas'}, {descricao:'descricao'}, {numero:'numero'}, {peso_caixa:'peso_caixa'}, {peso_suportavel:'peso_suportavel'}, 
                {tamanho:'tamanho'}, {altura:'altura'}, {largura:'largura'}, {comprimento:'comprimento'}, {cm3:'cm3'}, {perc_ocupacao:'perc_ocupacao'},
                {cm3_ocupacao:'cm3_ocupacao'}, {situacao:'situacao'})
        .where({ id_caixas: req.params.id_caixas})
        .first()
        .then(caixas => res.json(caixas))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivo = async (req, res) => {
        app.bd('caixas')
        .select({id_caixas:'id_caixas'}, {descricao:'descricao'}, {numero:'numero'}, {situacao:'situacao'})
        .where({ id_caixas: req.params.id_caixas })
        .orderBy('numero')
        .then(caixas => res.json(caixas))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('caixas')
            .update({ situacao: "Inativo" })
            .where({ id_caixas: req.params.id_caixas })
            existeOuErro(linhaDesativada, 'Caixa inexistente!')
            res.status(200).send('Caixa desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

    return { salvar, consultar, consultarId, consultarAtivo, excluir }
}