<template>
    <vx-card no-shadow>
        
        <div class="vx-row">
            <p class="text-lg vx-col text-primary"> Status do Serviço PLC </p>
            <vs-input disabled v-model="statusplc" label="PLC" class="vx-col w-full" icon-pack="feather" icon="icon-play-circle"></vs-input>
            <vs-progress color="primary" class="sm:mr-4 sm:ml-4 mt-2" :percent="percent_plc" id="progressPLC"></vs-progress>
            <vs-button color=grey class="text-sm sm:ml-4 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-check-circle"
               @click="status_plc">Status</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-stop-circle"
                @click="stop_plc">Parar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-play-circle"
                @click="start_plc">Iniciar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-arrow-up-circle"
                @click="restart_plc">Reiniciar</vs-button>
        </div>

        <div class="mb-8"/>
        <vs-divider/>

        <div class="vx-row">
            <p class="text-lg vx-col text-primary"> Status do Serviço PTL </p>
            <vs-input disabled v-model="statusptl" label="PTL" class="vx-col w-full" icon-pack="feather" icon="icon-play-circle"></vs-input>
            <vs-progress color="primary" class="sm:mr-4 sm:ml-4 mt-2" :percent="percent_ptl" id="progressPTL"></vs-progress>
            <vs-button color=grey class="text-sm sm:ml-4 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-check-circle"
                @click="status_ptl">Status</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-stop-circle"
                @click="stop_ptl">Parar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-play-circle"
                @click="start_ptl">Iniciar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-arrow-up-circle"
                @click="restart_ptl">Reiniciar</vs-button>
        </div>

        <div class="mb-8"/>
        <vs-divider/>

        <div class="vx-row">
            <p class="text-lg vx-col text-primary"> Status do Serviço WebService </p>
            <vs-input disabled v-model="statuswebservice" label="WebService" class="vx-col w-full" icon-pack="feather" icon="icon-play-circle"></vs-input>
            <vs-progress color="primary" class="sm:mr-4 sm:ml-4 mt-2" :percent="percent_webservice" id="progresswebservice"></vs-progress>
            <vs-button color=grey class="text-sm sm:ml-4 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-check-circle"
                @click="status_webservice">Status</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-stop-circle"
                @click="stop_webservice">Parar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-play-circle"
                @click="start_webservice">Iniciar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-arrow-up-circle"
                @click="restart_webservice">Reiniciar</vs-button>
        </div>

        <div class="mb-8"/>
        <vs-divider/>

        <div class="vx-row">
            <p class="text-lg vx-col text-primary"> Status do Serviço WebService Retorno </p>
            <vs-input disabled v-model="statuswebserviceretorno" label="WebService Retorno" class="vx-col w-full" icon-pack="feather" icon="icon-play-circle"></vs-input>
            <vs-progress color="primary" class="sm:mr-4 sm:ml-4 mt-2" :percent="percent_webserviceretorno" id="progresswebserviceretorno"></vs-progress>
            <vs-button color=grey class="text-sm sm:ml-4 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-check-circle"
                @click="status_webserviceretorno">Status</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-stop-circle"
                @click="stop_webserviceretorno">Parar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-play-circle"
                @click="start_webserviceretorno">Iniciar</vs-button>
            <vs-button color=grey class="text-sm sm:ml-2 w-32 h-8 mt-4 justify-center" icon-pack="feather" icon="icon-arrow-up-circle"
                @click="restart_webserviceretorno">Reiniciar</vs-button>
        </div>

        <div class="mt-8" />
 
    </vx-card>

</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'

export default {
    data() {
        return {
            statusplc: {},
            statusptl: {},
            statuswebservice: {},
            statuswebserviceretorno: {},
            servico_plc: '',
            servico_ptl: '',
            servico_webservice: '',
            servico_webserviceretorno: '',
            percent_plc: 0,
            percent_ptl: 0,
            percent_webservice: 0,
            percent_webserviceretorno: 0
        }
    },
    methods: {
        status_plc() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/statusplc`)
                .then(res => {this.statusplc = res.data
                    this.servico_plc = this.statusplc.substring(31,21)
                    this.statusplc = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusplc
                })
        },
        stop_plc() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/stopplc`)
            .then(res => {this.statusplc = res.data
                this.servico_plc = this.statusplc.substring(31,21)
                this.statusplc = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusplc
                this.contagem_plc()
            })
        },
        start_plc() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/startplc`)
            .then(res => {this.statusplc = res.data
                this.servico_plc = this.statusplc.substring(33,21)
                this.statusplc = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusplc
                this.contagem_plc()
            })
        },
        restart_plc() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/restartplc`)
            .then(res => {this.statusplc = res.data
                this.servico_plc = this.statusplc.substring(35,21)
                this.statusplc = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusplc
                this.contagem_plc()
            })
        },
        status_ptl() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/statusptl`)
                .then(res => {this.statusptl = res.data
                    this.servico_ptl = this.statusptl.substring(31,21)
                    this.statusptl = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusptl
                })
        },
        stop_ptl() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/stopptl`)
            .then(res => {this.statusptl = res.data
                this.servico_ptl = this.statusptl.substring(31,21)
                this.statusptl = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusptl
                this.contagem_ptl()
            })
        },
        start_ptl() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/startptl`)
            .then(res => {this.statusptl = res.data
                this.servico_ptl = this.statusptl.substring(33,21)
                this.statusptl = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusptl
                this.contagem_ptl()
            })
        },
        restart_ptl() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/restartptl`)
            .then(res => {this.statusptl = res.data
                this.servico_ptl = this.statusptl.substring(35,21)
                this.statusptl = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statusptl
                this.contagem_ptl()
            })
        },
        status_webservice() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/statuswebservice`)
                .then(res => {this.statuswebservice = res.data
                    this.servico_webservice = this.statuswebservice.substring(31,28)
                    this.statuswebservice = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebservice
                })
        },
        stop_webservice() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/stopwebservice`)
            .then(res => {this.statuswebservice = res.data
                this.servico_webservice = this.statuswebservice.substring(31,28)
                this.statuswebservice = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebservice
                this.contagem_webservice()
            })
        },
        start_webservice() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/startwebservice`)
            .then(res => {this.statuswebservice = res.data
                this.servico_webservice = this.statuswebservice.substring(33,28)
                this.statuswebservice = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebservice
                this.contagem_webservice()
            })
        },
        restart_webservice() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/restartwebservice`)
            .then(res => {this.statuswebservice = res.data
                this.servico_webservice = this.statuswebservice.substring(35,28)
                this.statuswebservice = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebservice
                this.contagem_webservice()
            })
        },
        status_webserviceretorno() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/statuswebserviceretorno`)
                .then(res => {this.statuswebserviceretorno = res.data
                    this.servico_webserviceretorno = this.statuswebserviceretorno.substring(31,36)
                    this.statuswebserviceretorno = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebserviceretorno
                })
        },
        stop_webserviceretorno() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/stopwebserviceretorno`)
            .then(res => {this.statuswebserviceretorno = res.data
                this.servico_webserviceretorno = this.statuswebserviceretorno.substring(31,36)
                this.statuswebserviceretorno = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebserviceretorno
                this.contagem_webserviceretorno()
            })
        },
        start_webserviceretorno() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/startwebserviceretorno`)
            .then(res => {this.statuswebserviceretorno = res.data
                this.servico_webserviceretorno = this.statuswebserviceretorno.substring(33,36)
                this.statuswebserviceretorno = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebserviceretorno
                this.contagem_webserviceretorno()
            })
        },
        restart_webserviceretorno() {
            var data = new Date();
            var hora = data.getHours()
            var min = data.getMinutes()
            var seg = data.getSeconds()
            var str_hora = hora + ':' + min + ':' + seg
            axios.get(`${backendUrl}/restartwebserviceretorno`)
            .then(res => {this.statuswebserviceretorno = res.data
                this.servico_webserviceretorno = this.statuswebserviceretorno.substring(35,36)
                this.statuswebserviceretorno = '( Atualizado às ' + str_hora + ' h )  -  ' + this.statuswebserviceretorno
                this.contagem_webserviceretorno()
            })
        },
        contagem_plc() {
            this.interval_plc = setInterval(() => {
                if (this.percent_plc >= 100){
                    this.status_plc()
                    this.percent_plc = 0
                    return clearInterval(this.interval_plc)
                } else {
                   this.percent_plc++
                }
            }, 200)
        },
        contagem_ptl() {
            this.interval_ptl = setInterval(() => {
                if (this.percent_ptl >= 100){
                    this.status_ptl()
                    this.percent_ptl = 0
                    return clearInterval(this.interval_ptl)
                } else {
                   this.percent_ptl++
                }
            }, 200)
        },
        contagem_webservice() {
            this.interval_webservice = setInterval(() => {
                if (this.percent_webservice >= 100){
                    this.status_webservice()
                    this.percent_webservice = 0
                    return clearInterval(this.interval_webservice)
                } else {
                   this.percent_webservice++
                }
            }, 200)
        },
        contagem_webserviceretorno() {
            this.interval_webserviceretorno = setInterval(() => {
                if (this.percent_webserviceretorno >= 100){
                    this.status_webserviceretorno()
                    this.percent_webserviceretorno = 0
                    return clearInterval(this.interval_webserviceretorno)
                } else {
                   this.percent_webserviceretorno++
                }
            }, 200)
        },
    },
    beforeDestroy () {
        clearInterval(this.interval_plc)
        clearInterval(this.interval_ptl)
        clearInterval(this.interval_webservice)
        clearInterval(this.interval_webserviceretorno)
    },
    computed: {
        color_servico_plc() {
            if (this.servico_plc === "Executando") return "success"
            else if (this.servico_plc === "Parando..." || this.servico_plc === "Iniciando..." || this.servico_plc === "Reiniciando...") return "danger"
            else if (this.servico_plc !== "Executando") return ""
            
        },
        color_servico_ptl() {
            if (this.servico_ptl === "Executando") return "success"
            else if (this.servico_ptl === "Parando..." || this.servico_ptl === "Iniciando..." || this.servico_ptl === "Reiniciando...") return "danger"
            else if (this.servico_ptl !== "Executando") return ""
        },
        color_servico_webservice() {
            if (this.servico_webservice === "Executando") return "success"
            else if (this.servico_webservice === "Parando..." || this.servico_webservice === "Iniciando..." || this.servico_webservice === "Reiniciando...") return "danger"
            else if (this.servico_webservice !== "Executando") return ""
        },
        color_servico_webserviceretorno() {
            if (this.servico_webserviceretorno === "Executando") return "success"
            else if (this.servico_webserviceretorno === "Parando..." || this.servico_webserviceretorno === "Iniciando..." || this.servico_webserviceretorno === "Reiniciando...") return "danger"
            else if (this.servico_webserviceretorno !== "Executando") return ""
        },

    },
    mounted() {
        this.status_plc()
        this.status_ptl() 
        this.status_webservice() 
        this.status_webserviceretorno() 
    },
}

</script>
