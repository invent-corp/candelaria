<template>

	<div id="page-user-list">

          <div class="vx-card p-6">
			<vs-prompt title="Confirmar Liberação" class="export-options" @cancel="clearFields" @accept="loginConferencia" accept-text="Confirmar" cancel-text="Cancelar" @close="clearFields" :active.sync="exibirDialogo">
                <vs-input id="login" ref="login" v-model="usuario.login" placeholder="Usuario:" class="w-full" />
				<div class="mb-1"/>
                <vs-input type="password" v-model="usuario.senha" placeholder="Senha:" class="w-full" />
                <div class="flex p-2">
                </div>
            </vs-prompt>  

			<div class="botaoconferencia">
				<vs-button class="w-1/2 ml-auto mt-2" icon-pack="feather" @click="reiniciar" icon="icon-refresh-cw">Nova Conferência</vs-button>
				<vs-button class="w-1/2 ml-auto mt-2" icon-pack="feather" @click="solicitarConfirmacao" icon="icon-refresh-cw">Finalizar Conferência</vs-button>
			<!--	<vs-button class="w-1/2 ml-auto mt-2" icon-pack="feather" @click="reiniciar" icon="icon-hard-drive">Confirmar Conferência</vs-button> -->
				<div class="mb-1"/>
				<label class="mensagem_conferencia" style="color: #4f0101">{{ mensagem_conferencia }}</label>				
                <div class="mb-1"/>
				<label :class="{ 'piscando': mostrarMensagem }" style="color: #634d02">{{ mensagem }}</label>				
			</div>
			<div class="caixaconferencia">
                <vs-input id="etiqueta" @keyup.enter="localizar"  ref="etiqueta" size="large" v-validate="'required|numeric'" name="Etiqueta " class="w-full mb-10" icon-pack="feather" icon="icon-rss" label-placeholder="ETIQUETA" v-model="Etiqueta" :disabled="etiquetaDisabled" clearable></vs-input>
                <div class="text-primary" v-show="errors.has('Etiqueta ')">{{ errors.first('Etiqueta ') }}</div>
				<vs-input id="produto" @keyup.enter="gravarVolume" ref="produto"  size="large" v-validate="'required|numeric'" name="Produto " class="w-full" icon-pack="feather" icon="icon-rss" label-placeholder="PRODUTO" v-model="Produto" :disabled="produtoDisabled"></vs-input>
                <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Produto ')">{{ errors.first('Produto ') }}</div>
                <div class="mb-16"/>
			</div>

				<div class="gridconferencia">
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 370px"
                    onFirstDataRendered={onFirstDataRendered}
                    :overlayNoRowsTemplate="msgGrid"

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
					:getRowStyle="getRowStyle"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="conferencia"
                    :animateRows="true"
                    :pagination="true"
                    :suppressPaginationPanel="true"
					@grid-ready="onGridReady"
                    rowSelection="multiple"
                    colResizeDefault="shift"
                    paginationPageSize=6
                    >
               </ag-grid-vue>
				</div>

				<vs-pagination
               :total="totalPages"
               :max="7"
               v-model="currentPage" />

				<vs-button class="ml-auto mt-2" icon-pack="feather" @click="confirmReiniciar" icon="icon-refresh-cw">Reiniciar Conferência</vs-button>
          </div>
</div>
</template>

<style>
/* Aqui você pode adicionar estilos para o componente */
.caixaconferencia {
	margin-top: 0px;
	float: left;
	width: 50%;
  }
  
.botaoconferencia {
	margin-top: 10px;
	display: inline-block;
	width: 50%;
  }

  
.gridconferencia {
  float: left;
  width: 100%;
  margin-top: -40px;
}

.piscando {
  animation: piscar 1s linear infinite;
  font-size: 24px;
  margin-left: 30px;
  font-weight: bold;
}

.mensagem_conferencia {
  font-size: 30px;
  margin-left: 240px;
  font-weight: bold;
}

@keyframes piscar {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>

<script>

	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'
	import { AgGridVue } from "ag-grid-vue"
	import vSelect from 'vue-select'
	import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

	import CellRendererStatus from "../opRejeitados/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../opRejeitados/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../opRejeitados/cell-renderer/CellRendererActions.vue"

	var id = ""

	export default {
		data() {
			return {
				conferencia: [],
				conferenciaqtde: [],
				etiquetaDisabled: false,
				produtoDisabled: true,
                msgGrid: 'Escaneie o volume para exibir informações !',
				gridApi: null,
				searchQuery: "",
				id: "",
				defaultColDef: {
					sortable: true,
					resizable: true,
					suppressMenu: true,
				},
				exibirDialogo: false,
				usuario: {
					login: "",
					senha: ""
				},
				mensagem: '',
				mensagem_conferencia : '',
				franqueado : '',
				short : '',
				mostrarMensagem: false
			}
		},
		components: {
			AgGridVue,
			vSelect,
			CellRendererStatus,
			CellRendererVerified,
			CellRendererActions,
		},
		beforeMount() {
			this.gridOptions = {}
			this.getRowStyle = params => {
				console.log('teste')
				if (params.data.qtde_falta > 0 && Number(params.data.qtde_lida) < Number(params.data.qtde_separada) && 
				Number(params.data.qtde_lida) < Number(params.data.qtde_sku)) {
					return { background: "#4f0101" };
				}				
				if (params.data.concluido == 'S' && Number(params.data.qtde_lida) < Number(params.data.qtde_sku)) {
                    return { background: "#634d02" };
                }

	//			if (params.data.concluido == 'S' && params.data.qtde_lida == params.data.qtde_separada) {
  //                  return { background: "#634d02" };
//                }

				if (Number(params.data.qtde_lida) == Number(params.data.qtde_sku)) {
                    return { background: "#003d1b" };
                }
	//			if (params.data.qtde_lida > params.data.qtde_separada ||
	//				params.data.qtde_lida == params.data.qtde_sku) {
  //                  return { background: "#003d1b" };
//                }

               }               
			this.columnDefs = [
				{
				headerName: 'EAN',
				field: 'sku',
				filter: true,
				},
				{
				headerName: 'Descrição Produto',
				field: 'descricao_sku',
				filter: true,
				maxWidth: 450, 
				},
				{
				headerName: 'Qtde Conferida',
				field: 'qtde_lida',
				filter: true,				
				},
				{
				headerName: 'Qtde Separada',
				field: 'qtde_separada',
				filter: true,               
				},
				{
				headerName: 'Qtde Total',
				field: 'qtde_sku',
				filter: true,               
				},
				{
				headerName: 'Qtde Short',
				field: 'qtde_falta',
				filter: true,
				},
			]
		},
		computed: {
			paginationPageSize() {
				if(this.gridApi) return this.gridApi.paginationGetPageSize()
				else return 10
			},
			totalPages() {
				if(this.gridApi) return this.gridApi.paginationGetTotalPages()
				else return 0
			},
			currentPage: {
				get() {
					if(this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
					else return 1
				},
				set(val) {
					this.gridApi.paginationGoToPage(val - 1)
					this.Autosize()
				}
			}
		},
		methods: {
			solicitarConfirmacao() {
				axios.get(`${backendUrl}/opConferenciaQtde/${id}`)
						.then(res => {this.conferenciaqtde = res.data
				})

				if (this.conferenciaqtde[0].qtde < this.conferencia.length) {
					this.exibirDialogo = true;
					document.getElementById("login").focus();
				} else
				{
					this.finalizar()
				}
			},			

			loadData() {
				const inputEle = document.getElementById("etiqueta")
				inputEle.addEventListener('keydown', function(e){
					var key = e.key
					if (key == 'Enter') {
					id = this.value
					}
				})
			},
			localizar() {
				axios.get(`${backendUrl}/opConferencia/${id}`)
				.then(res => {this.conferencia = res.data
					if (this.conferencia.length > 0) {

						axios.get(`${backendUrl}/opConferenciaQtde/${id}`)
						.then(res => {this.conferenciaqtde = res.data
						})

						if (this.conferencia[0].data_finalizacao_conferencia == null) {
							this.mensagem_conferencia = 'NO READ';

							this.conferencia.forEach(item => {
							if (item.tipo_conferencia == 'SHORT') {
								this.mensagem_conferencia = 'SHORT';
								this.short = 'S';
							}
							if (item.tipo_conferencia == 'FRANQUEADO') {
								this.mensagem_conferencia = 'FRANQUEADO';
								this.franqueado = 'S';
							}
							if (item.qtde_separada == 0 || item.qtde_separada == null) {
								this.sempicking = 'S';
							}
							});

							if (this.short == 'S' && this.franqueado == 'S') {
								this.mensagem_conferencia = 'FRANQUEADO SHORT';
							}

							
							if (this.sempicking == 'S') {
								if (this.short != 'S' && this.franqueado != 'S') { 	
									this.mensagem_conferencia = 'FALTA PICKING';
								}
							}

							this.produtoDisabled = false;
							this.etiquetaDisabled = true;
							this.$nextTick(() => {
								document.getElementById("produto").focus();
							});
						} else {
							this.$vs.notify({
							icon: 'close',
							color: 'danger',
							title: 'ERRO',
							text: 'CAIXA JÁ CONFERIDA ANTERIORMENTE'
							}) 
							this.reiniciar()
						}
					} else {
						this.$refs.etiqueta.value = '';
						this.$refs.produto.value = '';
						this.Etiqueta = '';
						this.Produto = '';
						this.mensagem_conferencia = '';
						this.mostrarMensagemPiscando("Etiqueta não localizada para conferência!");
						this.msgGrid = "Etiqueta não localizada para conferência!"
					}					
				})
			},

			loginConferencia() {
			// Loading
			axios.post(`${backendUrl}/loginconferencia`, this.usuario)
			.then(res => {this.loginconferencia_ = res.data
				if (this.loginconferencia_.libera_conferencia == 'Sim') {
					this.usuario.login = ''
					this.usuario.senha = ''
					this.finalizar()
				} else
				{
					this.usuario.login = ''
					this.usuario.senha = ''
					this.$vs.notify({
						title: 'Erro',
						text: "Usuário sem permissão para liberar conferência!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
                })
                .catch(err => {
				if(err.message === "Request failed with status code 400") {
					this.$vs.notify({
						title: 'Erro',
						text: "Usuário não encontrado!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 401") {
					this.$vs.notify({
						title: 'Usuário Inativo',
						text: "Verifique com Administrador do Sistema!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 402") {
					this.$vs.notify({
						title: 'Senha inválida',
						text: "Verifique a Senha Digitada!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Request failed with status code 403") {
					this.$vs.notify({
						title: 'Login/Senha inválidos',
						text: "Informe Login e Senha!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				if(err.message === "Network Error") {
					this.$vs.notify({
						title: 'Backend / Banco de Dados',
						text: "Sem comunicação com Backend e/ou Banco de Dados!",
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}) 
				}
				this.usuario.login = ''
				this.usuario.senha = ''
			})		
		},


			gravarVolume() {
				const idusuario = this.$store.state.AppActiveUsuario.uid
				axios.get(`${backendUrl}/opConferenciaSalvar/${this.Produto}&${this.Etiqueta}&${idusuario}`)
				.then(res => {
					this.gravaconferencia = res.data
					this.mostrarMensagemPiscando(this.gravaconferencia.message);

/*					this.$vs.notify({
						icon: "check",
						color: 'success',
						title: 'Volume',
						text: this.gravaconferencia.message
					})		
*/					this.$refs.produto.value = '';
					this.Produto = '';
					this.localizar();
				})
				.catch(err => { 
					console.error(err) 
					this.showCatchError()
					this.$refs.produto.value = '';
					this.Produto = '';
					this.$nextTick(() => {
						document.getElementById("produto").focus();
					}); 
				})

			},

			reiniciarConferencia() {
				if (this.conferencia.length > 0) {
					axios.get(`${backendUrl}/opConferenciaReiniciar/${this.Etiqueta}`)
					.then(res => {
						this.mensagem_reiniciar = res.data.message

						this.$vs.notify({
							icon: "check",
							color: 'success',
							title: 'Conferência',
							text: this.mensagem_reiniciar
						})		
						this.reiniciar();
					})
					.catch(err => { 
						console.error(err) 
						this.showCatchError()
						this.reiniciar()
					})
				} else {
					this.$vs.notify({
							icon: 'close',
							color: 'danger',
							title: 'ERRO',
							text: 'CONFERÊNCIA NÃO INICIADA'
						}) 
				}

			},

			confirmFinalizar() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Conferência`,
				text: `Confirma finalização da conferência da caixa ?`,
				accept: this.finalizar,
				acceptText: "OK", 
				})
			},

			confirmReiniciar() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar`,
				text: `Deseja reiniciar a conferência da caixa ?`,
				accept: this.reiniciarConferencia,
				acceptText: "OK", 
				})
			},

			finalizar() {
				if (this.conferencia.length > 0) {
					const idusuario = this.$store.state.AppActiveUsuario.uid
					axios.get(`${backendUrl}/opConferenciaFinalizar/${idusuario}&${this.Etiqueta}`)
					.then(res => {
						this.resultado = res.data
						if (this.resultado.resultado == "CAIXA CONFERIDA COM SUCESSO") {
							this.showUpdateSuccess()
							this.reiniciar()
						} else {
							this.Etiqueta = "";
							this.loadData()
							this.$vs.notify({
								icon: 'close',
								color: 'danger',
								title: 'ERRO na Atualização',
								text: this.resultado.resultado
							}) 
						}
					})
					.catch(err => { 
						console.error(err) 
						this.showCatchError()
					})
				} else {
					this.$vs.notify({
						icon: 'close',
						color: 'danger',
						title: 'ERRO',
						text: 'CONFERÊNCIA NÃO INICIADA'
					}) 
				}

			},


			mostrarMensagemPiscando(mensagem) {
				this.mensagem = mensagem;
				this.mostrarMensagem = true;

				setTimeout(() => {
					this.mostrarMensagem = false;
					this.mensagem = '';
				}, 1500);

			},	


			reiniciar() {
				this.etiquetaDisabled = false;
				this.produtoDisabled = true;
				this.$refs.etiqueta.value = '';
				this.$refs.produto.value = '';
				this.Etiqueta = '';
				this.Produto = '';
				this.mensagem_conferencia = '';
				this.conferencia = [];
				this.$nextTick(() => {
					document.getElementById("etiqueta").focus();
				}); 
			},

			onGridReady() {
				if (this.conferencia == "") {
					this.msgGrid = "Aguardando leitura da etiqueta!"
				}
				
			},
			Autosize() {
				var allColumnIds = []
				this.gridApi = this.gridOptions.api
				this.gridColumnApi = this.gridOptions.columnApi
				this.gridColumnApi.getAllColumns().forEach(function (column) {
				allColumnIds.push(column.colId)
				})
				this.gridColumnApi.autoSizeColumns(allColumnIds)
			},
			updateSearchQuery(val) {
				this.gridApi.setQuickFilter(val)
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},

			showUpdateSuccess() {
				this.$vs.notify({
					icon: "check",
					color: 'success',
					title: 'Caixa Conferida',
					text: 'Caixa Conferida com Sucesso!'
				})
			},

			showEtiquetanaolocalizada() {
				this.$vs.notify({
					icon: 'close',
					color: 'danger',
					title: 'Etiqueta',
					text: 'Etiqueta não localizada para conferência!'
				})
			},
			showCatchError() {
				this.$vs.notify({
					icon: 'close',
					color: 'danger',
					title: 'ERRO na Atualização',
					text: 'Dados inseridos inválidos! Atualização NÃO Realizada!'
				})
			},			
		},
		mounted() {
			this.loadData()
            this.Autosize()
			this.exibirDialogo = false
			document.getElementById("etiqueta").focus()             
		},
		updated() {
			this.Autosize()       
		}
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
		}
	}
</style>
