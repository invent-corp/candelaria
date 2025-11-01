const { connect } = require('net')
const readline = require('readline')

const IP = '10.90.134.42'
const PORT = 4660

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const EMULAR_PUSH_BUTTON = Uint8Array.from([
  0x08,  //length
  0x00,  //length
  0x60,  // message type
  0x00, 0x00, 0x00, // reserved
  0x17, // command
  0x02 // endereco
])
const MOSTRAR_DADO_PARA_DISPLAY = Uint8Array.from([
  0x0F,
  0x00, //length
  0x60, // message type
  0x00, 0x00, 0x00, // reserved
  0x00, // command
  0xFC, // endereco
  0x00, 0x00, 0x00, 0x00, 0x01, 0x31, // mostrar no display
  0x00 // dot
])

const DESLIGAR_DADO_PARA_DISPLAY = Uint8Array.from([
  0x08,
  0x00, //length
  0x60, // message type
  0x00, 0x00, 0x00, // reserved
  0x01, // command
  0xFC, // endereco
])

let contador = 0

const client = connect({ port: PORT, host: IP })

client.on('connect', () => console.log('Conectado ao servidor!'))

function enviar() {
  client.write(MOSTRAR_DADO_PARA_DISPLAY)
  client.write(EMULAR_PUSH_BUTTON)
}

function waitForEnter() {
  return new Promise(resolve => {
    rl.question('\nPressione Enter para enviar os dados...\n\n', () => {
      console.time('Tempo de envio e recebimento')
      resolve()
      enviar()
    })
  })
}

client.on('data', () => {
  console.timeEnd('Tempo de envio e recebimento')
})

async function main() {
  let i = 0
  while (i <= 10) {
    await waitForEnter()
    i++
  }
  console.log('Fim do do envio de dados')
  client.write(DESLIGAR_DADO_PARA_DISPLAY)
  rl.close()
}

main()