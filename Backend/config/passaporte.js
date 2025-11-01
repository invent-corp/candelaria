const { autorizacaoSecreta } = require('../.env')
const passaporte = require('passport')
const passaporteJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passaporteJwt

module.exports = app => {
    const params = {
        secretOrKey: autorizacaoSecreta,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const estrategia = new Strategy(params, (carga, done) => {
        app.bd('usuario')
            .where({ id_usuario: carga.id_usuario })
            .first()
            .then(user => done(null, user ? { ...carga } : false))
            .catch(err => done(err, false))
    })

    passaporte.use(estrategia)

    return {
        authenticate: () => passaporte.authenticate('jwt', { session: false })
    }
}