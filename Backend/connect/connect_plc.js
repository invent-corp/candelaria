const pg = require('pg')
var net = require('net')
var colors = require('colors')
const { Console } = require('console')

const sql = new pg.Pool({
    host: '127.0.0.1',
    database: 'postgres',
    user: 'postgres',
    password: 'Sysvent@2021',    
    port: 5432,
})

var i = 0 

config_PLC = []

sql.connect()
    .then(() => {
        return sql.query('select ip_plc, porta_plc_vol, porta_plc_log from config')})
    .then(result => { config_PLC = result.rows
        for (let dados_PLC of config_PLC) {

            var connected = false

            var HOST_PLC = dados_PLC.ip_plc
            var PORT_PLC = dados_PLC.porta_plc_vol   

            function connect_plc() {
                
                var PLC = new net.Socket()

                PLC.connect(PORT_PLC, HOST_PLC, function() {
                    if (connected == false) {
                        connected = true
                        console.log('CONEXÃO ESTABELECIDA '.brightGreen + 'com o '.grey + 'PLC'.white + ' > '.grey + HOST_PLC.cyan + ':' + PORT_PLC.cyan + '\n')
                        console.log(' >> '.brightGreen + 'Aguardando dados do PLC...'.grey + '\n')
                    } else {
                        console.log('RESTABELECIDA CONEXÃO '.yellow + 'com o '.grey + 'PLC'.white + ' > '.grey + HOST_PLC.cyan + ':' + PORT_PLC.cyan + '\n')
                        console.log(' >> '.brightGreen + 'Aguardando dados do PLC...'.grey + '\n')
                    }
                })

                PLC.on('data', function(data) {
                    
                    var dataAtual = new Date();
                    var dia       = dataAtual.getDate();           // 1-31
                    var mes       = dataAtual.getMonth();          // 0-11 (zero=janeiro)
                    var ano4      = dataAtual.getFullYear();       // 4 dígitos
                    var hora      = dataAtual.getHours();          // 0-23
                    var min       = dataAtual.getMinutes();        // 0-59
                    var seg       = dataAtual.getSeconds();        // 0-59
                    var mseg      = dataAtual.getMilliseconds();   // 0-999
                    var str_data  = dia + '/' + (mes+1) + '/' + ano4;
                    var str_hora  = hora + ':' + min + ':' + seg + '.' + mseg;

                    function procedure(data_sub) {
                        
                        sql.connect()
                        .then(client => {
                            // Stored procedure
                            return client.query(`SELECT resultado FROM public."SP_ENVIA_DESTINO_SORTER"('${data_sub}')`)
                            .then(result => { 
                                dados = result.rows[0].resultado
                                dados_novo = dados.toString().substr(0,99)

                                client.release()
                                var dataAtual = new Date();
                                var dia       = dataAtual.getDate();           // 1-31
                                var mes       = dataAtual.getMonth();          // 0-11 (zero=janeiro)
                                var ano4      = dataAtual.getFullYear();       // 4 dígitos
                                var hora      = dataAtual.getHours();          // 0-23
                                var min       = dataAtual.getMinutes();        // 0-59
                                var seg       = dataAtual.getSeconds();        // 0-59
                                var mseg      = dataAtual.getMilliseconds();   // 0-999
                                var str_data  = dia + '/' + (mes+1) + '/' + ano4;
                                var str_hora  = hora + ':' + min + ':' + seg + '.' + mseg;
    

                                if ((dados.toString().substr(0,5) != 'VAZIO')) {
                                    PLC.write (dados_novo + '\r' )
                                    sql.connect()
                                    .then(client => {
                                        // Stored procedure
                                        return client.query(`SELECT * from public."SP_GRAVA_MENSAGEM_DESTINO"('${dados}')`)
                                        .then(result => {
                                            client.release()
                                            console.log(' >> Dados Enviados ao '.brightMagenta + 'PLC '.white + (str_data).brightGreen + ' às '.brightGreen + (str_hora).brightGreen + ': '.grey + (HOST_PLC + ':' + PORT_PLC).cyan + ' -> ' + dados + '\n')
                                        })
                                    })
                                }  

                            })
                            .catch(err => {
                                client.release()
                                console.log('ERRO >> BANCO DE DADOS'.red + '\n')
                                console.log(err)
                            })
                        })
                        
                    }

                    var valor_padrao = 100
                    var tamanho = data.length
                    var qtde_strings = tamanho / valor_padrao
                    var data_sub = ''

                    if (tamanho >= valor_padrao ) {
                        for (var i = 0; i < qtde_strings; i++) {
                            if(i == 0){
                                var a = 0
                            } else {
                                var a = valor_padrao*i
                            }
                            data_sub = (data.toString().substr(a, valor_padrao))
                            console.log(' >> '.brightGreen + 'Dados Recebidos do '.brightGreen + 'PLC : '.white + (str_data).brightGreen + ' às '.brightGreen + (str_hora).brightGreen + ': '.brightGreen + data_sub + '\n')
                            procedure(data_sub)
                        }
                    }

                    setTimeout(() => {
                        console.log(' >> '.brightGreen + 'Aguardando dados do PLC...'.grey + '\n')
                    }, 200)
                })

                PLC.on('close', function() {
                    setTimeout(() => { 
                        connect_plc() 
                    }, 2000)
                })

                PLC.on('error', function() {
                    console.log('SEM CONEXÃO '.red + 'com o '.grey + 'PLC'.white + ' > '.grey + HOST_PLC.cyan + ':' + PORT_PLC.cyan)
                })
            }
            connect_plc()
        }
    })
    .catch(err => {
        console.log('ERRO >> BANCO DE DADOS'.red  + '\n')
        console.log(err)
    })