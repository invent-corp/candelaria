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
					<div class="sm:mt-4 text-center">
						<small class="text-sm font-bold">{{ 'NÚMERO DA ONDA' }}</small>
					<div></div>
					<h4 class="text-regular text-primary font-bold" >{{ dados[0].onda }}</h4>
					<div class="sm:mt-1 text-sm" id="data-hora"></div>
					<div class="sm:mt-1 text-xl" id="data-reloaddireito"></div>
					</div>

				</vx-card>

			</div>

			<div class="vx-col w-1/6 mb-1" v-for="item in filterDados" :key="item.centro_destino">

				<vx-card :id="item.centro_destino + 'CA'" ripple hover class="rounded-lg w-36 text-md sm:mt-0 mt-0">

					<spam :id="item.centro_destino + 'CT'" class="text-little font-bold">{{ item.centro_destino + ' ' }}</spam>

					<div class="sm:mt-1 text-center">
						<small class="text-sm">{{ 'PALLET' }}</small>
					</div>
					<h4 :id="item.centro_destino + 'PR'" class="text-center text-dash font-bold">{{ item.qtde_pallet}}</h4>
					<div class="sm:mt-1 text-center">
						<small class="text-sm">{{ 'SORTER' }}</small>
					</div>
					<h4 :id="item.centro_destino + 'LI'" class="text-center text-dash font-bold" >{{ item.qtde_sorter }}</h4>
					
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

//	reload = reload-1
//	document.getElementById('data-reload').innerHTML = 'Próx. Atual. em: '+reload+' sec.'
	
}, 1000)


export default{
    data() {
        return {
            dadosQuery: '',
			dados: null,
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
			axios.get(`${backendUrl}/dashdireitofaltabipar/`)
			.then(res => {this.dados = res.data
				if (this.dados == '') {
					this.dados = [{
						onda			: '0',
						centro_destino	: '0',
						qtde_pallet 	: '0',
						qtde_sorter   	: '0'
					}]
				}
			})
			clearInterval(this.intervalo_direito)
			let reload = 60
		//	reload = 60
			this.intervalo_direito = setInterval(() => {
				reload--
				document.getElementById('data-reloaddireito').innerHTML = 'Próx. Atual. em: '+reload+' sec.'
			}, 1000)
			document.documentElement.requestFullscreen()
			setTimeout(() => {
			this.colors()
			}, 3000)
		},
		colors() {
			for (var i in this.dados) {

				var card = this.dados[i].centro_destino + 'CA'
				var ct = this.dados[i].centro_destino + 'CT'
				var qtde_pallet = this.dados[i].centro_destino + 'PR'
				var qtde_sorter = this.dados[i].centro_destino + 'LI'

				document.getElementById(card).style.background = "#FF0000"

				document.getElementById(ct).style.color = "#ffffff"
				document.getElementById(qtde_pallet).style.color = "#ffffff"
				document.getElementById(qtde_sorter).style.color = "#ffffff"
			}
		}
    },
    mounted() {
		this.loadData()
		this.interval_dados = setInterval(() => {
			this.loadData()
		}, 60000)
		this.colors()
	},
	destroyed() {
		clearInterval(this.interval_dados)
		clearInterval(this.intervalo_direito)
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
