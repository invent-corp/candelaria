<template>
    <div id="page-rampa-cheia">
        <vx-card>
            <div slot="no-body" class="px-4 pt-4">

                <h2 class="mb-2">Relatório de Rampa Cheia</h2>
                <p class="text-grey mb-6">Totalização de ocorrências de rampa cheia por período</p>

                <!-- Filtros -->
                <div class="flex flex-wrap items-center mb-6">
                    <flat-pickr
                        class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-48"
                        :config="configDataInicio"
                        v-model="dataInicio"
                        placeholder="Data Início" />

                    <flat-pickr
                        class="mr-3 h-10 text-sm p-3 border border-solid rounded-lg d-theme-border-grey-light w-48"
                        :config="configDataFim"
                        v-model="dataFim"
                        placeholder="Data Fim" />

                    <vs-button @click="atualizar" icon-pack="feather" icon="icon-refresh-cw" class="mr-3">
                        Atualizar
                    </vs-button>

                    <vs-button @click="exportarPDF" color="warning" icon-pack="feather" icon="icon-download">
                        Exportar PDF
                    </vs-button>
                </div>

                <!-- Cards de Métricas -->
                <div class="vx-row mb-6">
                    <div class="vx-col w-full md:w-1/3 mb-base">
                        <statistics-card-line
                            icon="AlertTriangleIcon"
                            statistic-title="Total de Ocorrências"
                            :statistic="metricas.totalOcorrencias.toString()"
                            color="danger"
                            statistic-subtitle="Rampas cheias no período" />
                    </div>

                    <div class="vx-col w-full md:w-1/3 mb-base">
                        <statistics-card-line
                            icon="TrelloIcon"
                            statistic-title="Total de Rampas"
                            :statistic="metricas.totalRampas.toString()"
                            color="warning"
                            statistic-subtitle="Rampas com ocorrências" />
                    </div>

                    <div class="vx-col w-full md:w-1/3 mb-base">
                        <statistics-card-line
                            icon="TrendingUpIcon"
                            statistic-title="Média por Rampa"
                            :statistic="metricas.mediaOcorrenciasPorRampa.toString()"
                            color="primary"
                            statistic-subtitle="Média de ocorrências" />
                    </div>
                </div>

                <!-- Tabela de Dados -->
                <vx-card class="mb-6">
                    <h4 class="mb-4">Totalização por Rampa ({{ totalRegistros }} rampas)</h4>

                    <div class="flex flex-wrap items-center mb-4">
                        <vs-input icon-pack="feather" icon="icon-search"
                            class="sm:mr-4 mr-0 sm:w-auto w-full"
                            v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar rampa..." />
                    </div>

                    <ag-grid-vue
                        style="height: 400px"
                        ref="agGridTable"
                        class="w-100 my-4 ag-grid-table ag-theme-material"
                        :gridOptions="gridOptions"
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :rowData="dados"
                        :animateRows="true"
                        :pagination="true"
                        :suppressPaginationPanel="true"
                        overlayNoRowsTemplate='Selecione o período e clique em Atualizar'
                        rowSelection="single"
                        colResizeDefault="shift"
                        :paginationPageSize="paginationPageSize">
                    </ag-grid-vue>

                    <vs-pagination :total="totalPages" :max="7" v-model="currentPage" />
                </vx-card>

                <!-- Gráfico -->
                <div class="vx-row">
                    <div class="vx-col w-full mb-base">
                        <vx-card title="Top 10 Rampas com Mais Ocorrências" id="chart-rampa-cheia">
                            <vue-apex-charts
                                ref="chartBarRef"
                                type="bar"
                                height="350"
                                :options="chartRampaCheia.chartOptions"
                                :series="chartRampaCheia.series">
                            </vue-apex-charts>
                        </vx-card>
                    </div>
                </div>

            </div>
        </vx-card>
    </div>
</template>

<script>
import axios from 'axios'
import { backendUrl } from '@/globalComponents'
import { AgGridVue } from "ag-grid-vue"
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import flatPickr from 'vue-flatpickr-component'
import { Portuguese as PortugueseLocale } from 'flatpickr/dist/l10n/pt.js'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/dashboard/statistics-cards/StatisticsCardLine.vue'

export default {
    data() {
        return {
            dados: [],
            metricas: {
                totalOcorrencias: 0,
                totalRampas: 0,
                mediaOcorrenciasPorRampa: 0
            },
            searchQuery: "",
            gridApi: null,
            gridOptions: {},
            defaultColDef: {
                sortable: true,
                resizable: true,
                suppressMenu: true,
            },
            columnDefs: null,
            dataInicio: null,
            dataFim: null,
            paginationPageSize: 10,
            configDataInicio: {
                locale: PortugueseLocale,
                allowInput: true,
                altInput: true,
                altFormat: "d/m/Y",
                dateFormat: 'Y-m-d',
            },
            configDataFim: {
                locale: PortugueseLocale,
                allowInput: true,
                altInput: true,
                altFormat: "d/m/Y",
                dateFormat: 'Y-m-d',
            },
            chartRampaCheia: {
                series: [{
                    name: 'Quantidade',
                    data: []
                }],
                chartOptions: {
                    chart: {
                        toolbar: {
                            show: false
                        }
                    },
                    colors: ['#ff4757'],
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            borderRadius: 4,
                            dataLabels: {
                                position: 'top'
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        offsetX: 30,
                        style: {
                            fontSize: '12px',
                            colors: ['#304758']
                        }
                    },
                    xaxis: {
                        categories: [],
                        title: {
                            text: 'Quantidade de Ocorrências'
                        }
                    },
                    yaxis: {
                        title: {
                            text: 'Rampa'
                        }
                    }
                }
            }
        }
    },
    components: {
        AgGridVue,
        flatPickr,
        VueApexCharts,
        StatisticsCardLine
    },
    beforeMount() {
        this.columnDefs = [
            {
                headerName: '',
                field: 'checkbox',
                width: 50,
                checkboxSelection: true,
                headerCheckboxSelection: false
            },
            {
                headerName: 'Rampa',
                field: 'rampa',
                width: 200,
                cellRenderer: params => {
                    return `<span class="font-semibold text-primary">${params.value}</span>`
                }
            },
            {
                headerName: 'Quantidade de Ocorrências',
                field: 'quantidade',
                width: 250,
                cellRenderer: params => {
                    const color = params.value >= 10 ? 'danger' : params.value >= 5 ? 'warning' : 'success'
                    return `<span class="text-${color} font-semibold">${params.value}</span>`
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
        totalRegistros() {
            return this.dados.length
        }
    },
    methods: {
        atualizar() {
            if (!this.dataInicio) {
                this.$vs.notify({
                    title: 'Atenção',
                    text: 'Selecione a data inicial',
                    color: 'warning',
                    position: 'top-right'
                })
                return
            }

            const dataInicial = `${this.dataInicio} 00:00:00`
            const dataFinal = this.dataFim ? `${this.dataFim} 23:59:59` : `${this.dataInicio} 23:59:59`

            this.$vs.loading()

            axios.get(`${backendUrl}/relrampacheia/${dataInicial}&${dataFinal}`)
                .then(res => {
                    this.dados = res.data.dados
                    this.metricas = res.data.metricas

                    // Atualizar gráfico - Top 10
                    const top10 = this.dados.slice(0, 10)
                    const rampas = top10.map(item => item.rampa)
                    const quantidades = top10.map(item => item.quantidade)

                    this.chartRampaCheia = {
                        ...this.chartRampaCheia,
                        chartOptions: {
                            ...this.chartRampaCheia.chartOptions,
                            xaxis: {
                                ...this.chartRampaCheia.chartOptions.xaxis,
                                categories: rampas
                            }
                        },
                        series: [{
                            name: 'Quantidade',
                            data: quantidades
                        }]
                    }

                    this.$vs.loading.close()

                    if (this.dados.length === 0) {
                        this.$vs.notify({
                            title: 'Informação',
                            text: 'Nenhuma ocorrência de rampa cheia encontrada no período',
                            color: 'primary',
                            position: 'top-right'
                        })
                    } else {
                        this.$vs.notify({
                            title: 'Sucesso',
                            text: `${this.metricas.totalOcorrencias} ocorrência(s) encontrada(s)`,
                            color: 'success',
                            position: 'top-right'
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: 'Erro',
                        text: 'Erro ao buscar dados de rampa cheia',
                        color: 'danger',
                        position: 'top-right'
                    })
                })
        },
        async exportarPDF() {
            if (!this.dados || this.dados.length === 0) {
                this.$vs.notify({
                    title: 'Atenção',
                    text: 'Não há dados para exportar',
                    color: 'warning',
                    position: 'top-right'
                })
                return
            }

            try {
                const pdfMake = require('pdfmake/build/pdfmake.js')
                if (pdfMake.vfs == undefined) {
                    const pdfFonts = require('pdfmake/build/vfs_fonts.js')
                    pdfMake.vfs = pdfFonts.pdfMake.vfs
                }

                const html2canvas = require('html2canvas')

                this.$vs.loading()

                const dataInicial = moment(this.dataInicio).format('DD/MM/YYYY')
                const dataFinal = this.dataFim ? moment(this.dataFim).format('DD/MM/YYYY') : dataInicial

                // Capturar gráfico como imagem
                let chartImage = null

                try {
                    const chartElement = document.getElementById('chart-rampa-cheia')
                    if (chartElement) {
                        const canvas = await html2canvas(chartElement, {
                            backgroundColor: '#ffffff',
                            scale: 2
                        })
                        chartImage = canvas.toDataURL('image/png')
                    }
                } catch (err) {
                    console.error('Erro ao capturar gráfico:', err)
                }

                // Preparar dados da tabela
                const tableBody = [
                    [
                        { text: 'Rampa', style: 'tableHeader' },
                        { text: 'Quantidade', style: 'tableHeader' }
                    ]
                ]

                this.dados.forEach(item => {
                    tableBody.push([
                        item.rampa || '',
                        item.quantidade || 0
                    ])
                })

                // Montar o conteúdo do PDF
                const content = [
                    // Métricas
                    {
                        columns: [
                            {
                                width: '33%',
                                stack: [
                                    { text: 'Total de Ocorrências', style: 'metricLabel' },
                                    { text: this.metricas.totalOcorrencias.toString(), style: 'metricValue', color: '#ff4757' }
                                ]
                            },
                            {
                                width: '33%',
                                stack: [
                                    { text: 'Total de Rampas', style: 'metricLabel' },
                                    { text: this.metricas.totalRampas.toString(), style: 'metricValue', color: '#ffa502' }
                                ]
                            },
                            {
                                width: '34%',
                                stack: [
                                    { text: 'Média por Rampa', style: 'metricLabel' },
                                    { text: this.metricas.mediaOcorrenciasPorRampa.toString(), style: 'metricValue', color: '#2ed573' }
                                ]
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },
                    // Tabela
                    {
                        text: `Totalização por Rampa (${this.totalRegistros} rampas)`,
                        style: 'sectionHeader',
                        margin: [0, 10, 0, 10]
                    },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto'],
                            body: tableBody
                        },
                        layout: {
                            fillColor: function (rowIndex) {
                                return (rowIndex === 0) ? '#cccccc' : (rowIndex % 2 === 0 ? '#f3f3f3' : null)
                            }
                        },
                        margin: [0, 0, 0, 20]
                    }
                ]

                // Adicionar gráfico se foi capturado
                if (chartImage) {
                    content.push({
                        text: 'Top 10 Rampas com Mais Ocorrências',
                        style: 'sectionHeader',
                        margin: [0, 10, 0, 10],
                        pageBreak: 'before'
                    })

                    content.push({
                        image: chartImage,
                        width: 500,
                        alignment: 'center'
                    })
                }

                const docDefinition = {
                    pageSize: 'A4',
                    pageOrientation: 'portrait',
                    pageMargins: [40, 80, 40, 60],
                    header: {
                        margin: [30, 30, 0, 0],
                        columns: [
                            {
                                image: 'ag-grid-logo',
                                width: 100,
                                alignment: 'left'
                            }
                        ]
                    },
                    background: {
                        columns: [
                            {
                                text: 'Relatório | Rampa Cheia',
                                color: '#969696',
                                fontSize: 14,
                                bold: true,
                                alignment: 'left',
                                margin: [140, 40, 0, 0]
                            },
                            {
                                text: `Período: ${dataInicial} à ${dataFinal}`,
                                color: '#969696',
                                fontSize: 10,
                                bold: true,
                                alignment: 'right',
                                margin: [0, 45, 30, 0]
                            }
                        ]
                    },
                    footer: function(currentPage, pageCount) {
                        return [
                            {
                                text: new Date().toLocaleString('pt-BR'),
                                alignment: 'left',
                                fontSize: 10,
                                color: '#969696',
                                margin: [30, 15, 0, 0]
                            },
                            {
                                text: 'Invent - Smart Intralogistics Solutions ',
                                alignment: 'center',
                                fontSize: 10,
                                color: '#969696',
                                italics: true,
                                margin: [20, -11]
                            },
                            {
                                text: currentPage.toString() + ' de ' + pageCount + ' página(s) ',
                                alignment: 'right',
                                fontSize: 10,
                                color: '#969696',
                                margin: [10, -1, 30, 0]
                            }
                        ]
                    },
                    content: content,
                    images: {
                        'ag-grid-logo': 'logo-full.png'
                    },
                    styles: {
                        sectionHeader: {
                            fontSize: 14,
                            bold: true
                        },
                        metricLabel: {
                            fontSize: 10,
                            color: '#666666',
                            margin: [0, 0, 0, 5]
                        },
                        metricValue: {
                            fontSize: 16,
                            bold: true
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 11,
                            color: 'black',
                            fillColor: '#cccccc'
                        }
                    },
                    defaultStyle: {
                        fontSize: 9
                    }
                }

                const filename = `relatorio_rampa_cheia_${dataInicial.replace(/\//g, '-')}_a_${dataFinal.replace(/\//g, '-')}.pdf`

                setTimeout(() => {
                    pdfMake.createPdf(docDefinition).download(filename)

                    this.$vs.loading.close()

                    this.$vs.notify({
                        title: 'Sucesso',
                        text: 'PDF exportado com sucesso',
                        color: 'success',
                        position: 'top-right'
                    })
                }, 100)

            } catch (error) {
                console.error('Erro ao gerar PDF:', error)
                this.$vs.loading.close()
                this.$vs.notify({
                    title: 'Erro',
                    text: 'Erro ao gerar PDF: ' + error.message,
                    color: 'danger',
                    position: 'top-right'
                })
            }
        },
        updateSearchQuery(val) {
            this.gridApi.setQuickFilter(val)
        },
    },
    mounted() {
        this.gridApi = this.gridOptions.api

        // Definir data padrão (hoje)
        this.dataInicio = moment().format('YYYY-MM-DD')
        this.dataFim = moment().format('YYYY-MM-DD')
    }
}
</script>

<style lang="scss">
#page-rampa-cheia {
    // Estilos personalizados para o relatório
}
</style>
