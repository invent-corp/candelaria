const { autorizacaoSecreta } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const login = async (req, res) => {
        if (!req.body.login || !req.body.senha) {
            return res.status(403).send('Informe Login e Senha!')
        }

        const usuario = await app.bd('usuario')
        .where({ login: req.body.login })
        .first()
            
        var config = await app.bd('config')
        .select('sorter', 'ptl', 'picking', 'coletor')
        .where({ id_config: "1" })
        .first()

        if (!usuario) {
            return res.status(400).send('Usuário não encontrado!') 
        } else {
            var usuarioAcesso = await app.bd('usuario', 'acesso')
            .select('usuario.id_usuario', 'usuario.login', {acesso: 'acesso.codigo'})
            .innerJoin('usuario_grupo', 'usuario.id_usuario', 'usuario_grupo.id_usuario')
            .innerJoin('grupo', 'usuario_grupo.id_grupo', 'grupo.id_grupo')
            .innerJoin('grupo_acesso', 'grupo.id_grupo', 'grupo_acesso.id_grupo')
            .innerJoin('acesso', 'grupo_acesso.id_acesso', 'acesso.id_acesso')
            .where({ 'usuario.id_usuario': usuario.id_usuario })
            .orderBy('usuario.login', 'acesso.codigo', 'asc')
        }

        if (usuario.situacao == "Inativo")
        return res.status(401).send('Usuário Inativo!')

        const compare = bcrypt.compareSync(req.body.senha, usuario.senha)
        if (!compare)
        return res.status(402).send('Senha inválida!')

        const dataAtual = Math.floor(Date.now() / 1000)
      
        var consultaAcesso = ""
        for (var i in usuarioAcesso) {
            consultaAcesso += (usuarioAcesso[i].acesso + ",")
        }

        const acessosPermitidos = consultaAcesso.split(",")
        acessosPermitidos.pop()

        const carga = {
            userRole: acessosPermitidos,
            uid: usuario.id_usuario,
            displayName: usuario.nome,
            situacao: usuario.situacao,
            admin: usuario.admin,
            temaPadrao: usuario.tema_padrao,
            fullscreen: usuario.fullscreen,
            sorter: config.sorter,
            ptl: config.ptl,
            picking: config.picking,
            coletor: config.coletor,
            iat: dataAtual,
            exp: dataAtual + (60 * 60 * 24 * 3)
        }

        res.json({
            ...carga,
            token: jwt.encode(carga, autorizacaoSecreta)
        })
    }

    const loginliberaconferencia = async (req, res) => {
        if (!req.body.login || !req.body.senha) {
            return res.status(403).send('Informe Login e Senha!')
        }

        const usuario = await app.bd('usuario')
        .where({ login: req.body.login })
        .first()
            
        if (!usuario) {
            return res.status(400).send('Usuário não encontrado!') 
        } else {
            var usuarioAcesso = await app.bd('usuario')
            .select('usuario.id_usuario', 'usuario.login')
            .where({ 'usuario.id_usuario': usuario.id_usuario })
            .orderBy('usuario.login', 'asc')
        }

        if (usuario.situacao == "Inativo")
        return res.status(401).send('Usuário Inativo!')

        const compare = bcrypt.compareSync(req.body.senha, usuario.senha)
        if (!compare)
        return res.status(402).send('Senha inválida!')

        res.json(usuario)
    }
    
    const validarToken = async (req, res) => {
        const usuarioData = req.body || null
        try {
            if(usuarioData) {
                const token = jwt.decode(usuarioData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        }
        catch(e) {
            // problema com o token
        }

        res.send(false)
    }

    return { login, validarToken, loginliberaconferencia }
}