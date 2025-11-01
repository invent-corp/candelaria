<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey icon-pack="feather" icon="icon-settings"/>
            <div>
                <p class="text-lg flex flex-wrap items-center justify-start text-primary" >Configurações do Sistema</p>
            </div>
        </div>
        <div class="mb-base"/>

        <vs-input v-validate="'required|ip'" name="IP " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="IP PLC" v-model="config.ip_plc"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('IP ')">{{ errors.first('IP ') }}</div>
        <div class="mb-8"/>

        <vs-input v-validate="'required|numeric'" name="Porta Log " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Porta Log" v-model="config.porta_plc_log"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Porta Log ')">{{ errors.first('Porta Log ') }}</div>
        <div class="mb-8"/>

        <vs-input v-validate="'required|numeric'" name="Porta Vol " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Porta Vol" v-model="config.porta_plc_vol"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Porta Vol ')">{{ errors.first('Porta Vol ') }}</div>
        <div class="mb-8"/>

        <vs-input v-validate="'required|numeric'" name="Porta Sinal " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Porta Sinaleiro" v-model="config.porta_plc_sinal"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Porta Sinal ')">{{ errors.first('Porta Sinal ') }}</div>
        <div class="mb-2"/>
        
        <div class="mt-2"> 
            <label class="text-sm">Sorter</label>
                <v-select v-model="config.sorter" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>
        
        <div class="mt-2">
            <label class="text-sm">PTL</label>
            <v-select v-model="config.ptl" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>

        <div class="mt-2">
            <label class="text-sm">Picking</label>
            <v-select v-model="config.picking" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>

        <div class="mt-2">
            <label class="text-sm">Coletor</label>
            <v-select v-model="config.coletor" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>

        <div class="mt-2">
            <label class="text-sm">Picking X Coletor</label>
            <v-select v-model="config.picking_coletor" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>

        <div class="mt-2">
            <label class="text-sm">Modo Debug (SORTER)</label>
            <v-select v-model="config.modo_debug" placeholder="Selecione" :options="['Sim', 'Não']"/>
        </div>

        <vs-input v-validate="'numeric'" name="Saida Inicial " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Saida Inicial" v-model="config.saida_inicial"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Saida Inicial ')">{{ errors.first('Saida Inicial ') }}</div>
        <div class="mb-8"/>

        <vs-input v-validate="'numeric'" name="Saida Final " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Saida Final" v-model="config.saida_final"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Saida Final ')">{{ errors.first('Saida Final ') }}</div>
        <div class="mb-8"/>


        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click.prevent="submitForm" @click="save">Salvar</vs-button>
        </div>

    </vx-card>

</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'
import vSelect from 'vue-select'
import { Validator } from 'vee-validate'

const dictionary = {
    br: {
        messages:{
            required: field => 'O campo ' + field + ' é obrigatório.',
            ip: field => 'O valor do ' + field + ' não é válido.',
            numeric: field => 'O campo ' + field + ' pode conter apenas caracteres numéricos.',
        }
    }
}

// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'required' })
validator.localize('br')

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            config: {},
        }
    },
    methods: {
        loadData() {
            axios.get(`${backendUrl}/config/`)
                .then(res => {this.config = res.data})
        },
        save() {
            const method = this.config.id_config ? 'put' : 'post'
            const id = this.config.id_config ? `/${this.config.id_config}` : ''
            axios[method](`${backendUrl}/config${id}`, this.config)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => { console.error(err) })
        },
        submitForm() {
            this.$validator.validateAll().then(result => {
                if(result) {
                    console.log('Campos Validados!')
                }else{
                    console.log('Corrija os Campos!')
                }
            })
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Configurações Atualizadas',
				text: 'Configurações Atualizadas com Sucesso!'
			})
            this.$vs.dialog({
                color: 'primary',
                title: 'Reinicie o Sistema',
                text: `Reinicie o Sistema, para carregar as novas Configurações!`,
                acceptText: 'OK'							
            })
		},
        reload() {
            this.$router.push("/home").catch(() => {})
        },
    },
    mounted() {
        this.loadData()    
    },
}

</script>