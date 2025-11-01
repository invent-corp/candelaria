<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="coletor.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ coletor.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >coletor: {{ coletor.nome }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Nome " class="w-full" icon-pack="feather" icon="icon-rss" label-placeholder="Nome" v-model="coletor.nome"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
        <div class="mb-6"/>

        <vs-input class="w-full" icon-pack="feather" icon="icon-list" label-placeholder="Descrição" v-model="coletor.descricao"></vs-input>
        <div class="mb-6"/>

        <vs-input v-validate="'required|ip'" name="IP " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="IP" v-model="coletor.ip"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('IP ')">{{ errors.first('IP ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Porta " class="w-full " icon-pack="feather" icon="icon-server" label-placeholder="Porta" v-model="coletor.porta"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Porta ')">{{ errors.first('Porta ') }}</div>
        
        <div class="mt-2">
            <label class="text-sm">Picking</label>
            <v-select v-validate="'required'" name="Picking " class="text-sm" placeholder="Selecione" v-model="coletor.picking" :options="[1, 2]"/>
            <div class="text-primary text-sm w-full" v-show="errors.has('Picking ')">{{ errors.first('Picking ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm " placeholder="Selecione" v-model="coletor.situacao" :options="['Ativo', 'Inativo']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Situação ')">{{ errors.first('Situação ') }}</div>
        </div>


        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click.prevent="submitForm" @click="save">Salvar</vs-button>
            <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning"
                @click="reset">Novo</vs-button>
            <vs-button v-show=false
                :click="reset_cadastro">Reset Cadastro</vs-button>
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
            coletor: {},
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_coletor
            if(id !== undefined) {
            axios.get(`${backendUrl}/coletor/${id}`)
                .then(res => {this.coletor = res.data})
            }
        },
        save() {
            const method = this.coletor.id_coletor ? 'put' : 'post'
            const id = this.coletor.id_coletor ? `/${this.coletor.id_coletor}` : ''
            axios[method](`${backendUrl}/coletor${id}`, this.coletor)
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
        reset() {
            this.coletor = {}
            this.$router.push("/interface/coletor/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Coletor Atualizado',
				text: 'Coletor atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/coletor/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_coletor
            if(id !== undefined) {
            axios.get(`${backendUrl}/coletor/${id}`)
                .then(res => {this.coletor = res.data})
            } else {
            this.coletor = {}
            }
        }, 
    },
    computed:{
        color_situacao() {
            if (this.coletor.situacao === "Ativo") return "success"
            else if (this.coletor.situacao === "Inativo") return "danger"
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },   
    },
    mounted() {
        this.loadData()    
    },
}

</script>