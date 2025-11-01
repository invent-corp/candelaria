<template>

	<div id="page-user-list">

          <div class="vx-card p-6">

               <div class="flex flex-wrap items-center">

                    <div class="">

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ mapa.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : mapa.length }} of {{ mapa.length }}</span>
                                   <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                              </div>

                              <vs-dropdown-menu>
                                   <vs-dropdown-item @click="gridApi.paginationSetPageSize(10)">
                                        <span>10</span>
                                   </vs-dropdown-item>
                                   <vs-dropdown-item @click="gridApi.paginationSetPageSize(25)">
                                        <span>25</span>
                                   </vs-dropdown-item>
                                   <vs-dropdown-item @click="gridApi.paginationSetPageSize(50)">
                                        <span>50</span>
                                   </vs-dropdown-item>
                                   <vs-dropdown-item @click="gridApi.paginationSetPageSize(100)">
                                        <span>100</span>
                                   </vs-dropdown-item>
                              </vs-dropdown-menu>

                         </vs-dropdown>

                    </div>

                    <v-select class="mr-3 rounded-lg w-64 text-sm sm:mt-0 mt-4" placeholder="Selecionar Mapa" v-model="vMapa.id_mapa_ptl" :options=vMapa :reduce="mapa => mapa.id_mapa_ptl" :menu-props="{ top: true, offsetY: true }" label="nome" >> 
						<template #option="{ nome }">
							<h class="font-bold">{{ nome }}</h>
							<br />
						</template>
						<span slot="no-options">Não existem Mapas cadastrados!</span>
                    </v-select>
                    
                    <vs-button class="mr-3 h-10" icon-pack="feather" icon="icon-play"
                         @click="iniciarMapa" >Iniciar</vs-button>

                    <div class="flex-grow"/> 

               </div>
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 370px"
                    onFirstDataRendered={onFirstDataRendered}
                    overlayNoRowsTemplate='Nenhum Mapa Ptl iniciado !'

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="mapa"
                    :animateRows="true"
                    :pagination="true"
                    :suppressPaginationPanel="true"
                    rowSelection="multiple"
                    colResizeDefault="shift"
                    paginationPageSize=6
                    >
               </ag-grid-vue>

               <vs-pagination
               :total="totalPages"
               :max="7"
               v-model="currentPage" />

          </div>
	</div>

</template>

<script>

	import axios from 'axios'
	import { backendUrl } from '@/globalComponents'
	import { AgGridVue } from "ag-grid-vue";
	import vSelect from 'vue-select'
	import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

	import CellRendererStatus from "../opMapaPtl/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../opMapaPtl/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../opMapaPtl/cell-renderer/CellRendererActions.vue"

	export default {
		data() {
			return {
				mapa: null,
				vMapa: [],
				count: null,
				gridApi: null,
				defaultColDef: {
					sortable: true,
					resizable: true,
					suppressMenu: true,
				},
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
			this.columnDefs = [
				{
				headerName: 'Mapa Ptl',
				field: 'nome',
				minWidth: 400,
				filter: true,
				checkboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				headerCheckboxSelection: true,
				},
				{
				headerName: 'Status',
				field: 'operacao',
				filter: true,
				cellRendererFramework: 'CellRendererStatus',
				},
				{
				headerName: 'Ações',
				field: 'acoes',
				pinned: 'right',
				cellRendererFramework: 'CellRendererActions',
				pdfExportOptions: {
					skipColumn: true
				}
				}
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
			loadData() {
				axios.get(`${backendUrl}/opMapaPtl`)
				.then(res => {this.mapa = res.data
					for (let i = 0; i < this.mapa.length; i++) {
						this.mapa[i].operacao = 'Iniciado'
					}
				})
			},
			loadvMapaSorter() {
				axios.get(`${backendUrl}/opMapaPtlAtivo`)
				.then(res => {this.vMapa = res.data })
			},
			loadCount() {
				axios.get(`${backendUrl}/opMapaPtlcount`)
				.then(res => {this.count = res.data
				})
			},
			iniciarMapa() {
				if (this.count.qtde < 1) {
				const id = this.vMapa.id_mapa_ptl
				axios.put(`${backendUrl}/opMapaPtl/${id}`)
					.then(() => {
						this.showUpdateSuccess()
						this.$router.push(`/pages/refresh/`).catch(() => {})
					})
					.catch(() => { 
						this.$vs.notify({
						icon: "error",
						color: 'danger',
						title: 'ERRO',
						text: 'Selecione o Mapa para Iniciar !',
						})
					})
				} else {
					this.$vs.dialog({
					type: 'alert',
					color: 'danger',
					title: `Atenção`,
					text: `Qtde Máxima de Mapa ( 1 ) já iniciado !`,
					acceptText: "OK", 
				})
				}
			},
			showUpdateSuccess() {
				this.$vs.notify({
					icon: "check",
					color: 'success',
					title: 'Mapa Iniciado',
					text: 'Mapa Iniciado com Sucesso !',
				})
			},
			Autosize() {
				var allColumnIds = []
				this.gridApi = this.gridOptions.api
				this.gridColumnApi = this.gridOptions.columnApi
				this.gridColumnApi.getAllColumns().forEach(function (column) {
				allColumnIds.push(column.colId)
				})
				this.gridColumnApi.autoSizeColumns(allColumnIds)
				// ACESSO SISTEMA
				if (this.$acl.check('53')) {
						this.gridColumnApi.setColumnVisible('acoes', true)
				} else {
						this.gridColumnApi.setColumnVisible('acoes', false)
				}
			},
		},
		mounted() {
			this.loadData()
			this.loadvMapaSorter()
			this.loadCount()
			this.Autosize()              
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
