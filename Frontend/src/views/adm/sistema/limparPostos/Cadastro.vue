<template>

	<div id="page-user-list">

          <div class="vx-card p-6">

               <div class="flex flex-wrap items-center">

                    <div>

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ postos.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : postos.length }} of {{ postos.length }}</span>
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

                    <vs-button class="mr-3 h-10 w-10" icon-pack="feather" icon="icon-search"
                         @click="localizar" ></vs-button>
					
					<vs-button class="mr-3 h-10" icon-pack="feather" @click="confirmarLimpeza" icon="icon-refresh-cw">Limpar Postos</vs-button>

                    <div class="flex-grow"/> 

                    <vs-input icon-pack="feather" icon="icon-search" class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar..." />

               </div>
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 370px"
                    onFirstDataRendered={onFirstDataRendered}
                    :overlayNoRowsTemplate="msgGrid"

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="postos"
                    :animateRows="true"
                    :pagination="true"
                    :suppressPaginationPanel="true"
					@grid-ready="onGridReady"
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
	import { AgGridVue } from "ag-grid-vue"
	import vSelect from 'vue-select'
	import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

	import CellRendererLink from "../limparPostos/cell-renderer/CellRendererLink.vue"
	import CellRendererStatus from "../limparPostos/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../limparPostos/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../limparPostos/cell-renderer/CellRendererActions.vue"


	export default {
		data() {
			return {
				ondas: null,
				postos: [],
                msgGrid: '',
				gridApi: null,
				searchQuery: "",
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
			CellRendererLink,
			CellRendererStatus,
			CellRendererVerified,
			CellRendererActions,
          },
		beforeMount() {
			this.gridOptions = {}
			this.columnDefs = [
				{
				headerName: 'ID',
				field: 'id_posto',
			//	minWidth: 200,
				filter: true,
				cellRendererFramework: 'CellRendererLink',
				},
				{
				headerName: 'Posto',
				field: 'descricao',
				filter: true,				
				},
				{
				headerName: 'Status',
				field: 'status',
				filter: true,				
				},
				{
				headerName: 'Numero Caixa',
				field: 'numero_caixa',
				filter: true,               
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
			localizar() {
				axios.get(`${backendUrl}/limparpostos/`)
				.then(res => {this.postos = res.data
				})
			},

			confirmarLimpeza() {
				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar`,
				text: `Deseja realizar a limpeza dos Postos ?`,
				accept: this.limparPostos,
				acceptText: "OK", 
				})
			},

			limparPostos() {
				axios.get(`${backendUrl}/limpartodospostos/`)
				.then(res => {
					this.postoslimpos = res.data
					this.$vs.notify({
						icon: "check",
						color: 'success',
						title: 'Limpar Postos',
						text: 'Postos limpados com SUCESSO'
					})		
					this.localizar();
				})
				.catch(err => { 
					console.error(err) 
					this.showCatchError()
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
                    if (this.$acl.check('62') || this.$acl.check('63')) {
                         this.gridColumnApi.setColumnVisible('acoes', true)
                    } else {
                         this.gridColumnApi.setColumnVisible('acoes', false)
                    }
			},
			updateSearchQuery(val) {
				this.gridApi.setQuickFilter(val)
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},

			showCatchError() {
				this.$vs.notify({
					icon: 'close',
					color: 'danger',
					title: 'ERRO na Atualização',
					text: 'Atualização NÃO Realizada!'
				})
			},			

		},
		mounted() {
			this.localizar()
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
