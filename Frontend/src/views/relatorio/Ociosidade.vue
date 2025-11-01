<template>
    <div id="page-ociosidade">
        <vx-card>
            <div slot="no-body" class="px-4 pt-4">

                <h2 class="mb-2">Relatório de Tempo Ocioso</h2>
                <p class="text-grey mb-6">Análise detalhada do tempo ocioso por período</p>

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
                        placeholder="Data Fim (opcional)" />

                    <v-select
                        v-model="agrupamento"
                        :options="['Por Dia', 'Por Semana', 'Por Mês']"
                        placeholder="Por Dia"
                        class="mr-3 w-40" />

                    <vs-button @click="atualizar" icon-pack="feather" icon="icon-refresh-cw" class="mr-3">
                        Atualizar
                    </vs-button>

                    <vs-button @click="exportarPDF" color="warning" icon-pack="feather" icon="icon-download">
                        Exportar PDF
                    </vs-button>
                </div>

                <!-- Cards de Métricas -->
                <div class="vx-row mb-6">
                    <div class="vx-col w-full md:w-1/4 mb-base">
                        <statistics-card-line
                            icon="ClockIcon"
                            statistic-title="Tempo Total Ocioso"
                            :statistic="formatarTempo(metricas.tempoTotalOcioso)"
                            color="danger"
                            :statistic-subtitle="`${metricas.percentualOcioso}% do tempo total`" />
                    </div>

                    <div class="vx-col w-full md:w-1/4 mb-base">
                        <statistics-card-line
                            icon="TrendingUpIcon"
                            statistic-title="Média por Período"
                            :statistic="formatarTempo(metricas.mediaOciosidade)"
                            color="warning"
                            statistic-subtitle="Média calculada" />
                    </div>

                    <div class="vx-col w-full md:w-1/4 mb-base">
                        <statistics-card-line
                            icon="AlertTriangleIcon"
                            statistic-title="Maior Ociosidade"
                            :statistic="formatarTempo(metricas.maiorOciosidade)"
                            color="danger"
                            statistic-subtitle="Pico registrado" />
                    </div>

                    <div class="vx-col w-full md:w-1/4 mb-base">
                        <statistics-card-line
                            icon="CheckCircleIcon"
                            statistic-title="Menor Ociosidade"
                            :statistic="formatarTempo(metricas.menorOciosidade)"
                            color="success"
                            statistic-subtitle="Menor registro" />
                    </div>
                </div>

                <!-- Dados Detalhados -->
                <vx-card class="mb-6">
                    <h4 class="mb-4">Dados Detalhados ({{ totalRegistros }} registros)</h4>

                    <div class="flex flex-wrap items-center mb-4">
                        <vs-input icon-pack="feather" icon="icon-search"
                            class="sm:mr-4 mr-0 sm:w-auto w-full"
                            v-model="searchQuery" @input="updateSearchQuery" placeholder="Localizar..." />

                        <div class="flex-grow" />

                        <div v-if="periodoSelecionado" class="flex items-center">
                            <span class="font-semibold mr-2">Período:</span>
                            <span class="mr-3">{{ periodoSelecionado }}</span>
                            <span class="font-semibold mr-2">Tempo Ocioso:</span>
                            <span class="mr-3">{{ tempoOciosoDetalhado }}</span>
                            <span class="font-semibold mr-2">Tempo Total:</span>
                            <span class="mr-3">{{ tempoTotalDetalhado }}</span>
                            <span class="font-semibold mr-2">Percentual:</span>
                            <vs-chip :color="getStatusColor(percentualDetalhado)" class="font-semibold">
                                {{ percentualDetalhado }}%
                            </vs-chip>
                        </div>
                    </div>

                    <ag-grid-vue
                        style="height: 400px"
                        ref="agGridTable"
                        class="w-100 my-4 ag-grid-table ag-theme-material"
                        :gridOptions="gridOptions"
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :rowData="ociosidades"
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

                <!-- Gráficos -->
                <div class="vx-row">
                    <div class="vx-col w-full md:w-1/2 mb-base">
                        <vx-card title="Tempo Ocioso por Dia" id="chart-ocioso-dia">
                            <vue-apex-charts
                                ref="chartBarRef"
                                type="bar"
                                height="300"
                                :options="chartOciosoPorDia.chartOptions"
                                :series="chartOciosoPorDia.series">
                            </vue-apex-charts>
                        </vx-card>
                    </div>

                    <div class="vx-col w-full md:w-1/2 mb-base">
                        <vx-card title="Distribuição do Tempo" id="chart-distribuicao">
                            <vue-apex-charts
                                ref="chartDonutRef"
                                type="donut"
                                height="300"
                                :options="chartDistribuicao.chartOptions"
                                :series="chartDistribuicao.series">
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
import vSelect from 'vue-select'
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
            ociosidades: [],
            metricas: {
                tempoTotalOcioso: 0,
                tempoAtivo: 0,
                percentualOcioso: 0,
                maiorOciosidade: 0,
                menorOciosidade: 0,
                mediaOciosidade: 0,
                totalRegistros: 0
            },
            ociosoPorDia: {},
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
            agrupamento: 'Por Dia',
            paginationPageSize: 10,
            periodoSelecionado: null,
            tempoOciosoDetalhado: null,
            tempoTotalDetalhado: null,
            percentualDetalhado: null,
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
            chartOciosoPorDia: {
                series: [{
                    name: 'Tempo Ocioso',
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
                            horizontal: false,
                            columnWidth: '70%',
                            borderRadius: 5
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: []
                    },
                    yaxis: {
                        labels: {
                            formatter: (val) => {
                                return this.formatarTempo(val)
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => {
                                return this.formatarTempo(val)
                            }
                        }
                    }
                }
            },
            chartDistribuicao: {
                series: [],
                chartOptions: {
                    labels: ['Tempo Ativo', 'Tempo Ocioso'],
                    colors: ['#2ed573', '#ff4757'],
                    legend: {
                        position: 'bottom'
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: (val) => {
                            return val.toFixed(1) + '%'
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => {
                                return this.formatarTempo(val)
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        AgGridVue,
        vSelect,
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
                headerName: 'Motivo',
                field: 'MOTIVO',
                width: 200,
                cellRenderer: params => {
                    if (params.value === 'EMERG') {
                        return '<span class="text-danger font-semibold">EMERG</span>'
                    } else if (params.value === 'OCIOSO') {
                        return '<span class="text-warning font-semibold">OCIOSO</span>'
                    }
                    return params.value
                }
            },
            {
                headerName: 'Diferença (s)',
                field: 'DIFERENCA',
                width: 180,
                valueFormatter: params => {
                    return params.value ? parseInt(params.value) : 0
                }
            },
            {
                headerName: 'Início',
                field: 'TIMEINICIO',
                width: 300,
                valueFormatter: params => {
                    return params.value ? moment(params.value).format('DD/MM/YYYY, HH:mm:ss') : ''
                }
            },
            {
                headerName: 'Fim',
                field: 'TIMEFIM',
                width: 300,
                valueFormatter: params => {
                    return params.value ? moment(params.value).format('DD/MM/YYYY, HH:mm:ss') : ''
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
            return this.ociosidades.length
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

            axios.get(`${backendUrl}/relociosidade/${dataInicial}&${dataFinal}`)
                .then(res => {
                    this.ociosidades = res.data.ociosidades
                    this.metricas = res.data.metricas
                    this.ociosoPorDia = res.data.ociosoPorDia

                    // Atualizar gráfico de barras
                    const dias = Object.keys(this.ociosoPorDia)
                    const valores = Object.values(this.ociosoPorDia)

                    this.chartOciosoPorDia = {
                        ...this.chartOciosoPorDia,
                        chartOptions: {
                            ...this.chartOciosoPorDia.chartOptions,
                            xaxis: {
                                categories: dias
                            }
                        },
                        series: [{
                            name: 'Tempo Ocioso',
                            data: valores
                        }]
                    }

                    // Atualizar gráfico de pizza
                    this.chartDistribuicao.series = [
                        this.metricas.tempoAtivo,
                        this.metricas.tempoTotalOcioso
                    ]

                    // Atualizar informações do período
                    this.periodoSelecionado = `Ter ${moment(this.dataInicio).format('DD/MM')}`
                    this.tempoOciosoDetalhado = this.formatarTempo(this.metricas.tempoTotalOcioso)
                    this.tempoTotalDetalhado = this.formatarTempo(this.metricas.tempoAtivo + this.metricas.tempoTotalOcioso)
                    this.percentualDetalhado = this.metricas.percentualOcioso

                    if (this.ociosidades.length === 0) {
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
                        text: 'Erro ao buscar dados de ociosidade',
                        color: 'danger',
                        position: 'top-right'
                    })
                })
        },
        formatarTempo(segundos) {
            if (!segundos || segundos === 0) return '0s'

            const horas = Math.floor(segundos / 3600)
            const minutos = Math.floor((segundos % 3600) / 60)

            if (horas > 0) {
                return `${horas}h ${minutos}m`
            } else if (minutos > 0) {
                return `${minutos}m`
            } else {
                return `${Math.floor(segundos)}s`
            }
        },
        getStatusColor(percentual) {
            const valor = parseFloat(percentual)
            if (valor >= 40) return 'danger'
            if (valor >= 20) return 'warning'
            return 'success'
        },
        async exportarPDF() {
            if (!this.ociosidades || this.ociosidades.length === 0) {
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

                // Capturar gráficos como imagens
                let chartBarImage = null
                let chartDonutImage = null

                try {
                    // Capturar gráfico de barras
                    const chartBarElement = document.getElementById('chart-ocioso-dia')
                    if (chartBarElement) {
                        const canvasBar = await html2canvas(chartBarElement, {
                            backgroundColor: '#ffffff',
                            scale: 2
                        })
                        chartBarImage = canvasBar.toDataURL('image/png')
                    }

                    // Capturar gráfico de donut
                    const chartDonutElement = document.getElementById('chart-distribuicao')
                    if (chartDonutElement) {
                        const canvasDonut = await html2canvas(chartDonutElement, {
                            backgroundColor: '#ffffff',
                            scale: 2
                        })
                        chartDonutImage = canvasDonut.toDataURL('image/png')
                    }
                } catch (err) {
                    console.error('Erro ao capturar gráficos:', err)
                }

                // Preparar dados da tabela
                const tableBody = [
                    [
                        { text: 'Motivo', style: 'tableHeader' },
                        { text: 'Diferença (s)', style: 'tableHeader' },
                        { text: 'Início', style: 'tableHeader' },
                        { text: 'Fim', style: 'tableHeader' }
                    ]
                ]

                this.ociosidades.forEach(item => {
                    tableBody.push([
                        item.MOTIVO || '',
                        parseInt(item.DIFERENCA) || 0,
                        item.TIMEINICIO ? moment(item.TIMEINICIO).format('DD/MM/YYYY HH:mm:ss') : '',
                        item.TIMEFIM ? moment(item.TIMEFIM).format('DD/MM/YYYY HH:mm:ss') : ''
                    ])
                })

                // Montar o conteúdo do PDF
                const content = [
                    // Métricas
                    {
                        columns: [
                            {
                                width: '25%',
                                stack: [
                                    { text: 'Tempo Total Ocioso', style: 'metricLabel' },
                                    { text: this.formatarTempo(this.metricas.tempoTotalOcioso), style: 'metricValue', color: '#ff4757' }
                                ]
                            },
                            {
                                width: '25%',
                                stack: [
                                    { text: 'Média por Período', style: 'metricLabel' },
                                    { text: this.formatarTempo(this.metricas.mediaOciosidade), style: 'metricValue', color: '#ffa502' }
                                ]
                            },
                            {
                                width: '25%',
                                stack: [
                                    { text: 'Maior Ociosidade', style: 'metricLabel' },
                                    { text: this.formatarTempo(this.metricas.maiorOciosidade), style: 'metricValue', color: '#ff4757' }
                                ]
                            },
                            {
                                width: '25%',
                                stack: [
                                    { text: 'Menor Ociosidade', style: 'metricLabel' },
                                    { text: this.formatarTempo(this.metricas.menorOciosidade), style: 'metricValue', color: '#2ed573' }
                                ]
                            }
                        ],
                        margin: [0, 0, 0, 20]
                    },
                    // Resumo
                    {
                        text: `Dados Detalhados (${this.totalRegistros} registros)`,
                        style: 'sectionHeader',
                        margin: [0, 10, 0, 10]
                    },
                    {
                        text: `Tempo Ocioso: ${this.formatarTempo(this.metricas.tempoTotalOcioso)} | Tempo Total: ${this.formatarTempo(this.metricas.tempoAtivo + this.metricas.tempoTotalOcioso)} | Percentual: ${this.metricas.percentualOcioso}%`,
                        style: 'subtitle',
                        margin: [0, 0, 0, 15]
                    },
                    // Tabela
                    {
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', '*', '*'],
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

                // Adicionar gráficos se foram capturados
                if (chartBarImage || chartDonutImage) {
                    content.push({
                        text: 'Gráficos',
                        style: 'sectionHeader',
                        margin: [0, 10, 0, 10],
                        pageBreak: 'before'
                    })

                    const chartColumns = []

                    if (chartBarImage) {
                        chartColumns.push({
                            width: '48%',
                            stack: [
                                { text: 'Tempo Ocioso por Dia', style: 'chartTitle', margin: [0, 0, 0, 10] },
                                { image: chartBarImage, width: 350 }
                            ]
                        })
                    }

                    if (chartDonutImage) {
                        if (chartColumns.length > 0) {
                            chartColumns.push({ width: '4%', text: '' }) // Espaçamento
                        }
                        chartColumns.push({
                            width: chartColumns.length > 0 ? '48%' : '100%',
                            stack: [
                                { text: 'Distribuição do Tempo', style: 'chartTitle', margin: [0, 0, 0, 10] },
                                { image: chartDonutImage, width: 350 }
                            ]
                        })
                    }

                    content.push({
                        columns: chartColumns
                    })
                }

                const docDefinition = {
                    pageSize: 'A4',
                    pageOrientation: 'landscape',
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
                                text: 'Relatório | Tempo Ocioso',
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
                        header: {
                            fontSize: 18,
                            bold: true,
                            margin: [0, 0, 0, 5]
                        },
                        subheader: {
                            fontSize: 12,
                            margin: [0, 0, 0, 5]
                        },
                        sectionHeader: {
                            fontSize: 14,
                            bold: true
                        },
                        subtitle: {
                            fontSize: 10,
                            italics: true
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
                        },
                        chartTitle: {
                            fontSize: 12,
                            bold: true,
                            alignment: 'center'
                        }
                    },
                    defaultStyle: {
                        fontSize: 9
                    }
                }

                const filename = `relatorio_ociosidade_${dataInicial.replace(/\//g, '-')}_a_${dataFinal.replace(/\//g, '-')}.pdf`

                // Usar setTimeout para evitar travamento da UI
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
    }
}
</script>

<style lang="scss">
#page-ociosidade {
    .statistics-card-line {
        background: linear-gradient(to right, var(--vs-primary), var(--vs-primary));
    }
}
</style>
