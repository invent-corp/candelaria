module.exports = app => {

    const config = require('../knexfile.js')
    const knex = require('knex')(config)

    const consultar = async (req, res) => {
        app.bd('usuario', 'funcao', 'usuario_grupo', 'grupo', 'grupo_acesso', 'acesso' )
        .select('usuario.nome', {funcao: 'funcao.nome'}, {acesso: 'acesso.nome'}, {situacao: 'usuario.situacao'})
        .innerJoin('funcao', 'usuario.id_funcao', 'funcao.id_funcao')
        .innerJoin('usuario_grupo', 'usuario.id_usuario', 'usuario_grupo.id_usuario')
        .innerJoin('grupo', 'usuario_grupo.id_grupo', 'grupo.id_grupo')
        .innerJoin('grupo_acesso', 'grupo.id_grupo', 'grupo_acesso.id_grupo')
        .innerJoin('acesso', 'grupo_acesso.id_acesso', 'acesso.id_acesso')
        .where({'usuario.admin': 'Não'})
        .orderBy('usuario.nome')
        .then(acesso_usuario => res.json(acesso_usuario))
        .catch(err => res.status(500).send(err))
    }

    return { consultar }
}