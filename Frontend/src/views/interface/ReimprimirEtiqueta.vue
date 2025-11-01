<template>
    <div id="page-reimprimir-etiqueta">
        <vx-card>
            <div slot="no-body" class="tabs-container px-4 pt-4">

                <div class="vx-card">

                    <h4 class="mb-4">Reimprimir Etiquetas</h4>

                    <div class="flex flex-wrap items-center mb-4">

                        <flat-pickr
                            class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36"
                            :config="configDataInicialDataPicker"
                            v-model="DataInicial"
                            placeholder="Data Inicial" />

                        <flat-pickr
                            class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36"
                            :config="configDataFinalDataPicker"
                            v-model="DataFinal"
                            placeholder="Data Final" />

                        <vs-button class="h-10 mr-3" icon-pack="feather" icon="icon-search"
                            @click="filtro">Buscar</vs-button>

                        <div class="flex-grow" />

                        <vs-input icon-pack="feather" icon="icon-search"
                            class="sm:mr-4 mr-0 sm:w-auto w-full"
                            v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar..." />

                    </div>

                    <ag-grid-vue
                        style="height: 500px"
                        ref="agGridTable"
                        class="w-100 my-4 ag-grid-table ag-theme-material"
                        :gridOptions="gridOptions"
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :rowData="logs"
                        :animateRows="true"
                        :pagination="true"
                        :suppressPaginationPanel="true"
                        overlayNoRowsTemplate='Selecione o período e clique em Buscar'
                        rowSelection="single"
                        colResizeDefault="shift"
                        :paginationPageSize="paginationPageSize">
                    </ag-grid-vue>

                    <vs-pagination :total="totalPages" :max="7" v-model="currentPage" />

                </div>

            </div>
        </vx-card>

    </div>
</template>

<script>
import axios from 'axios'
import { backendUrl } from '@/globalComponents'
import { AgGridVue } from "ag-grid-vue"
import vSelect from 'vue-select'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import flatPickr from 'vue-flatpickr-component'
import { Portuguese as PortugueseLocale } from 'flatpickr/dist/l10n/pt.js'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'

export default {
    data() {
        return {
            logs: [],
            searchQuery: "",
            gridApi: null,
            gridOptions: {},
            defaultColDef: {
                sortable: true,
                resizable: true,
                suppressMenu: true,
            },
            columnDefs: null,
            DataInicial: null,
            DataFinal: null,
            paginationPageSize: 25,
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
            },
        }
    },
    components: {
        AgGridVue,
        vSelect,
        flatPickr
    },
    beforeMount() {
        this.columnDefs = [
            {
                headerName: 'ID',
                field: 'IDLOGIMPRESSAO',
                width: 100
            },
            {
                headerName: 'Data/Hora',
                field: 'CREATEDAT',
                width: 200,
                valueFormatter: params => {
                    return params.value ? moment(params.value).format('DD/MM/YYYY HH:mm:ss') : ''
                }
            },
       /*     {
                headerName: 'Nome',
                field: 'NOME',
                width: 200
            },*/
            {
                headerName: 'Etiqueta',
                field: 'DADOSIMPRESSAO',
                width: 250,
                valueGetter: params => {
                    if (!params.data) return ''

                    if (params.data.DADOSIMPRESSAO) {
                        try {
                            const dados = typeof params.data.DADOSIMPRESSAO === 'string'
                                ? JSON.parse(params.data.DADOSIMPRESSAO)
                                : params.data.DADOSIMPRESSAO

                            // DADOSIMPRESSAO é um array, pegar o primeiro elemento
                            if (Array.isArray(dados) && dados.length > 0) {
                                return dados[0].etiqueta || ''
                            }
                        } catch (e) {
                            console.error('Erro ao parsear DADOSIMPRESSAO:', e)
                        }
                    }

                    return params.data.ETIQUETA || ''
                }
            },
            {
                headerName: 'Impressora',
                field: 'IMPRESSORA',
                width: 250
            },
            {
                headerName: 'Ações',
                field: 'actions',
                width: 150,
                cellRenderer: () => {
                    return `<button class="btn-reimprimir vs-component vs-button vs-button-primary vs-button-filled">
                        <i class="feather icon-printer"></i>
                    </button>`
                },
                onCellClicked: params => {
                    this.reimprimir(params.data)
                }
            }
        ]
    },
    computed: {
        totalPages() {
            if (this.gridApi) return this.gridApi.paginationGetTotalPages()
            else return 0
        },
        currentPage: {
            get() {
                if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
                else return 1
            },
            set(val) {
                this.gridApi.paginationGoToPage(val - 1)
            },
        },
    },
    methods: {
        filtro() {
            if (!this.DataInicial || !this.DataFinal) {
                this.$vs.notify({
                    title: 'Atenção',
                    text: 'Selecione o período',
                    color: 'warning',
                    position: 'top-right'
                })
                return
            }

            const dataInicial = this.DataInicial
            const dataFinal = this.DataFinal

            axios.get(`${backendUrl}/reimprimir/${dataInicial}&${dataFinal}`)
                .then(res => {
                    this.logs = res.data

                    // Debug: Mostrar estrutura de DADOSIMPRESSAO
                    if (this.logs.length > 0) {
                        console.log('Primeiro log completo:', this.logs[0])
                        console.log('DADOSIMPRESSAO:', this.logs[0].DADOSIMPRESSAO)
                        if (this.logs[0].DADOSIMPRESSAO) {
                            try {
                                const parsed = JSON.parse(this.logs[0].DADOSIMPRESSAO)
                                console.log('DADOSIMPRESSAO parseado:', parsed)
                            } catch (e) {
                                console.log('Erro ao parsear DADOSIMPRESSAO')
                            }
                        }
                    }

                    if (this.logs.length === 0) {
                        this.$vs.notify({
                            title: 'Informação',
                            text: 'Nenhum registro encontrado no período',
                            color: 'primary',
                            position: 'top-right'
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                    this.$vs.notify({
                        title: 'Erro',
                        text: 'Erro ao buscar logs',
                        color: 'danger',
                        position: 'top-right'
                    })
                })
        },
        reimprimir(log) {
            // Verificar se o log tem impressora definida
            if (!log.IMPRESSORA) {
                this.$vs.notify({
                    title: 'Erro',
                    text: 'Este log não possui impressora definida',
                    color: 'warning',
                    position: 'top-right'
                })
                return
            }

            // Extrair etiqueta do DADOSIMPRESSAO
            let etiquetaTexto = log.NOME
            if (log.DADOSIMPRESSAO) {
                try {
                    const dados = typeof log.DADOSIMPRESSAO === 'string'
                        ? JSON.parse(log.DADOSIMPRESSAO)
                        : log.DADOSIMPRESSAO

                    if (Array.isArray(dados) && dados.length > 0) {
                        etiquetaTexto = dados[0].etiqueta || log.NOME
                    }
                } catch (e) {
                    console.error('Erro ao parsear DADOSIMPRESSAO:', e)
                }
            }

            // Confirmar reimpressão
            this.$vs.dialog({
                type: 'confirm',
                color: 'primary',
                title: 'Confirmar Reimpressão',
                text: `Deseja reimprimir a etiqueta "${etiquetaTexto}" na impressora "${log.IMPRESSORA}"?`,
                acceptText: 'Confirmar',
                cancelText: 'Cancelar',
                accept: () => {
                    const payload = {
                        impressora: log.IMPRESSORA
                    }

                    axios.post(`${backendUrl}/reimprimir/${log.IDLOGIMPRESSAO}`, payload)
                        .then(() => {
                            this.$vs.notify({
                                title: 'Sucesso',
                                text: 'Etiqueta enviada para impressão',
                                color: 'success',
                                position: 'top-right'
                            })
                        })
                        .catch(err => {
                            console.error(err)
                            this.$vs.notify({
                                title: 'Erro',
                                text: 'Erro ao reimprimir etiqueta',
                                color: 'danger',
                                position: 'top-right'
                            })
                        })
                }
            })
        },
        updateSearchQuery(val) {
            this.gridApi.setQuickFilter(val)
        },
    },
    mounted() {
        this.gridApi = this.gridOptions.api

        // Definir datas padrão (hoje)
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        this.DataInicial = moment(hoje).format('YYYY-MM-DD HH:mm:ss')

        const fimDia = new Date()
        fimDia.setHours(23, 59, 59, 999)
        this.DataFinal = moment(fimDia).format('YYYY-MM-DD HH:mm:ss')
    }
}
</script>

<style lang="scss" scoped>
#page-reimprimir-etiqueta {
    .btn-reimprimir {
        padding: 5px 10px;
        font-size: 12px;
        cursor: pointer;
        border-radius: 5px;
        border: none;

        i {
            margin-right: 5px;
        }
    }
}
</style>
