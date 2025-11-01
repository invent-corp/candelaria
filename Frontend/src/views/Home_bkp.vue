<template>

    <div>
        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  
                  icon="CalendarIcon"
                  :statistic="analyticsData.Tri1.Tri1"
                  statisticTitle="2020 | 1º Trimetre"
                  :chartData="analyticsData.Tri1.series"
                  type='area' />
            </div>

            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line

                  icon="CalendarIcon"
                  :statistic="analyticsData.Tri2.Tri2"
                  statisticTitle="2020 | 2º Trimetre"
                  :chartData="analyticsData.Tri2.series"
                  color='success'
                  type='area' />
            </div>

            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  
                  icon="CalendarIcon"
                  :statistic="analyticsData.Tri3.Tri3"
                  statisticTitle="2020 | 3º Trimetre"
                  :chartData="analyticsData.Tri3.series"
                  color='success'
                  type='area' />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  
                  icon="CalendarIcon"
                  :statistic="analyticsData.Tri4.Tri4"
                  statisticTitle="2020 | 4º Trimetre"
                  :chartData="analyticsData.Tri4.series"
                  color='success'
                  type='area' />
            </div>
        </div>

        <div class="vx-row">

            <!-- LINE CHART -->
            <div class="vx-col w-full md:w-2/3 mb-base">
                <vx-card title="Saídas - Julho 2021" title-color="primary">
                    <template slot="actions">
                        <feather-icon icon="TrendingUpIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
                    </template>
                    <div slot="no-body" class="p-6 pb-0">
                        <div class="flex">
                            <div class="mr-6">
                                <p class="mb-1 font-semibold">Mês Atual</p>
                                <p class="text-3xl text-success"><sup class="text-base mr-1"></sup> 86.589 </p>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Mês Passado</p>
                                <p class="text-3xl"><sup class="text-base mr-1"></sup> 273.683 </p>
                            </div>
                        </div>
                        <vue-apex-charts
                          type=line
                          height=286
                          :options="analyticsData.revenueComparisonLine.chartOptions"
                          :series="analyticsData.revenueComparisonLine.series" />
                    </div>
                </vx-card>
            </div>

            <!-- RADIAL CHART -->
            <div class="vx-col w-full md:w-1/3 mb-base">
                <vx-card title="Saídas - Julho 2021" title-color="primary">
                    <template slot="actions">
                        <feather-icon icon="HelpCircleIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
                    </template>

                    <!-- CHART -->
                    <template slot="no-body">
                        <div class="mt-10">
                            <vue-apex-charts type=radialBar height=280 :options="analyticsData.goalOverviewRadialBar.chartOptions" :series="analyticsData.goalOverviewRadialBar.series" />
                        </div>
                    </template>

                    <!-- DATA -->
                    <div class="flex justify-between text-center mt-6" slot="no-body-bottom">
                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <p class="mt-4">Envios</p>
                            <p class="mb-4 text-3xl font-semibold text-primary">86.589</p>
                        </div>
                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0">
                            <p class="mt-4">Em Progresso</p>
                            <p class="mb-4 text-3xl font-semibold">31.561</p>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>

        <div class="vx-row">

            <!-- CATEGORIAS DONUT -->
            <div class="vx-col w-full lg:w-1/3 lg:mt-0 mt-base">
                <vx-card title="Categorias" title-color="primary">

                    <!-- SLOT = ACTIONS -->

                    <template slot="actions">
                        <change-time-duration-dropdown />
                    </template>

                    <div slot="no-body">
                        <vue-apex-charts class="mt-6 mb-8" type=donut height=325 :options="analyticsData.sessionsByDeviceDonut.chartOptions" :series="analyticsData.sessionsByDeviceDonut.series" />
                    </div>

                    <ul class="mt-6">
                        <li v-for="deviceData in analyticsData.sessionsByDeviceDonut.analyticsData" :key="deviceData.device" class="flex mb-3">
                            <feather-icon :icon="deviceData.icon" :svgClasses="[`h-5 w-5 stroke-current text-${deviceData.color}`]"></feather-icon>
                            <span class="ml-2 inline-block font-semibold">{{ deviceData.device }}</span>
                            <span class="mx-2">-</span>
                            <span class="mr-4">{{ deviceData.sessionsPercentage }}%</span>
                            <div class="ml-auto flex -mr-1">
                            <span class="mr-1">{{ deviceData.comparedResultPercentage }}%</span>
                            <feather-icon :icon=" deviceData.comparedResultPercentage < 0 ? 'ArrowDownIcon' : 'ArrowUpIcon'" :svgClasses="[deviceData.comparedResultPercentage < 0 ? 'text-danger' : 'text-success'  ,'stroke-current h-4 w-4 mb-1 mr-1']"></feather-icon>
                            </div>
                        </li>
                    </ul>
                </vx-card>
            </div>

            <!-- BAR -->
            <div class="vx-col w-full lg:w-1/3 lg:mt-0 mt-base">
                <vx-card title="Integrações" title-color="primary">
                    <!-- SLOT = ACTIONS -->

                    <template slot="actions">
                        <change-time-duration-dropdown />
                    </template>

                    <div slot="no-body">
                        <!-- CHART -->
                       <vue-apex-charts type=bar height=476 class="mt-6 mb-6" :options="analyticsData.siteTraffic.columnChart.chartOptions" :series="analyticsData.siteTraffic.columnChart.series" />
                    </div>
                                      

                </vx-card>
            </div>

            <!--ROTAS PIZZA-->
            <div class="vx-col w-full lg:w-1/3 lg:mt-0 mt-base">
                <vx-card title="Rotas" title-color="primary">
                    <!-- SLOT = ACTIONS -->
                    <template slot="actions">
                        <change-time-duration-dropdown />
                    </template>

                    <div slot="no-body">
                        <!-- CHART -->
                        <vue-apex-charts type=pie height=350 class="mt-10 mb-10" :options="analyticsData.customersPie.chartOptions" :series="analyticsData.customersPie.series" />

                        <!-- CHART DATA -->
                        <ul class="mb-1">
                            <li v-for="customerData in analyticsData.customersPie.analyticsData" :key="customerData.customerType" class="flex justify-between py-3 px-6 ">
                                <span class="flex items-center ">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2" :class="`bg-${customerData.color}`"></span>
                                    <span class="font-semibold">{{ customerData.customerType }}</span>
                                </span>
                                <span>{{ customerData.counts }}</span>
                            </li>
                        </ul>
                    </div>

                </vx-card>
            </div>


        </div>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/dashboard/statistics-cards/StatisticsCardLine.vue'
import analyticsData from '@/components/dashboard/analyticsData.js'
import ChangeTimeDurationDropdown from '@/components/dashboard/ChangeTimeDurationDropdown.vue'

export default{
    data() {
        return {
            subscribersGained: {},
            revenueGenerated: {},
            quarterlySales: {},
            ordersRecevied: {},

            revenueComparisonLine: {},
            goalOverview: {},

            browserStatistics: [],
            clientRetentionBar: {},

            sessionsData: {},
            chatLog: [],
            chatMsgInput: '',
            customersData: {},

            analyticsData: analyticsData,
            settings: { // perfectscrollbar settings
                maxScrollbarLength: 60,
                wheelSpeed: .60,
            },
        }
    },
    components: {
        VueApexCharts,
        StatisticsCardLine,
        VuePerfectScrollbar,
        ChangeTimeDurationDropdown
    },
    mounted() {
        this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight;
    },

    // created() {
    //   // Subscribers gained - Statistics
    //   this.$http.get("/api/card/card-statistics/subscribers")
    //     .then((response) => { this.subscribersGained = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Revenue Generated
    //   this.$http.get("/api/card/card-statistics/revenue")
    //     .then((response) => { this.revenueGenerated = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Sales
    //   this.$http.get("/api/card/card-statistics/sales")
    //     .then((response) => { this.quarterlySales = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Orders - Statistics
    //   this.$http.get("/api/card/card-statistics/orders")
    //     .then((response) => { this.ordersRecevied = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Revenue Comparison
    //   this.$http.get("/api/card/card-analytics/revenue-comparison")
    //     .then((response) => { this.revenueComparisonLine = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Goal Overview
    //   this.$http.get("/api/card/card-analytics/goal-overview")
    //     .then((response) => { this.goalOverview = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Browser Analytics
    //   this.$http.get("/api/card/card-analytics/browser-analytics")
    //     .then((response) => { this.browserStatistics = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Client Retention
    //   this.$http.get("/api/card/card-analytics/client-retention")
    //     .then((response) => { this.clientRetentionBar = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Sessions By Device
    //   this.$http.get("/api/card/card-analytics/session-by-device")
    //     .then((response) => { this.sessionsData = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Chat Log
    //   this.$http.get("/api/chat/demo-1/log")
    //     .then((response) => { this.chatLog = response.data })
    //     .catch((error) => { console.log(error) })

    //   // Customers
    //   this.$http.get("/api/card/card-analytics/customers")
    //     .then((response) => { this.customersData = response.data })
    //     .catch((error) => { console.log(error) })
    // }
}
</script>

<style lang="scss">
.chat-card-log {
    height: 400px;

    .chat-sent-msg {
        background-color: #f2f4f7 !important;
    }
}
</style>
