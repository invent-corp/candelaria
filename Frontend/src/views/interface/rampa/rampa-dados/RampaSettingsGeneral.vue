<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="rampa.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ rampa.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Rampa: {{ rampa.nome }}</p>
            </div>
        </div>

        <vs-input v-validate="'required'" name="Nome " class="w-full" icon-pack="feather" icon="icon-users" label-placeholder="Nome" v-model="rampa.nome"></vs-input>
        <div class="text-primary text-sm w-full " v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
               
        <div class="mt-8">
            <vs-input v-validate="'required|numeric'" name="Número " class="w-full" icon-pack="feather" icon="icon-list" label-placeholder="Número" v-model="rampa.numero_rampa"></vs-input>
            <div class="text-primary text-sm w-full " v-show="errors.has('Número ')">{{ errors.first('Número ') }}</div>
        </div>
        
        <div class="mt-2">
            <label class="text-sm">Descrição</label>
            <v-select v-validate="'required'" name="Descrição " v-model="rampa.descricao" placeholder="Selecione" :options="['Lado Direito', 'Lado Esquerdo']"/>
            <div class="text-primary text-sm w-full " v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="rampa.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
            <div class="text-primary text-sm w-full " v-show="errors.has('Situação ')">{{ errors.first('Situação ') }}</div>
        </div>


        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click.prevent="submitForm" @click="save" >Salvar</vs-button>
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
            numeric: field => 'O campo ' + field + ' pode conter apenas caracteres númericos.',
            required: field => 'O campo ' + field + ' é obrigatório.'
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
            rampa: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_rampa
            if(id !== undefined) {
            axios.get(`${backendUrl}/rampa/${id}`)
                .then(res => {this.rampa = res.data})
            }
        },
        save() {
            const method = this.rampa.id_rampa ? 'put' : 'post'
            const id = this.rampa.id_rampa ? `/${this.rampa.id_rampa}` : ''
            axios[method](`${backendUrl}/rampa${id}`, this.rampa)
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
            this.rampa = {}
            this.$router.push("/interface/rampa/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Rampa Atualizada',
				text: 'Rampa atualizada com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/rampa/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_rampa
            if(id !== undefined) {
            axios.get(`${backendUrl}/rampa/${id}`)
                .then(res => {this.rampa = res.data})
            } else {
            this.rampa = {}
            }
        }, 
    },
    computed:{
        color_situacao() {
            const id = this.$route.params.id_rampa
            if(id !== undefined) {
                if (this.rampa.situacao === "Ativo") return "success"
                else if (this.rampa.situacao === "Inativo") return "danger"
            }
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },      
    },
    mounted() {
        this.loadData()   
    }
}

</script>