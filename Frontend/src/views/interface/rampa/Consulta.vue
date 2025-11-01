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

                    <div class="flex-grow">

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ rampas.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : rampas.length }} of {{ rampas.length }}</span>
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
                    overlayNoRowsTemplate='Não há dados cadastrados !'

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData=rampas
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

	import CellRendererLink from "./cell-renderer/CellRendererLink.vue"
	import CellRendererStatus from "./cell-renderer/CellRendererStatus.vue"
	import CellRendererVerified from "./cell-renderer/CellRendererVerified.vue"
	import CellRendererActions from "./cell-renderer/CellRendererActions.vue"

     import getDocDefinition from "@/components/pdf-export/docDefinition"

	export default {
		data() {
			return {
                    rampas: null,
                    gridApi: null,
                    searchQuery: "",
				defaultColDef: {
					sortable: true,
					resizable: true,
					suppressMenu: true,
				},
                    //EXPORT Excel
                    fileNameExcel: "",
                    formatsExcel:["xlsx", "xls", "csv", "txt"] ,
                    cellAutoWidthExcel: true,
                    selectedFormatExcel: "xlsx",
                    activePromptExcel: false,
                    headerTitle: ["Nome", "Número", "Descrição", "Status", "Coletor", "Descrição", "IP", "Porta", "Status"],
                    headerVal: ["nome", "numero_rampa", "descricao", "situacao", "coletor", "descricao_coletor", "ip", "porta", "coletor_s"],
                    selectedUsers: [],
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
                         PDF_PAGE_NAME: "Consulta | Rampas",
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
			CellRendererLink,
			CellRendererStatus,
			CellRendererVerified,
			CellRendererActions,
          },
		beforeMount() {
               this.gridOptions = {}
			this.columnDefs = [
				{
				headerName: 'Nome',
				field: 'nome',
                    minWidth: 250,
				filter: true,
                    sort: 'asc',
				checkboxSelection: true,
				headerCheckboxSelectionFilteredOnly: true,
				headerCheckboxSelection: true,
                    cellRendererFramework: 'CellRendererLink',
				},
                    {
				headerName: 'Número',
				field: 'numero_rampa',
				filter: true,				
				},
				{
				headerName: 'Descrição',
				field: 'descricao',
				filter: true,				
				},
				{
				headerName: 'Rampa',
				field: 'situacao',
				filter: true,
				cellRendererFramework: 'CellRendererStatus',                                      
				},
                    {
				headerName: 'Coletor',
				field: 'coletor',
				filter: true,				
				},
				{
				headerName: 'Descrição',
				field: 'descricao_coletor',
                    minWidth: 200,
				filter: true,				
				},
				{
				headerName: 'IP',
				field: 'ip',
                    minWidth: 130,
				filter: true,                                   
				},
                    {
				headerName: 'Porta',
				field: 'porta',
                    width: 100,
				filter: true,				
				},
				{
				headerName: 'Coletor',
				field: 'coletor_s',
                    width: 110,
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
				axios.get(`${backendUrl}/rampa`)
				.then(res => {this.rampas = res.data})
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
                    if (this.$acl.check('32')) {
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
                         this.fileNameExcel = 'Invent - Rampas'
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
                         this.fileNamePDF = 'Invent - Rampas'
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
		}
	}
</style>
