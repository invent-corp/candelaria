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

                    <div>

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ pallets.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : pallets.length }} of {{ pallets.length }}</span>
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

        
					<flat-pickr class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36" :config="configDataInicialDataPicker" v-model="DataInicial" placeholder="Data Inicial"/>
                    <flat-pickr class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36" :config="configDataFinalDataPicker" v-model="DataFinal" placeholder="Data Final"/>
		<!--
					<v-select class="mr-3 rounded-lg w-64 text-sm sm:mt-0 mt-4" placeholder="Selecionar Onda" v-model="ondas.onda" :options=ondas :reduce="ondas => ondas.onda" :menu-props="{ top: true, offsetY: true }" label="onda" >> 
						<template #option="{ onda }">
							<h class="font-bold">{{ onda }}</h>
						</template>
                    </v-select>
				-->		       
                    <vs-button class="mr-3 h-10 w-10" icon-pack="feather" icon="icon-search"
                         @click="localizar" ></vs-button>

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
                    :rowData="pallets"
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
    import flatPickr from 'vue-flatpickr-component'
    import {Portuguese as PortugueseLocale} from 'flatpickr/dist/l10n/pt.js'
    import 'flatpickr/dist/flatpickr.css'

	import CellRendererLink from "../opRevisaPallet/cell-renderer/CellRendererLink.vue"
	import CellRendererStatus from "../opRevisaPallet/cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "../opRevisaPallet/cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "../opRevisaPallet/cell-renderer/CellRendererActions.vue"

	import getDocDefinition from "@/components/pdf-export/docDefinition"

	export default {
		data() {
			return {
				ondas: null,
				pallets: [],
                msgGrid: 'Selecione a Onda para exibir os Pallets !',
				gridApi: null,
				searchQuery: "",
				defaultColDef: {
					sortable: true,
					resizable: true,
					suppressMenu: true,
				},
                DataInicial: null,
                DataFinal: null,
                configDataInicialDataPicker: {
                        locale: PortugueseLocale,
                        allowInput: true,
                        altInput: true,
                        altFormat: "d/m/Y H:i:s",
                        dateFormat: 'Y-m-d H:i:s',
                        enableTime: true,
                        enableSeconds: true,
                        time_24hr: true,
                        defaultHour: 0,
                        defaultMinute: 0,
                        defaultSeconds: 0,
                        minuteIncrement: 1,
                        secondIncrement: 1,
                        minDate: null,
                        maxDate: null,
                        minTime: null,
                        maxTime: null,
                },
                configDataFinalDataPicker: {
                        locale: PortugueseLocale,
                        allowInput: true,
                        altInput: true,
                        altFormat: "d/m/Y H:i:s",
                        dateFormat: 'Y-m-d H:i:s',
                        enableTime: true,
                        enableSeconds: true,
                        time_24hr: true,
                        defaultHour: 23,
                        defaultMinute: 59,
                        defaultSeconds: 59,
                        minuteIncrement: 1,
                        secondIncrement: 1,
                        minDate: null,
                        minTime: null,
                        maxTime: null,
                },

				//EXPORT Excel
				fileNameExcel: "",
				formatsExcel: ["xlsx", "xls", "csv", "txt"],
				cellAutoWidthExcel: true,
				selectedFormatExcel: "xlsx",
				activePromptExcel: false,
				headerTitle: ["Identificador", "Loja", "Criação", "Finalização", "Volumes"],
				headerVal: ["numero_identificador", "codigo", "data_criacao", "data_finalizacao", "qtde_volumes"],
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
					PDF_PAGE_NAME: "Revisa | Pallets",
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
            flatPickr,
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
				headerName: 'Identificador',
				field: 'numero_identificador',
				minWidth: 200,
				filter: true,
				checkboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				headerCheckboxSelection: true,
				cellRendererFramework: 'CellRendererLink',
				},
				{
				headerName: 'Loja',
				field: 'codigo',
				filter: true,				
				},
				{
				headerName: 'Criação',
				field: 'data_criacao',
				filter: true,				
				},
				{
				headerName: 'Finalização',
				field: 'data_finalizacao',
				filter: true,               
				},
				{
				headerName: 'Volumes',
				field: 'qtde_volumes',
				filter: true,
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
                var inicial = '1800-01-01 00:00'
                var final = '1800-01-01 00:00'
				axios.get(`${backendUrl}/opPallet/${inicial}&${final}`)
	//			var onda = this.ondas.onda
	//			axios.get(`${backendUrl}/opPallet/${onda}`)
				.then(res => {this.pallets = res.data
					for (let i = 0; ;i++) {
						this.pallets[i].data_criacao = moment(this.pallets[i].data_criacao).format('DD/MM/YYYY HH:mm:ss')
						if (this.pallets[i].data_finalizacao == null || this.pallets[i].data_finalizacao == '') {
							this.pallets[i].operacao = 'Aberto'
						} else {
							this.pallets[i].operacao = 'Finalizado'
							this.pallets[i].data_finalizacao = moment(this.pallets[i].data_finalizacao).format('DD/MM/YYYY HH:mm:ss')
						}
					}
				})
			},
			localizar() {
                var dataInicial = this.DataInicial
                var dataFinal = this.DataFinal
				axios.get(`${backendUrl}/opPallet/${dataInicial}&${dataFinal}`)
	//			var onda = this.ondas.onda
	//			axios.get(`${backendUrl}/opPallet/${onda}`)
				.then(res => {this.pallets = res.data
					for (let i = 0; ;i++) {
						this.pallets[i].data_criacao = moment(this.pallets[i].data_criacao).format('DD/MM/YYYY HH:mm:ss')
						if (this.pallets[i].data_finalizacao == null || this.pallets[i].data_finalizacao == '') {
							this.pallets[i].operacao = 'Aberto'
						} else {
							this.pallets[i].operacao = 'Finalizado'
							this.pallets[i].data_finalizacao = moment(this.pallets[i].data_finalizacao).format('DD/MM/YYYY HH:mm:ss')
						}
					}
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
			// EXPORT EXCEL
			exportToExcel() {
				import('@/components/excel/Export2Excel').then(excel => {
					const list = this.gridApi.getSelectedRows()
					const data = this.formatJson(this.headerVal, list)
					if(this.fileNameExcel == '' || null) {
					this.fileNameExcel = 'Invent - Revisa Pallets'
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
					this.fileNamePDF = 'Invent - Revisa Pallets'
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
