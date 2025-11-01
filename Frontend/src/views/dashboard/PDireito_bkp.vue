<template>
    <div id="base-page" >

		<div class="centerx">
			
			<div class="vx-row">

				<div class="vx-col w-1/6">

					<vx-card class="rounded-lg text-sm sm:mt-0 mt-1">

						<div class="items-center">
              <vx-tooltip text="VOLTAR AO SISTEMA" position="bottom" color="primary">
							<img src="@/assets/images/logo/logo-full.png" @click="home" width=100% class="cursor-pointer img-fluid sm:mt-2 mb-2 ">
              </vx-tooltip>
						</div>
						<div class="text-center">
							<small class="text-sm font-bold">{{ 'NÚMERO DA ONDA' }}</small>
							<div></div>
							<small class="text-xl text-primary font-bold" >{{ '00000' }}</small>
							<div class="sm:mt-2 text-sm " id="data-hora"></div>
						</div>
						
					</vx-card>

				</div>

				<div class="vx-col w-1/6 mb-1" v-show="dados !== []" v-for="item in filterDados" :key="item.id">
					
					<vx-card class="rounded-lg w-36 text-sm sm:mt-0 mt-1">

						<div class="flex flex-wrap items-center">
							<h4 class="text-lg text-primary flex flex-wrap font-medium sm:mt-0">{{ item.rampa.toUpperCase() }}</h4>
						</div>
            <div class="text-right">
							<small >{{ 'ONDA' + ' : ' }}</small>
							<small class="text-primary" >{{ '00000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'CAIXAS PREVISTAS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ item.caixas.toUpperCase() }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'PALLETS PREVISTOS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ item.pallets.toUpperCase() }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'EVOLUÇÃO' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ item.evolucao.toUpperCase() + ' %' }}</small>
						</div>
						<div class="text-left">
							<small >{{ 'Hora Último' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ item.hora.toUpperCase() }}</small>
						</div>
						<div class="text-left">
							<small class="text-primary" >{{ item.cod_prod.toUpperCase() + ' - ' }}</small>
							<small class="text-primary" >{{ item.nome_prod }}</small>
						</div>

					</vx-card>

				</div>

        <div class="vx-col w-1/6">

					<vx-card class="rounded-lg w-36 bg-green text-sm sm:mt-0 mt-1">

						<div class="flex flex-wrap items-center">
							<h4 class="text-lg text-primary flex flex-wrap font-medium sm:mt-0">{{ "BICA: 21 (CT29)" }}</h4>
						</div>
            <div class="text-right">
							<small >{{ 'ONDA' + ' : ' }}</small>
							<small class="text-primary" >{{ '00000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'CAIXAS PREVISTAS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '0000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'PALLETS PREVISTOS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '0000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'EVOLUÇÃO' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '100 %' }}</small>
						</div>
						<div class="text-left">
							<small >{{ 'Hora Último' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '14:18:29'}}</small>
						</div>
						<div class="text-left">
							<small class="text-primary" >{{ '0000 - ' }}</small>
							<small class="text-primary" >{{ 'Produto 1234567890123' }}</small>
						</div>

					</vx-card>

				</div>

        <div class="vx-col w-1/6">

					<vx-card class="rounded-lg w-36 bg-yellon text-sm sm:mt-0 mt-1">

						<div class="flex flex-wrap items-center">
							<h4 class="text-lg text-primary flex flex-wrap font-medium sm:mt-0">{{ "BICA: 22 (CT29)" }}</h4>
						</div>
            <div class="text-right">
							<small >{{ 'ONDA' + ' : ' }}</small>
							<small class="text-primary" >{{ '00000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'CAIXAS PREVISTAS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '0000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'PALLETS PREVISTOS' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '0000' }}</small>
						</div>
						<div class="text-right">
							<small >{{ 'EVOLUÇÃO' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '40 %' }}</small>
						</div>
						<div class="text-left">
							<small >{{ 'Hora Último' + ' : ' }}</small>
							<small class="text-lg text-primary" >{{ '14:18:29'}}</small>
						</div>
						<div class="text-left">
							<small class="text-primary" >{{ '0000 - ' }}</small>
							<small class="text-primary" >{{ 'Produto 1234567890123' }}</small>
						</div>

					</vx-card>

				</div>

				<div class="vx-col w-1/6">

					<vx-card class="rounded-lg w-36 bg-red text-sm sm:mt-0 mt-1">

						<div class="flex flex-wrap items-center">
							<vs-avatar size="25px" class="text-xl font-bold" text-color=black color=dark text="REJEITO"/>
							<h4 class="text-lg text-primary flex flex-wrap font-medium sm:mt-0">REJEITO</h4>
						</div>
						<div class="text-right">
							<small class="text-primary" >{{ 'CAIXAS' + ' : ' }}</small>
							<small class="text-lg" >00000</small>
						</div>
						<div class="text-right">
							<small class="text-primary" >{{ 'REJEITOS' + ' : ' }}</small>
							<small class="text-lg" >23 %</small>
						</div>
						<div class="text-left mt-6">
							<small class="text-primary">{{ 'Hora Último' + ' : ' }}</small>
							<small class="text-lg" >15:49:15</small>
						</div>
						<div class="text-left">
							<small>0000 - </small>
							<small>Produto X</small>
						</div>

					</vx-card>

				</div>

			</div>
				
		</div>

    </div>

</template>

<script>

const zeroFill = n => {
	return ('0' + n).slice(-2)
}

setInterval(() => {
	const now = new Date()
	const dataHora = zeroFill(now.getUTCDate()) + '/' + zeroFill((now.getMonth() + 1)) + '/' + now.getFullYear() + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds())
	document.getElementById('data-hora').innerHTML = dataHora
  document.documentElement.requestFullscreen()
}, 1000)

export default{
    data() {
        return {
            dadosQuery: '',
            dados: [
                {
                  id          : 1,
                  avatar      : 'R1',
                  rampa       : 'Bica: 1 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 2,
                  avatar      : 'R2',
                  rampa       : 'Bica: 2 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 3,
                  avatar      : 'R3',
                  rampa       : 'Bica: 3 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 4,
                  avatar      : 'R4',
                  rampa       : 'Bica: 4 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 5,
                  avatar      : 'R5',
                  rampa       : 'Bica: 5 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 6,
                  avatar      : 'R6',
                  rampa       : 'Bica: 6 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                                {
                  id          : 7,
                  avatar      : 'R7',
                  rampa       : 'Bica: 7 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 8,
                  avatar      : 'R8',
                  rampa       : 'Bica: 8 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 9,
                  avatar      : 'R9',
                  rampa       : 'Bica: 9 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 10,
                  avatar      : 'R10',
                  rampa       : 'Bica: 10 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 11,
                  avatar      : 'R11',
                  rampa       : 'Bica: 11 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 12,
                  avatar      : 'R12',
                  rampa       : 'Bica: 12 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                                {
                  id          : 13,
                  avatar      : 'R13',
                  rampa       : 'Bica: 13 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 14,
                  avatar      : 'R14',
                  rampa       : 'Bica: 14 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 15,
                  avatar      : 'R15',
                  rampa       : 'Bica: 15 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 16,
                  avatar      : 'R16',
                  rampa       : 'Bica: 16 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 17,
                  avatar      : 'R17',
                  rampa       : 'Bica: 17 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 18,
                  avatar      : 'R18',
                  rampa       : 'Bica: 18 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                                {
                  id          : 19,
                  avatar      : 'R19',
                  rampa       : 'Bica: 19 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
                {
                  id          : 20,
                  avatar      : 'R20',
                  rampa       : 'Bica: 20 (CT14)',
                  caixas      : '0000',
                  pallets     : '0000',
                  evolucao    : '0',
                  hora        : '14:18:29',
                  cod_prod    : '0000',
                  nome_prod   : 'Produto 1234567890123'
                },
            ]
        }
    },
    computed: {
        filterDados() {
            return this.dados.filter((item) => item.rampa.toLowerCase().includes(this.dadosQuery.toLowerCase()))
        }
    },
    methods: {
      home() {
          this.$router.push('/home').catch(() => {})
          document.exitFullscreen()
        },
    },
    components: {}
}
</script>

<style lang="scss">

</style>
