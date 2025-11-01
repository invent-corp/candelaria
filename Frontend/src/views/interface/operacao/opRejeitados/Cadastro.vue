<template>

	<div id="page-user-list">

          <div class="vx-card p-6">

               <vs-prompt title="Exportar PDF" class="export-options" @cancel="clearFields" @accept="exportToPDF" accept-text="Exportar" cancel-text="Cancelar" @close="clearFields" :active.sync="activePromptPDF">
                    <vs-input v-model="fileNamePDF" placeholder="Insira o nome do arquivo..." class="w-full" />
                    <v-select v-model="selectedFormatPDF" :options="formatsPDF" class="my-4" />
                    <div class="flex p-2">
                    <span class="mr-4">Largura Auto Células:</span>
                    <vs-switch v-model="cellAutoWidthPDF"></vs-switch>
                    </div>
                    <div class="flex p-2">
                    <span class="mr-4">Retrato</span>
                    <vs-switch class="mr-4" v-model="pageOrientationPDF"></vs-switch>
                    <span class="mr-4">Paisagem</span>
                    </div>
               </vs-prompt>  

               <vs-prompt title="Exportar Excel" class="export-options" @cancel="clearFields" @accept="exportToExcel" accept-text="Exportar" cancel-text="Cancelar" @close="clearFields" :active.sync="activePromptExcel">
                    <vs-input v-model="fileNameExcel" placeholder="Insira o nome do arquivo..." class="w-full" />
                    <v-select v-model="selectedFormatExcel" :options="formatsExcel" class="my-4" />
                    <div class="flex">
                    <span class="mr-4">Largura Auto Células:</span>
                    <vs-switch v-model="cellAutoWidthExcel">Largura Auto Células</vs-switch>
                    </div>
               </vs-prompt>

               <div class="flex flex-wrap items-center">

                    <div class="">

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ rejeitados.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : rejeitados.length }} of {{ rejeitados.length }}</span>
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

                    <vs-input id="sku" @keyup.enter="localizar" icon-pack="feather" icon="icon-rss" class="sm:w-auto w-full rounded-lg text-sm sm:mt-0 mt-4" v-model="id" placeholder="Etiqueta" />
					<span style="color: #a99b03 ; font-weight: bold; font-size: 20px; margin-left: 10px;">{{ mensagem_conferencia }}</span>
                    <div class="flex-grow"/> 

                    <vs-input icon-pack="feather" icon="icon-search" class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar..." />

                    <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                         <div class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer flex items-end justify-center text-sm font-medium w-32">
                              <feather-icon icon="PrinterIcon" svgClasses="mr-2 h-5 w-5"/>
                              <feather-icon icon="SaveIcon" svgClasses="mr-2 h-5 w-5"/>
                              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
                         </div>

                         <vs-dropdown-menu class="sm:mt-1 h-4 w-32">
                              <vs-dropdown-item @click="activePromptPDF=true">
                                   <span class="flex items-center">
                                   <feather-icon icon="PrinterIcon" svgClasses="h-4 w-4" class="mr-2" />
                                   <span>Imprimir</span>
                                   </span>
                              </vs-dropdown-item>

                              <vs-dropdown-item @click="activePromptExcel=true">
                                   <span class="flex items-center">
                                   <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                                   <span>Exportar</span>
                                   </span>
                              </vs-dropdown-item>
                         </vs-dropdown-menu>

                    </vs-dropdown>

               </div>
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 370px"
                    onFirstDataRendered={onFirstDataRendered}
                    :overlayNoRowsTemplate="msgGrid"

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="rejeitados"
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
	import moment from 'moment'

	import CellRendererStatus from "../opRejeitados/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../opRejeitados/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../opRejeitados/cell-renderer/CellRendererActions.vue"

	import getDocDefinition from "@/components/pdf-export/docDefinition"
	var id = ""

	export default {
		data() {
			return {
				mapa: null,
				rejeitados: [],
                msgGrid: 'Escaneie o volume para exibir informações !',
				gridApi: null,
				searchQuery: "",
				mensagem_conferencia: '',
				id: "",
				defaultColDef: {
					sortable: true,
					resizable: true,
					suppressMenu: true,
				},
				//EXPORT Excel
				fileNameExcel: "",
				formatsExcel: ["xlsx", "xls", "csv", "txt"],
				cellAutoWidthExcel: true,
				selectedFormatExcel: "xlsx",
				activePromptExcel: false,
				headerTitle: ["Saída Prevista", "Destino", "Leitura","Estação Leitura"],
				headerVal: ["saida_prevista", "descricao", "data_leitura","estacao_leitura"],
				//EXPORT PDF
				fileNamePDF: "",
				formatsPDF:"pdf",
				cellAutoWidthPDF: true,
				pageOrientationPDF: true,
				selectedFormatPDF: "pdf",
				activePromptPDF: false,
				printParams: {
					PDF_HEADER_COLOR: "#ffc500",
					PDF_INNER_BORDER_COLOR: "#bbbbbb",
					PDF_OUTER_BORDER_COLOR: "#bbbbbb",
					PDF_LOGO: "logo-full.png",
					PDF_PAGE_NAME: "Operação | Rejeitados",
					PDF_PAGE_ORITENTATION: "landscape",
					PDF_WITH_HEADER_IMAGE: true,
					PDF_WITH_FOOTER_PAGE_COUNT: true,
					PDF_HEADER_HEIGHT: 15,
					PDF_ROW_HEIGHT: 'auto',
					PDF_ODD_BKG_COLOR: "#eeeeee",
					PDF_EVEN_BKG_COLOR: "#ffffff",
					PDF_WITH_CELL_FORMATTING: true,
					PDF_WITH_COLUMNS_AS_LINKS: true,
					PDF_SELECTED_ROWS_ONLY: true,
					PDF_WITH_COLUMNS: false
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
				headerName: 'Saída Prevista',
				field: 'saida_previsto',
				minWidth: 200,
				filter: true,
				checkboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				headerCheckboxSelection: true,
				},
				{
				headerName: 'Destino',
				field: 'descricao',
				filter: true,				
				},
				{
				headerName: 'Leitura',
				field: 'data_leitura',
				filter: true,
				},
				{
				headerName: 'Estação Leitura',
				field: 'estacao_leitura',
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
			loadData() {
				const inputEle = document.getElementById("sku")
				inputEle.addEventListener('keydown', function(e){
					var key = e.key
					if (key == 'Enter') {
					id = this.value
					}
				})
			},
			localizar() {
				axios.get(`${backendUrl}/opRejeitados/${id}`)
				.then(res => {this.rejeitados = res.data
					for (let i = 0; i < this.rejeitados.length ;i++) {
						if (this.rejeitados[i].data_leitura) {
						this.rejeitados[i].data_leitura = moment(this.rejeitados[i].data_leitura).format('DD/MM/YYYY HH:mm:ss') 
						}
					}
					this.localizarConferencia();
				})
				this.id = ''
				this.mensagem_conferencia = ''

			},

			localizarConferencia() {
				axios.get(`${backendUrl}/opRejeitadosFaltaConferencia/${id}`)
				.then(res => {this.faltaconferencia = res.data
					if (this.faltaconferencia[0].id_pedido_volume > 0) {
						this.mensagem_conferencia = 'CAIXA PENDENTE DE CONFERÊNCIA!'
						console.log(this.mensagem_conferencia)
					} else {
						this.mensagem_conferencia = ''
					}
				})
				this.id = ''
			},


			onGridReady() {
				if (this.rejeitados == "") {
					this.msgGrid = "Volume não possui Rejeitos!"
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
			// EXPORT EXCEL
			exportToExcel() {
				import('@/components/excel/Export2Excel').then(excel => {
					const list = this.gridApi.getSelectedRows()
					const data = this.formatJson(this.headerVal, list)
					if(this.fileNameExcel == '' || null) {
					this.fileNameExcel = 'Invent - Rejeitados'
					}
					excel.export_json_to_excel({
					header: this.headerTitle,
					data,
					filename: this.fileNameExcel,
					autoWidth: this.cellAutoWidthExcel,
					bookType: this.selectedFormatExcel
					})
					this.clearFieldsExcel()
					this.gridApi.deselectAll()
				})
			},
			exportToPDF() {
				var pdfMake = require('pdfmake/build/pdfmake.js')
				if ( pdfMake.vfs == undefined ) {
					var pdfFonts = require( 'pdfmake/build/vfs_fonts.js')
				pdfMake.vfs = pdfFonts.pdfMake.vfs
				}
				if(this.fileNamePDF == '' || null) {
					this.fileNamePDF = 'Invent - Rejeitados'
				}
				const printParams = this.$data.printParams
				printParams.PDF_WITH_COLUMNS = this.cellAutoWidthPDF
				printParams.PDF_PAGE_ORITENTATION = this.pageOrientationPDF
				const docDefinition = getDocDefinition(printParams, this.gridApi, this.gridColumnApi)
				pdfMake.createPdf(docDefinition).download(this.fileNamePDF)
				this.clearFieldsPDF()
				this.gridApi.deselectAll()
			},
			formatJson(filterVal, jsonData) {
				return jsonData.map(v => filterVal.map(j => {
					return v[j]
				}))
			},
			clearFieldsPDF() {
				this.fileNamePDF = ""
				this.cellAutoWidth = true
				this.selectedFormat = "pdf"
			},
			clearFieldsExcel() {
				this.fileNameExcel = ""
				this.cellAutoWidth = true
				this.selectedFormat = "xlsx"
			},
		},
		mounted() {
			this.loadData()
            this.Autosize()
			document.getElementById("sku").focus()             
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
