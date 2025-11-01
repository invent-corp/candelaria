<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="acesso.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ acesso.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Acesso: {{ acesso.nome }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Nome " class="w-full" icon-pack="feather" icon="icon-log-in" label-placeholder="Nome" v-model="acesso.nome"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Código " class="w-full" icon-pack="feather" icon="icon-list" label-placeholder="Código" v-model="acesso.codigo"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Código ')">{{ errors.first('Código ') }}</div>
        <div class="mb-4"/>

        <div class="mt-2">
            <label class="text-sm">Administrador</label>
            <v-select v-validate="'required'" name="Admin " v-model="acesso.admin" placeholder="Selecione" :options="['Sim', 'Não']"></v-select>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Admin ')">{{ errors.first('Admin ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="acesso.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
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
        'v-select': vSelect,
    },
    data() {
        return {
            acesso: {},
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_acesso
            if(id !== undefined) {
            axios.get(`${backendUrl}/acesso/${id}`)
                .then(res => {this.acesso = res.data})
            }
        },
        save() {
            const method = this.acesso.id_acesso ? 'put' : 'post'
            const id = this.acesso.id_acesso ? `/${this.acesso.id_acesso}` : ''
            axios[method](`${backendUrl}/acesso${id}`, this.acesso)
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
                } else {
                    console.log('Corrija os Campos!')
                }
            })
        },
        reset() {
            this.acesso = {}
            this.$router.push("/adm/sistema/acesso/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Acesso Atualizado',
				text: 'Acesso atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/adm/sistema/acesso/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_acesso
            if(id !== undefined) {
            axios.get(`${backendUrl}/acesso/${id}`)
                .then(res => {this.acesso = res.data})
            } else {
            this.acesso = {}
            }
        }, 
    },
    computed: {
        color_situacao() {
            if (this.acesso.situacao === "Ativo") return "success"
            else if (this.acesso.situacao === "Inativo") return "danger"
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