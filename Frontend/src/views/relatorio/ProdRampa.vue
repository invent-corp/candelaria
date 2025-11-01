<template>

    <div id="page-user-list">

        <vx-card>
            <div slot="no-body" class="tabs-container px-4 pt-4">

                <vs-tabs v-model="activeTab">

                    <vs-tab class="pt-8" label="Relatório" icon-pack="feather" icon="icon-grid">

                        <div class="vx-card">

                            <vs-prompt title="Exportar PDF" class="export-options" @cancel="clearFields"
                                @accept="exportToPDF" accept-text="Exportar" cancel-text="Cancelar" @close="clearFields"
                                :active.sync="activePromptPDF">
                                <vs-input v-model="fileNamePDF" placeholder="Insira o nome do arquivo..."
                                    class="w-full" />
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

                            <vs-prompt title="Exportar Excel" class="export-options" @cancel="clearFields"
                                @accept="exportToExcel" accept-text="Exportar" cancel-text="Cancelar"
                                @close="clearFields" :active.sync="activePromptExcel">
                                <vs-input v-model="fileNameExcel" placeholder="Insira o nome do arquivo..."
                                    class="w-full" />
                                <v-select v-model="selectedFormatExcel" :options="formatsExcel" class="my-4" />
                                <div class="flex">
                                    <span class="mr-4">Largura Auto Células:</span>
                                    <vs-switch v-model="cellAutoWidthExcel">Largura Auto Células</vs-switch>
                                </div>
                            </vs-prompt>

                            <div class="flex flex-wrap items-center">

                                <div>
                                    <vs-dropdown vs-trigger-click class="cursor-pointer text-sm">

                                        <div
                                            class="p-3 mr-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                                            <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize
                                                - 1) }} - {{ prodrampa.length - currentPage * paginationPageSize > 0 ?
                                                    currentPage * paginationPageSize : prodrampa.length }} of {{
                                                    prodrampa.length }}</span>
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

                                    <flat-pickr
                                        class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36"
                                        :config="configDataInicialDataPicker" v-model="DataInicial"
                                        placeholder="Data Inicial" />
                                    <flat-pickr
                                        class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-36"
                                        :config="configDataFinalDataPicker" v-model="DataFinal"
                                        placeholder="Data Final" />

                                </div>

                                <vs-button class="h-10 w-10" icon-pack="feather" icon="icon-search"
                                    @click="filtro"></vs-button>

                                <vs-button class="h-10 ml-3" color="primary" type="border" @click="toggleExpandir">
                                    {{ expandido ? 'Recolher Tudo' : 'Expandir Tudo' }}
                                </vs-button>

                                <div class="flex-grow" />

                                <vs-input icon-pack="feather" icon="icon-search"
                                    class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4"
                                    v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar..." />

                                <vs-dropdown vs-trigger-click class="cursor-pointer">

                                    <div
                                        class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer flex items-end justify-center text-sm font-medium w-32">
                                        <feather-icon icon="PrinterIcon" svgClasses="mr-2 h-5 w-5" />
                                        <feather-icon icon="SaveIcon" svgClasses="mr-2 h-5 w-5" />
                                        <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                                    </div>

                                    <vs-dropdown-menu class="sm:mt-1 h-4 w-32">
                                        <vs-dropdown-item @click="activePromptPDF = true">
                                            <span class="flex items-center">
                                                <feather-icon icon="PrinterIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                <span>Imprimir</span>
                                            </span>
                                        </vs-dropdown-item>

                                        <vs-dropdown-item @click="activePromptExcel = true">
                                            <span class="flex items-center">
                                                <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                                                <span>Exportar</span>
                                            </span>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>

                                </vs-dropdown>

                            </div>

                            <ag-grid-vue style="height: 370px" ref="agGridTable"
                                onFirstDataRendered={onFirstDataRendered}
                                class="w-100 my-4 ag-grid-table ag-theme-material" :gridOptions="gridOptions"
                                :columnDefs="columnDefs" :defaultColDef="defaultColDef" :rowData="prodrampa"
                                :animateRows="true" :pagination="true" :suppressPaginationPanel="true"
                                overlayNoRowsTemplate='Selecione a Data Inicial e Data Final' rowSelection="multiple"
                                colResizeDefault="shift" paginationPageSize=6>
                            </ag-grid-vue>

                            <vs-pagination :total="totalPages" :max="7" v-model="currentPage" />

                        </div>

                    </vs-tab>

                    <vs-tab label="Gráfico" icon-pack="feather" icon="icon-pie-chart">

                        <vx-card>

                            <div class="auto-update-settings mb-4">
                                <vs-checkbox v-model="autoUpdateEnabled">Atualização Automática</vs-checkbox>
                                <div v-if="autoUpdateEnabled" class="interval-input mt-2">
                                    <label for="autoUpdateInterval">Intervalo (min):</label>
                                    <vs-input v-model.number="autoUpdateInterval" type="number" min="1"
                                        placeholder="Intervalo" class="ml-2" style="width: 100px;" />
                                </div>
                            </div>

                            <!-- CHART -->
                            <vue-apex-charts type="bar" height="350" :options="barChart.chartOptions"
                                :series="barChart.series"></vue-apex-charts>

                        </vx-card>

                    </vs-tab>

                </vs-tabs>

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

import CellRendererLink from "./cell-renderer/CellRendererLink.vue"
import CellRendererStatus from "./cell-renderer/CellRendererStatus.vue"
import CellRendererVerified from "./cell-renderer/CellRendererVerified.vue"
import CellRendererActions from "./cell-renderer/CellRendererActions.vue"

import VueApexCharts from 'vue-apexcharts'

import getDocDefinition from "@/components/pdf-export/docDefinition"

var rampa = []
var producao = []

export default {
    data() {
        return {
            activeTab: 0,
            prodrampa: [],
            dadosOriginais: [],
            expandido: false,
            gridApi: null,
            searchQuery: "",
            autoUpdateEnabled: false, // Para o checkbox de atualização automática
            autoUpdateInterval: 5,
            autoUpdateIntervalId: null,

            gridOptions: null,
            defaultColDef: {
                sortable: true,
                resizable: true,
                suppressMenu: true,
            },
            columnDefs: null,
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
            headerTitle: ["Rampa", "Volume", "Participação"],
            headerVal: ["rampa", "volume", "participacao"],
            selectedUsers: [],
            //EXPORT PDF
            fileNamePDF: "",
            formatsPDF: "pdf",
            cellAutoWidthPDF: true,
            pageOrientationPDF: true,
            selectedFormatPDF: "pdf",
            activePromptPDF: false,
            printParams: {
                PDF_HEADER_COLOR: "#ffc500",
                PDF_INNER_BORDER_COLOR: "#bbbbbb",
                PDF_OUTER_BORDER_COLOR: "#bbbbbb",
                PDF_LOGO: "logo-full.png",
                PDF_PAGE_NAME: "Relatório | Produção X Rampa",
                PDF_PAGE_ORITENTATION: "landscape",
                PDF_WITH_HEADER_IMAGE: true,
                PDF_WITH_FOOTER_PAGE_COUNT: true,
                PDF_HEADER_HEIGHT: 15,
                PDF_FILTER_DATE: '',
                PDF_ROW_HEIGHT: 'auto',
                PDF_ODD_BKG_COLOR: "#eeeeee",
                PDF_EVEN_BKG_COLOR: "#ffffff",
                PDF_WITH_CELL_FORMATTING: true,
                PDF_WITH_COLUMNS_AS_LINKS: true,
                PDF_SELECTED_ROWS_ONLY: true,
                PDF_WITH_COLUMNS: false
            },
            barChart: {
                series: [{
                    name: 'Produção',
                    data: producao
                }],
                chartOptions: {
                    colors: ['#704700', '#634000', '#4f3300', '#3b2600', '#2c1c00', '#1d1300', '#120b00', '#090600', '#040300'],
                    //                    colors: ['#e6b000', '#cc9e00', '#b38b00', '#997800', '#806100', '#665100', '#4c3900', '#332800', '#1a1500'],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            distributed: true,
                            borderRadius: 5,
                            columnWidth: '75%',
                        },
                    },
                    subtitle: {
                        text: "",
                        align: 'left',
                        margin: 0,
                        offsetX: -10,
                        offsetY: 10,
                        floating: false,
                        style: {
                            fontSize: '15px',
                            fontWeight: 'bold',
                        },
                    },
                    legend: {
                        show: false
                    },
                    dataLabels: {
                        enabled: true,
                        position: 'top',
                        colors: ['#000'], // Define a cor do texto para preto
                        style: {
                            fontSize: '24px',
                            fontWeight: 'bold',
                            cssClass: 'custom-datalabel'
                        },
                        dropShadow: {
                            enabled: true,
                            top: 3,
                            left: 3,
                            blur: 10,
                            opacity: 1,
                            color: '#000' // Cor da "sombra" que pode funcionar como fundo para o texto
                        }
                    },
                    xaxis: {
                        categories: rampa,
                        title: {
                            text: 'Quantidade Rampa'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return "Qtde " + val
                            }
                        },
                        x: {
                            formatter: function (val) {
                                return "Rampa: " + val
                            }
                        }
                    }
                },
            },
            settings: { // perfectscrollbar settings
                maxScrollbarLength: 60,
                wheelSpeed: .60,
            }
        }
    },
    components: {
        VueApexCharts,
        flatPickr,
        AgGridVue,
        vSelect,
        CellRendererLink,
        CellRendererStatus,
        CellRendererVerified,
        CellRendererActions,
    },
    beforeMount() {
        // Definir as colunas principais
        this.columnDefs = [
            {
                headerName: 'Rampa',
                field: 'nome',
                flex: 1,
                valueGetter: params => {
                    if (params.data) {
                        if (params.data.tipo === 'rampa') {
                            return `${params.data.rampa} - ${params.data.nome}`
                        } else if (params.data.tipo === 'rota') {
                            return `    ${params.data.nome}`
                        } else if (params.data.tipo === 'total') {
                            return 'Total'
                        }
                    }
                    return ''
                },
                cellStyle: params => {
                    if (params.data && params.data.tipo === 'total') {
                        return { fontWeight: 'bold', backgroundColor: '#1a1a1a', color: '#ffffff' }
                    } else if (params.data && params.data.tipo === 'rampa') {
                        return { fontWeight: 'bold', backgroundColor: '#2c2c2c', color: '#ffffff' }
                    } else if (params.data && params.data.tipo === 'rota') {
                        return { paddingLeft: '30px', fontStyle: 'italic', backgroundColor: '#3a3a3a', color: '#ffffff' }
                    }
                    return null
                }
            },
            {
                headerName: 'Volume',
                field: 'volume',
                filter: true,
                width: 150,
                valueFormatter: params => {
                    return params.value ? params.value.toLocaleString('pt-BR') : '0'
                },
                cellStyle: params => {
                    const baseStyle = {
                        textAlign: 'right',
                        paddingRight: '10px',
                        color: '#ffffff'
                    }
                    if (params.data && params.data.tipo === 'total') {
                        return { ...baseStyle, fontWeight: 'bold', fontSize: '14px', backgroundColor: '#1a1a1a' }
                    } else if (params.data && params.data.tipo === 'rampa') {
                        return { ...baseStyle, fontWeight: 'bold', fontSize: '14px', backgroundColor: '#2c2c2c' }
                    } else if (params.data && params.data.tipo === 'rota') {
                        return { ...baseStyle, backgroundColor: '#3a3a3a' }
                    }
                    return baseStyle
                }
            },
            {
                headerName: 'Participação',
                field: 'participacao',
                filter: true,
                width: 150,
                cellStyle: params => {
                    const baseStyle = {
                        textAlign: 'right',
                        paddingRight: '10px',
                        color: '#ffffff'
                    }
                    if (params.data && params.data.tipo === 'total') {
                        return { ...baseStyle, fontWeight: 'bold', fontSize: '14px', backgroundColor: '#1a1a1a' }
                    } else if (params.data && params.data.tipo === 'rampa') {
                        return { ...baseStyle, fontWeight: 'bold', fontSize: '14px', backgroundColor: '#2c2c2c' }
                    } else if (params.data && params.data.tipo === 'rota') {
                        return { ...baseStyle, backgroundColor: '#3a3a3a' }
                    }
                    return baseStyle
                }
            }
        ]

        // Grid options simples
        this.gridOptions = {}
    },
    computed: {
        paginationPageSize() {
            if (this.gridApi) return this.gridApi.paginationGetPageSize()
            else return 10
        },
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
                this.Autosize()
            },
        },
    },
    methods: {
        handleAutoUpdate() {
            // Limpar intervalo existente, se houver
            if (this.autoUpdateIntervalId) {
                clearInterval(this.autoUpdateIntervalId);
                this.autoUpdateIntervalId = null;
            }

            // Configurar novo intervalo se a atualização automática estiver habilitada
            if (this.autoUpdateEnabled) {
                this.autoUpdateIntervalId = setInterval(() => {
                    this.filtro(); // Assumindo que `loadData` atualiza o gráfico
                }, this.autoUpdateInterval * 60000); // Convertendo minutos em milissegundos
            }
        },

        loadData() {
            var inicial = '1800-01-01 00:00'
            var final = '1800-01-01 00:00'
            axios.get(`${backendUrl}/prodrampa/${inicial}&${final}`)
                .then(res => {
                    console.log('Dados recebidos:', res.data)
                    this.prodrampa = res.data
                })
            this.barChart.chartOptions.subtitle = {
                text: "",
                align: 'left',
                margin: 0,
                offsetX: -10,
                offsetY: 10,
                floating: false,
                style: {
                    fontSize: '15px',
                    fontWeight: 'bold',
                },
            }
            this.barChart.series = [{
                name: 'Produção',
                data: []
            }]
            this.barChart.chartOptions.xaxis = {
                categories: [],
                title: {
                    text: 'Quantidade Rampa'
                }
            }
        },
        filtro() {
            var dataInicial = this.DataInicial
            var dataFinal = this.DataFinal
            axios.get(`${backendUrl}/prodrampa/${dataInicial}&${dataFinal}`)
                .then(res => {
                    console.log('Dados filtrados recebidos:', res.data)
                    this.dadosOriginais = res.data
                    this.expandido = false
                    this.prodrampa = this.processarDados(res.data, false)
                    if (this.prodrampa != '') {
                        this.barChart.chartOptions.subtitle = {
                            text: "Período: " + moment(this.DataInicial).format('DD/MM/YYYY') + " à " + moment(this.DataFinal).format('DD/MM/YYYY'),
                            align: 'left',
                            margin: 0,
                            offsetX: -10,
                            offsetY: 10,
                            floating: false,
                            style: {
                                fontSize: '15px',
                                fontWeight: 'bold',
                            },
                        },
                            this.barChart.series = [{
                                name: 'Produção',
                                data: producao
                            }]
                        this.barChart.chartOptions.xaxis = {
                            categories: rampa,
                            title: {
                                text: 'Quantidade Rampa'
                            }
                        }
                        rampa.length = 0
                        producao.length = 0

                        this.prodrampa.forEach(item => {
                            if (item.tipo === 'rampa') {
                                rampa.push(`${item.rampa} - ${item.nome}`)
                                producao.push(item.volume)
                            }
                        })
                    }
                    if (this.prodrampa == '') {
                        this.barChart.chartOptions.subtitle = {
                            text: "",
                            align: 'left',
                            margin: 0,
                            offsetX: -10,
                            offsetY: 10,
                            floating: false,
                            style: {
                                fontSize: '15px',
                                fontWeight: 'bold',
                            },
                        },
                            this.barChart.series = [{
                                name: 'Produção',
                                data: []
                            }]
                        this.barChart.chartOptions.xaxis = {
                            categories: [],
                            title: {
                                text: 'Quantidade Rampa'
                            }
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
        },
        updateSearchQuery(val) {
            this.gridApi.setQuickFilter(val)
        },
        // EXPORT EXCEL
        exportToExcel() {
            import('@/components/excel/Export2Excel').then(excel => {
                const list = this.gridApi.getSelectedRows()
                const data = this.formatJson(this.headerVal, list)
                if (this.fileNameExcel == '' || null) {
                    this.fileNameExcel = 'Invent - Prod Rampa'
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
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }
            if (this.fileNamePDF == '' || null) {
                this.fileNamePDF = 'Invent - Prod Rampa'
            }
            const printParams = this.$data.printParams
            printParams.PDF_WITH_COLUMNS = this.cellAutoWidthPDF
            printParams.PDF_PAGE_ORITENTATION = this.pageOrientationPDF
            printParams.PDF_FILTER_DATE = moment(this.DataInicial).format('DD/MM/YYYY') + ' à ' + moment(this.DataFinal).format('DD/MM/YYYY')
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
        clearFields() {
            this.fileNamePDF = ""
            this.fileNameExcel = ""
            this.cellAutoWidth = true
        },
        toggleExpandir() {
            this.expandido = !this.expandido
            this.prodrampa = this.processarDados(this.dadosOriginais, this.expandido)
        },
        processarDados(dados, expandir) {
            if (!dados || dados.length === 0) return []

            const resultado = []

            dados.forEach(item => {
                if (item.tipo === 'rampa') {
                    // Adicionar a rampa
                    resultado.push({
                        rampa: item.rampa,
                        nome: item.nome,
                        volume: item.volume,
                        participacao: item.participacao,
                        tipo: 'rampa'
                    })

                    // Se expandir, adicionar as rotas
                    if (expandir && item.children && item.children.length > 0) {
                        item.children.forEach(rota => {
                            resultado.push({
                                rampa: rota.rampa,
                                nome: rota.nome,
                                volume: rota.volume,
                                participacao: rota.participacao,
                                tipo: 'rota'
                            })
                        })
                    }
                } else if (item.tipo === 'total') {
                    // Adicionar o total
                    resultado.push({
                        rampa: item.rampa,
                        nome: item.nome,
                        volume: item.volume,
                        participacao: item.participacao,
                        tipo: 'total'
                    })
                }
            })

            return resultado
        },
    },
    watch: {
        autoUpdateEnabled() {
            this.handleAutoUpdate();
        },
        autoUpdateInterval() {
            if (this.autoUpdateEnabled) {
                this.handleAutoUpdate();
            }
        }
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

<style scoped>
.custom-datalabel {
    background-color: black;
    /* Cor de fundo */
    padding: 2px 4px;
    /* Espaçamento interno para criar mais destaque */
    border-radius: 4px;
    /* Cantos arredondados para um visual mais suave */
}
</style>
