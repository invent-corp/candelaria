<template>

	<div id="page-user-list">

          <div class="vx-card p-6">

               <div class="flex flex-wrap items-center">

                    <div>

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ postoItens.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : postoItens.length }} of {{ postoItens.length }}</span>
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
                    
                    <vs-input disabled placeholder="Posto" class="w-32 text-sm font-medium text-center">> 
                    </vs-input>

                    <vs-input disabled icon-pack="feather" icon="icon-rss" class="mr-3 rounded-lg w-64 text-sm sm:mt-0 mt-4" v-model="postoItens[0].descricao"  >> 
                    </vs-input>
                    
                    <vs-button class="mr-3 h-10 w-10" icon-pack="feather" icon="icon-corner-left-up"
                        @click="voltar" ></vs-button>

                    <div class="flex-grow"/> 

               </div>
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 360px"
                    onFirstDataRendered={onFirstDataRendered}
                    overlayNoRowsTemplate='Não há dados cadastrados !'

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="postoItens"
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

	import CellRendererDelete from "./cell-renderer/CellRendererDelete.vue"


	export default {
		data() {
			return {
                    postoItens: null,
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
			CellRendererDelete,
          },
		beforeMount() {
               this.gridOptions = {}
			this.columnDefs = [
				{
				headerName: 'Numero Caixa',
				field: 'numero_caixa',
                    minWidth: 300,
				filter: true,
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
                    const id = this.$route.params.id_posto
				axios.get(`${backendUrl}/limparpostosItens/${id}`)
				.then(res => {this.postoItens = res.data
                    })
			},
               voltar() {
				this.$router.push("/adm/sistema/limparPostos/")
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
