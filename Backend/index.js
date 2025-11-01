const app = require('express')()
const load = require('express-load')
const bd = require('./config/bd')
var colors = require('colors')

app.bd = bd

// Obtém a data/hora atual
var data = new Date()

// Guarda cada pedaço em uma variável
var dia     = data.getDate();           // 1-31
var mes     = data.getMonth();          // 0-11 (zero=janeiro)
var ano4    = data.getFullYear();       // 4 dígitos
var hora    = data.getHours();          // 0-23
var min     = data.getMinutes();        // 0-59
var seg     = data.getSeconds();        // 0-59

// Formata a data e a hora (note o mês + 1)
var str_data = dia + '/' + (mes+1) + '/' + ano4;
var str_hora = hora + ':' + min + ':' + seg;

load('./config/passaporte.js')
    .then('./config/middlewares.js')
    .then('./api/validacao.js')
    .then('./api')
    .then('./config/rotas.js')
    .into(app)
//producao
//app.listen(3000, () => {
//    console.log(('Backend Executando na Porta 3000 - ' + str_data + ' às ' + str_hora).cyan)
//})

//hml
app.listen(3001, () => {
    console.log(('Backend Executando na Porta 3001 - ' + str_data + ' às ' + str_hora).cyan)
})
