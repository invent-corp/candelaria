<template>

	<div id="page-user-list">

	<vx-card title="Endereçamento de Produtos">

		<div class="flex flex-wrap items-center ">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" :text="picking.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_Situacao" > {{ picking.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Endereço: {{ picking.descricao }}</p>
            </div>
        </div>		

        <div v-if="this.$route.meta.pageTitle !== 'Perfil'" class="mt-2 cbx_produto">
            <label class="text-sm" >Produto</label>
            <v-select v-validate="'required'" name="Produto " placeholder="Selecione" v-model="produtos.id_produto" :options=produtos :reduce="nome => nome.id_produto" label="sku"/>
            <div class="text-primary text-sm w-full" v-show="errors.has('Produto ')">{{ errors.first('Produto ') }}</div>
        </div>


<!--        <vs-input v-validate="'required'" name="Código EAN" class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Produto" v-model="produtosEan.codigo_ean"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Código EAN ')">{{ errors.first('Código EAN ') }}</div>
        <div class="mb-6"/>
-->
		<div class="flex flex-wrap items-left justify-center mt-base">
			<vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-save"
				@click="confirmDeleteRecord" >Excluir</vs-button>
			<vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
				@click="submitForm" >Salvar</vs-button>
			<vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning" 
				@click="reset">Limpar</vs-button>

		</div>		
			</vx-card>

          <div class="vx-card p-6">


               <div class="flex flex-wrap items-center">

                    <div class="flex-grow">

                         <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                              <div class="p-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                   <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ pickingProdutoGrid.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : pickingProdutoGrid.length }} of {{ pickingProdutoGrid.length }}</span>
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


               </div>
               
               <ag-grid-vue 
                    ref="agGridTable" style="height: 360px"
                    onFirstDataRendered={onFirstDataRendered}
                    overlayNoRowsTemplate='Não há dados cadastrados !'

                    class="ag-theme-material w-100 my-4 ag-grid-table"
                    :gridOptions="gridOptions"
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :rowData="pickingProdutoGrid"
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
	import { Validator } from 'vee-validate'
	import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

	import CellRendererLinkEan from "../cell-renderer/CellRendererLinkPickingProduto.vue"
	import CellRendererStatusEan from "../cell-renderer/CellRendererStatusPickingProduto.vue"
	import CellRendererVerifiedEan from "../cell-renderer/CellRendererVerifiedPickingProduto.vue"
	import CellRendererActionsEan from "../cell-renderer/CellRendererActionsPickingProduto.vue"

const dictionary = {
    br: {
        messages:{
            required: field => 'O campo ' + field + ' é obrigatório.',
            decimal: field => 'O campo ' + field + ' pode conter apenas caracteres númericos ou ponto (.)',
            numeric: field => 'O campo ' + field + ' pode conter apenas números'
        }
    }
}


// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'decimal' })
validator.localize('br')

	export default {
		data() {
			return {
                    picking: null,
				pickingProduto: null,
				pickingProdutoGrid: null,
                    produtos: [],
				idVal: ["id_picking_produto"],
				descVal: ["descricao"],
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
			CellRendererLinkEan,
			CellRendererStatusEan,
			CellRendererVerifiedEan,
			CellRendererActionsEan,
          },
		beforeMount() {
            this.gridOptions = {

			columnDefs : [
				{
				headerName: 'SKU',
				field: 'sku',
                    minWidth: 150,
				filter: true,
				},
				{
				headerName: 'Descrição',
				field: 'descricao',
                    minWidth: 400,
				filter: true,
				},
			],

			rowSelection: 'single',
			}
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
                    const idpicking = this.$route.params.id_picking
                    if(idpicking !== undefined) {
                       axios.get(`${backendUrl}/picking/${idpicking}`)
                         .then(res => {this.picking = res.data
                        this.loadProduto()
                    })}

				axios.get(`${backendUrl}/pickingprodutoPicking/${idpicking}`)
				.then(res => {this.pickingProdutoGrid = res.data})

			//	axios.get(`${backendUrl}/pickingproduto`)
			//	.then(res => {this.pickingProduto = res.data})


			},
               loadProduto() {
                     axios.get(`${backendUrl}/produtos`)
                          .then(res => (this.produtos = res.data))

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
                    if (this.$acl.check('38')) {
                         this.gridColumnApi.setColumnVisible('acoes', true)
                    } else {
                         this.gridColumnApi.setColumnVisible('acoes', false)
                    }
               },
               updateSearchQuery(val) {
                    this.gridApi.setQuickFilter(val)
               },
			
               selecionarGrid() {
				const list = this.gridApi.getSelectedRows()
                    const data = this.formatJson(this.idVal, list)
                    const id_produto_ean = data[0]

				console.log(id_produto_ean)

				axios.get(`${backendUrl}/pickingproduto/${id_produto_ean}`)
                    .then(res => {this.pickingProduto = res.data})
               },

               formatJson(filterVal, jsonData) {
                    return jsonData.map(v => filterVal.map(j => {

                         return v[j]
                    }))
               },
               
               reset() {
                    this.pickingProduto = {}
               },
               
               save() {
               const method = 'put'
               const id = 0
               var pickingProdutosalvar = `{"id_produto":"${this.produtos.id_produto}", "id_picking":"${this.picking.id_picking}"}`;
               pickingProdutosalvar = JSON.parse(pickingProdutosalvar)
               
               axios.get(`${backendUrl}/pickingprodutoProduto/${this.produtos.id_produto}`)
               .then(res => {
                    if (res.data.length > 0) {
                    // Já existe um cadastro com o mesmo id_produto
                       this.$vs.notify({
                       icon: 'error',
                       color: 'danger',
                       title: 'Erro de validação',
                       text: `Já existe o produto cadastrado na posição "${res.data[0].descricao}"`
                       })
                    } else {
                          axios[method](`${backendUrl}/pickingproduto/${id}`, pickingProdutosalvar)
                         .then(() => {
                          this.showUpdateSuccess()
                         this.loadData()
                         })
                         .catch(err => {
                              console.error(err)
                         })
                    }     
               
                    })
               .catch(err => {
                    console.error(err)
               })
          },               

   //            axios[method](`${backendUrl}/pickingproduto/${id}`, pickingProdutosalvar)
     //              .then(() => {
     //                  this.showUpdateSuccess()
     //                  this.loadData()
     //              })
     //              .catch(err => { console.error(err) })
     //          },
               submitForm() {
                    this.$validator.validateAll().then(result => {
                         if(result) {
                              this.save()
                         }else{
                              console.log('Corrija os Campos!')
                         }
                    })
               },
               showUpdateSuccess() {
                    this.$vs.notify({
                         icon: "check",
					color: 'success',
					title: 'Produto Atualizado',
					text: 'Produto Atualizado com Sucesso!'
				})
			},

			confirmDeleteRecord() {
				this.pickingProduto = {}
                    const list = this.gridApi.getSelectedRows()
                    const dataarray = this.formatJson(this.idVal, list)
                    const id_picking_produto = dataarray[0]
                    axios.get(`${backendUrl}/pickingproduto/${id_picking_produto}`)
                    .then(res => {this.pickingProduto = res.data})	

                    const listdesc = this.gridApi.getSelectedRows()
                    const datadesc = this.formatJson(this.descVal, listdesc)
                    const descricao_produto = datadesc[0]


				this.$vs.dialog({
				type: 'confirm',
				color: 'danger',
				title: `Confirmar Exclusão`,
				text: `Corfima Exclusão do Produto: " ${descricao_produto} " ?`,
				accept: this.deleteRecord,
				acceptText: "Excluir", 
				})
			},
			deleteRecord() {

				const id =  this.pickingProduto.id_picking_produto
				axios.delete(`${backendUrl}/pickingproduto/${id}`)
					.then(() => {
						this.showDeleteSuccess()
						this.loadData()
					})
					.catch(err => { console.error(err) })
			},
			showDeleteSuccess() {
				this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Produto Excluido',
				text: 'Produto excluido com Sucesso!'
				})
			}				
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
