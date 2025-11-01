<template>

	<div id="page-user-list">

          <div class="vx-card p-6">

               <div class="flex flex-wrap items-center">

				<v-select name="Tipo Etiqueta" class="w-full rounded-lg text-sm mt-4" v-model="etiquetaType" placeholder="Selecione" :options="['Abertura','Fechamento','Volume']"></v-select>
				<div class="flex-grow"/>
			</div>

				<div class="flex flex-wrap items-center">
				<vs-input id="sku" icon-pack="feather" icon="icon-rss" class="w-full rounded-lg text-sm  mt-4" v-model="id" placeholder="Etiqueta" />
                    <div class="flex-grow"/> 
				</div>

               
          </div>

          <div class="vx-card p-6">

			<div class="flex flex-wrap items-center justify-center h-full">

				<span :class="mensagemClass" :style="messageStyle">{{ mensagem }}</span>

			</div>
		</div>

          <div class="vx-card p-6">

			<div class="flex flex-wrap items-center justify-center h-full">

				<span :style="messageStyle">{{ mensagem_loja }}</span>

			</div>
		</div>

			<div class="vx-card p-6">

				<div class="flex flex-wrap items-center justify-center h-full">

					<span :style="messageStyle">{{ mensagem_endereco }}</span>

				</div>
			</div>



	</div>

</template>

<script>

	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'
	import vSelect from 'vue-select'
	import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

	import CellRendererStatus from "../opRejeitados/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../opRejeitados/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../opRejeitados/cell-renderer/CellRendererActions.vue"
	var id = ""
	export default {
		data() {
			return {
				mapa: null,
				ptm: [],
				mensagem_loja : '',
				mensagem_endereco: '',
				mensagem: '',
				id: "",
				pallet: '0',
				id_pallet : '0',
				etiquetaType: ''
			}
		},

        computed: {
            mensagemColor() {
                if (this.mensagem == 'Pallet finalizado com sucesso' || this.mensagem == 'Lido com Sucesso' || this.mensagem == 'Bipar Loja' || this.mensagem == 'Bipar Volumes' || this.mensagem === 'Pallet criado') {
					return '#03a903';  // Verde
                }
                // ... adicione condições para outras mensagens conforme necessário
                return '#a90303';  // cor padrão
            },
			mensagemClass() {
				if (this.mensagem === 'Lido com Sucesso' || this.mensagem === 'Pallet finalizado com sucesso') {
				return 'blinking';
				}
				return '';
			},
			messageStyle() {
				const screenWidth = window.innerWidth;
				let fontSize;
				if (screenWidth > 1024) {
					fontSize = '72px';
				} else if (screenWidth > 600) {
					fontSize = '48px';
				} else {
					fontSize = '24px';
				}

				return {
					fontSize: fontSize,
					color: this.mensagemColor, // Usa a computed property existente
					fontWeight: 'bold'
				};
			},			
					
        },

        watch: {
            etiquetaType() {
                this.limparVariaveis();
            }
        },		

		components: {
			vSelect,
			CellRendererStatus,
			CellRendererVerified,
			CellRendererActions,
		},
		methods: {
			loadData() {
				const inputEle = document.getElementById("sku");
				inputEle.addEventListener('keydown', (e) => {  // arrow function aqui
					var key = e.key;
					if (key == 'Enter') {
						id = e.target.value
						this.localizar();
					}
				});
				document.documentElement.requestFullscreen()
			},

            limparVariaveis() {
                this.mensagem_loja = '';
                this.mensagem_endereco = '';
                this.mensagem = '';
                this.id = "";
                this.pallet = '0';
                this.id_pallet = '0';
            },			

			localizar() {
				if (this.etiquetaType != '') {  
					const usuario = this.$store.state.AppActiveUsuario.uid
					axios.get(`${backendUrl}/opPTM/${id}&${this.pallet}&${this.etiquetaType}&${this.id_pallet}&${usuario}`)
					.then(res => {this.ptm = res.data
						if (this.ptm.resultado !== "") {
							this.mensagem_loja = this.ptm.loja
							this.mensagem_endereco = this.ptm.endereco
							this.mensagem = this.ptm.resultado
							if (this.mensagem == 'Bipar Loja') {
								this.pallet = this.ptm.num_pallet
								this.id_pallet = '0'
							}
							if (this.mensagem == 'Bipar Volumes') {
								this.id_pallet = this.ptm.num_id_pallet
								this.pallet = '0'
							}
							if (this.mensagem == 'Pallet criado') {
								this.pallet = '0'
								this.id_pallet = '0'
							}
							if (this.mensagem == 'Loja não selecionada') {
								this.pallet = '0'
								this.id_pallet = '0'	
							}
							if (this.ptm.resultado === "Lido com Sucesso") {
								this.mensagem = "Lido com Sucesso";
								setTimeout(() => {
									this.mensagem = '';
								}, 3000);
							}							
							if (this.ptm.resultado === "Pallet finalizado com sucesso") {
								this.mensagem = "Pallet finalizado com sucesso";
								setTimeout(() => {
									this.mensagem = '';
								}, 3000);
							}							
							this.id = ''
							console.log(this.pallet)
							console.log(this.id_pallet)
						} else {
							this.id = ''
						}	
					})
				}
				else
				{
					this.mensagem = 'Etiqueta inválida'
				}
			},
			

			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
		},
		mounted() {
			this.loadData()
            this.Autosize()
			document.getElementById("sku").focus()
		},
		updated() {
			this.Autosize()       
		},

	}

</script>

<style lang="scss">
	#page-user-list {
		.user-list-filters {
			.vs__actions {
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-58%);
			}
			.mensagem, .mensagem_loja, .mensagem_endereco {
				font-weight: bold;
				margin-left: 10px;

				@media (min-width: 1024px) {
					font-size: 72px;
				}

				@media (max-width: 1023px) {
					font-size: 48px;
				}

				@media (max-width: 600px) {
					font-size: 24px;
				}
			}				
		}
	}

	@keyframes blinker {
    50% {
      opacity: 0;
    }


  }

  .blinking {
    animation: blinker 1s linear infinite;
  }	
</style>
