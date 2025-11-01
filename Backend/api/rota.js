module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)
    
    const { existeOuErro } = app.api.validacao

    const salvar = (req, res) => {
        const rota = { ...req.body }
        if(req.params.id_rota) rota.id_rota = req.params.id_rota

        if(rota.id_rota) {
            app.bd('rota')
            .update({ codigo: rota.codigo, descricao: rota.descricao, cod_inicial: rota.cod_inicial, cod_final: rota.cod_final, situacao: rota.situacao })
            .where({ id_rota: rota.id_rota })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        } else {
            app.bd('rota')
            .insert(rota)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }
    }

    const consultar = async (req, res) => {
        app.bd('rota')
        .select('id_rota', 'descricao', 'codigo', 'cod_inicial', 'cod_final', 'situacao')
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const consultarId = (req, res) => {
        app.bd('rota')
        .select('id_rota', 'descricao', 'codigo', 'cod_inicial', 'cod_final', 'situacao')
        .where({ id_rota: req.params.id_rota})
        .first()
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivoSorter = async (req, res) => {
        app.bd('rota')
        .select('id_rota', 'descricao', 'codigo', 'cod_inicial', 'cod_final', 'situacao')
        .where({ situacao: 'Ativo' })
        .whereNotIn('id_rota', [
            app.bd('rota_sorter')
            .select('rota.id_rota')
            .innerJoin('sorter', 'rota_sorter.id_sorter', 'sorter.id_sorter')
            .innerJoin('rota', 'rota_sorter.id_rota', 'rota.id_rota')
            .where({ 'sorter.id_mapa_sorter': req.params.id_mapa_sorter })
        ])
        .orderBy('descricao')
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivoPtl = async (req, res) => {
        app.bd('rota')
        .select('id_rota', 'descricao', 'codigo', 'cod_inicial', 'cod_final', 'situacao')
        .where({ situacao: 'Ativo' })
        .whereNotIn('id_rota', [
            app.bd('rota_ptl')
            .select('rota.id_rota')
            .innerJoin('ptl', 'rota_ptl.id_ptl', 'ptl.id_ptl')
            .innerJoin('rota', 'rota_ptl.id_rota', 'rota.id_rota')
            .where({ 'ptl.id_mapa_ptl': req.params.id_mapa_ptl })
        ])
        .orderBy('descricao')
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const consultarAtivoPtm = async (req, res) => {
        app.bd('rota')
        .select('id_rota', 'descricao', 'codigo', 'cod_inicial', 'cod_final', 'situacao')
        .where({ situacao: 'Ativo' })
        .whereNotIn('id_rota', [
            app.bd('rota_ptm')
            .select('rota.id_rota')
            .innerJoin('ptm', 'rota_ptm.id_ptm', 'ptm.id_ptm')
            .innerJoin('rota', 'rota_ptm.id_rota', 'rota.id_rota')
            .where({ 'ptm.id_mapa_ptm': req.params.id_mapa_ptm })
        ])
        .orderBy('descricao')
        .then(rota => res.json(rota))
        .catch(err => res.status(500).send(err))
    }

    const excluir = async (req, res) => {
        try {
            const linhaDesativada = await app.bd('rota')
            .update({ situacao: "Inativo" })
            .where({ id_rota: req.params.id_rota })
            existeOuErro(linhaDesativada, 'Rota inexistente!')
            res.status(200).send('Rota desativada com Sucesso!')
        }
        catch(msg) {
            res.status(400).send(msg)
        } 
    }

   return { salvar, consultar, consultarId, consultarAtivoSorter, consultarAtivoPtl, excluir, consultarAtivoPtm }
}