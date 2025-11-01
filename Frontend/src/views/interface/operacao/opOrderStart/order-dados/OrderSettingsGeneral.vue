<template>
    <div>
      <div class="grid">
        <label class="mensagem_volume" style="color: #634d02">{{ mensagem_conferencia }}</label>				

        <div class="vx-card p-6">

        <div class="flex flex-wrap items-center">

            <div class="">

                <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

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

            <div class="flex-grow"/> 

            <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">


            </vs-dropdown>

        </div>

        <ag-grid-vue 
            ref="agGridTable" style="height: 400px"
            onFirstDataRendered={onFirstDataRendered}
            :overlayNoRowsTemplate="msgGrid"

            class="ag-theme-material w-100 my-4 ag-grid-table"
            :gridOptions="gridOptions"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowData="orderStart"
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

        <div class="separacao">
        </div>

        <div class="campos">
            <div class="botao">
                <div class="flex flex-wrap items-center justify-end mt-base">
                    <vs-button class="ml-auto mt-2 btn-custom" icon-pack="feather" icon="icon-save"
                    @click="atualizarPedidos" :disabled="loading">Atualizar Pedidos</vs-button>
                </div>        
          <!--      <div class="flex flex-wrap items-center justify-end mt-base">
                    <vs-button class="ml-auto mt-2 btn-custom" icon-pack="feather" icon="icon-save"
                    @click="exibeCampo" >Vincular Pedido</vs-button>
                </div>      -->  
            </div>
            <div class="caixa">
       <!--         <div v-if="exibirCampo">
                    <vs-input id="pedido" ref="pedido" @keydown.enter="moverFoco" size="large" v-validate="'required|numeric'" name="Pedido " class="w-full" icon-pack="feather" icon="icon-rss" label-placeholder="PEDIDO" v-model="Pedido"></vs-input>
                    <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Pedido ')">{{ errors.first('Pedido ') }}</div>
                    <div class="mb-16"/>
                </div>-->
                <vs-input id="etiqueta" ref="etiqueta" size="large" v-validate="'required|numeric'" name="Etiqueta " class="w-full" icon-pack="feather" icon="icon-rss" label-placeholder="CAIXA" v-model="Etiqueta"></vs-input>
                <div class="text-primary" v-show="errors.has('Etiqueta ')">{{ errors.first('Etiqueta ') }}</div>
            </div>
        </div>
    </div>
  </template>
  
  <style>
  /* Aqui você pode adicionar estilos para o componente */
  .grid {
    float: left;
    width: 60%;
  }
  .separacao {
    float: right;
    width: 4%;
  }
  .campos {
    float: right;
    width: 36%;
  }
  .caixa {
    margin-top: 100px;
    height: 100px;
  }
  .botaoSalvar {
    margin-top: 200px;
  }
  .btn-custom {
  min-width: 200px;
  }
  .mensagem_volume {
  font-size: 16px;
  margin-left: 15px;
  font-weight: bold;
}
  </style>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'
import vSelect from 'vue-select'
import { AgGridVue } from "ag-grid-vue"
import { Validator } from 'vee-validate'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'

const dictionary = {
    br: {
        messages:{
            required: field => 'O campo ' + field + ' é obrigatório.',
            numeric: field => 'O campo ' + field + ' pode conter apenas caracteres numéricos.'
        }
    }
}

// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'required' })
validator.localize('br')

export default {
    components: {
        AgGridVue,
		vSelect,
    },
    data() {
        return {
            totalPages:0,
            currentPage:1,
            exibirCampo: false,
            orderStart: null,
            mensagem_conferencia : 'TOTAL DE VOLUMES:',
            msgGrid: 'Sem registros',
            gridApi: null,
            loading: false,
            searchQuery: "",
            id: "",
			defaultColDef: {
				sortable: true,
				resizable: true,
				suppressMenu: true,
			},

        }
    },
    beforeMount() {
			this.gridOptions = {}
			this.columnDefs = [
				{
				headerName: 'Pedido',
				field: 'ordem',
				filter: true,
                width:180,	
				},
				{
				headerName: 'Volume',
				field: 'volume',
				filter: true,
                width:130,	
				},
				{
				headerName: 'Total Vol.',
				field: 'total_volume',
				filter: true,				
                width:130,	
				},
				{
				headerName: 'Nome',
				field: 'descricao_destino',
				filter: true,				
				},
			]
		},

    methods: {
        loadData() {
            axios.get(`${backendUrl}/opOrderStart/1`)
				.then(res => {this.orderStart = res.data
                    this.mensagem_conferencia = 'TOTAL DE VOLUMES: '+this.orderStart.length
				})
        },

        gravarCaixa(valor_caixa) {

            axios.get(`${backendUrl}/opOrderStartCaixa/${this.orderStart[0].id_pedido_volume}&${valor_caixa}`)
            .then(res => {
                this.resultado = res.data
                if (this.resultado.resultado == "CAIXA GRAVADA COM SUCESSO") {
                    this.showUpdateSuccess()
                    this.Etiqueta = "";
                    this.loadData()
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

        },

        atualizarPedidos() {
            this.loading = true;
            axios.get(`${backendUrl}/opOrderStartCaixaProcessarPedidos`)
            .then(res => {
                this.resultado = res.status
                if (this.resultado == "200") {
                    this.mensagem = res.data.mensagem;
                    this.$vs.notify({
                        icon: "check",
                        color: 'success',
                        title: 'Pedidos Atualizados',
                        text: this.mensagem
                    }) 
                 this.loadData()
                } else {
                    this.mensagem = res.data.mensagem;
                    this.$vs.notify({
                        icon: 'close',
                        color: 'danger',
                        title: 'ERRO na Atualização',
                        text: this.mensagem
                    }) 
                }
            })
            .catch(err => { 
                console.error(err) 
                this.showCatchError()
            })
            .finally(() => {
                    this.loading = false; // Desativar o estado de carregamento após a conclusão do método
            });            

        },        

        moverFoco() {

            document.getElementById("etiqueta").focus() 
        },

        exibeCampo() {
           this.exibirCampo = true;
           this.$nextTick(() => {
             document.getElementById("pedido").focus() 
           });
        },

        imprimir() {
        },

        reload() {
            this.etiqueta = ''
            this.$router.push("/pages/refresh/")
       //     this.$router.push("/interface/operacao/opOrderStart/").catch(() => {})
        },

        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Caixa Atualizada',
				text: 'Caixa Atualizada com Sucesso!'
			})
		},
        showUpdateError() {
			this.$vs.notify({
                icon: 'close',
				color: 'danger',
				title: 'ERRO na Atualização',
				text: 'Atualização NÃO Realizada!'
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
        
        setInterval(() => {
            this.loadData(); // Chama a função loadData() a cada 5 minutos
        }, 300000);

        document.getElementById("etiqueta").focus()      
        
        const etiqueta = this.$refs.etiqueta;
     //   const pedido = this.$refs.pedido;

// Adicione um evento 'keydown' para a caixa de texto
        etiqueta.$el.addEventListener('keydown', (event) => {
        // Verifique se a tecla pressionada é 'enter'
            if (event.key === 'Enter') {
                // Obtenha o valor da caixa de texto
                const valor_caixa = this.Etiqueta;
                // Chame o método de gravação em banco de dados, passando o valor da caixa de texto como argumento
                this.gravarCaixa(valor_caixa);
                this.exibirCampo = false;
            }
        });        

        
    },
}

</script>