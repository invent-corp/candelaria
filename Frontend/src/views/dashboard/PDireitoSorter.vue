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
					<div class="sm:mt-6 text-center">
						<small class="text-sm font-bold">{{ 'NÚMERO DA ONDA' }}</small>
					<div></div>
					<h4 class="text-regular text-primary font-bold" >{{ dados[0].onda }}</h4>
					<div class="sm:mt-4 text-sm" id="data-hora"></div>
					</div>

				</vx-card>

			</div>

			<div class="vx-col w-1/6 mb-1" v-for="item in filterDados" :key="item.centro_destino">

				<vx-card :id="item.centro_destino + 'CA'" ripple hover class="rounded-lg w-36 text-md sm:mt-0 mt-0">

					<spam :id="item.centro_destino + 'CT'" class="text-medium font-bold">{{ item.centro_destino + ' ' }}</spam>
					<spam :id="item.centro_destino + 'PE'" class="text-regular font-bold" >{{ item.percentual + '%' }}</spam>

					<h4 :id="item.centro_destino + 'PR'" class="text-center text-dash font-bold">{{ item.qtde_prevista }}</h4>
					<h4 :id="item.centro_destino + 'LI'" class="text-center text-dash font-bold" >{{ item.qtde_tratada }}</h4>
					
					<small :id="item.centro_destino + 'UP'" class="text-left font-bold" >{{ 'Rampa' }}</small>
				</vx-card>

			</div>

			<div class="vx-col w-1/6 mb-1" v-show="rejeitos !== []">

				<vx-card id="RCA" class="rounded-lg w-36 text-md sm:mt-0 mt-0">

					<spam class="text-medium font-bold">{{ 'REJEITOS' }}</spam>

					<h4 id="RLI" class="text-center text-dash font-bold" >{{ rejeitos[0].qtde_lida }}</h4>
					<h4 id="RPE" class="text-center text-dash font-bold">{{ rejeitos[0].percentual + '%' }}</h4>

					<small class="text-left font-bold" >{{ 'Rampa' }}</small>

				</vx-card>

			</div>

		</div>

	</div>

</div>

</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'

const zeroFill = n => {
	return ('0' + n).slice(-2)
}

setInterval(() => {
	const now = new Date()
	const dataHora = zeroFill(now.getUTCDate()) + '/' + zeroFill((now.getMonth() + 1)) + '/' + now.getFullYear() + ' ' + zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds())
	document.getElementById('data-hora').innerHTML = dataHora
    
}, 1000)

export default{
    data() {
        return {
            dadosQuery: '',
			rejeitosQuery: '',
			dados: null,
			rejeitos: null,
        }
    },
    computed: {
        filterDados() {
            return this.dados.filter((item) => item.centro_destino.includes(this.dadosQuery))
        },
    },
    methods: {
		home() {
			this.$router.push('/home').catch(() => {})
			document.exitFullscreen()        
		},
		loadData() {
			axios.get(`${backendUrl}/dashdireitoSorter/`)
			.then(res => {this.dados = res.data
				if (this.dados == '') {
					this.dados = [{
						onda			: '0',
						centro_destino	: '0',
						percentual   	: '0',
						qtde_prevista 	: '0',
						qtde_tratada   	: '0'
					}]
				}
			})
			axios.get(`${backendUrl}/dashrejeitosSorter/`)
			.then(res => {this.rejeitos = res.data
				if (this.rejeitos == '') {
					this.rejeitos = [{
						qtde_lida		: '0',
						percentual   	: '0.00'
					}]
				}
			})
			document.documentElement.requestFullscreen()
			setTimeout(() => {
			this.colors()
			}, 30000)
		},
		colors() {
			for (var i in this.dados) {

				var card = this.dados[i].centro_destino + 'CA'
				var ct = this.dados[i].centro_destino + 'CT'
				var percentual = this.dados[i].centro_destino + 'PE'
				var qtde_prevista = this.dados[i].centro_destino + 'PR'
				var qtde_tratada = this.dados[i].centro_destino + 'LI'
				var ultimo_produto = this.dados[i].centro_destino + 'UP'

				document.getElementById(percentual).style.color = "#FFFF00"
				document.getElementById(qtde_tratada).style.color = "#FFFF00"
				document.getElementById('RCA').style.background = ""

				if (parseInt(document.getElementById(qtde_tratada).textContent) > 0 && parseInt(document.getElementById(qtde_tratada).textContent) != parseInt(document.getElementById(qtde_prevista).textContent)){
					document.getElementById(card).style.background = "#FFFF00"

					document.getElementById(ct).style.color = "#191919"
					document.getElementById(percentual).style.color = "#FF0000"
					document.getElementById(qtde_prevista).style.color = "#191919"
					document.getElementById(qtde_tratada).style.color = "#FF0000"
					document.getElementById(ultimo_produto).style.color = "#191919"
				}
				if (parseInt(document.getElementById(percentual).textContent) > 0 && parseInt(document.getElementById(qtde_tratada).textContent) == parseInt(document.getElementById(qtde_prevista).textContent)){
					document.getElementById(card).style.background = "#008000"

					document.getElementById(ct).style.color = ""
					document.getElementById(qtde_prevista).style.color = ""
					document.getElementById(ultimo_produto).style.color = ""
				}
				if (parseInt(document.getElementById(percentual).textContent) == 0 && parseInt(document.getElementById(qtde_tratada).textContent) == 0 ){
					document.getElementById(card).style.background = ""
					
					document.getElementById(ct).style.color = ""
					document.getElementById(qtde_prevista).style.color = ""
					document.getElementById(ultimo_produto).style.color = ""
				}
				if (parseInt(document.getElementById('RLI').textContent) > 0){
					document.getElementById('RCA').style.background = "#FF0000"

				}  
			}
		}
    },
    mounted() {
		this.loadData()
		this.interval_dados = setInterval(() => {
			this.loadData()
		}, 180000)
		this.colors()
	},
	destroyed() {
		return clearInterval(this.interval_dados)
	},
	components: {}
}

</script>

<style lang="scss">
.vx-card {
	.vx-card__collapsible-content {
		.vx-card__body {
			padding: 0.5rem;
			img + .vx-card__title > h4 { margin-top: 0rem }
		}
	}
}

</style>
