<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="mapaptm.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ mapaptm.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Mapa PTM: {{ mapaptm.nome }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Nome " class="w-full" icon-pack="feather" icon="icon-globe" label-placeholder="Nome" v-model="mapaptm.nome"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
        <div class="mb-6"/>
        
        <vs-input class="w-full " icon-pack="feather" icon="icon-list" label-placeholder="Descrição" v-model="mapaptm.descricao"></vs-input>
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="mapaptm.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
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
            mapaptm: {},
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_mapa_ptm
            if(id !== undefined) {
            axios.get(`${backendUrl}/mapaPtm/${id}`)
                .then(res => {this.mapaptm = res.data})
            }
        },
        save() {
            const method = this.mapaptm.id_mapa_ptm ? 'put' : 'post'
            const id = this.mapaptm.id_mapa_ptm ? `/${this.mapaptm.id_mapa_ptm}` : ''
            axios[method](`${backendUrl}/mapaPtm${id}`, this.mapaptm)
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
            this.mapaptm = {}
            this.$router.push("/interface/mapaPtm/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Mapa PTM Atualizado',
				text: 'Mapa PTM atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/mapaPtm/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_mapa_ptm
            if(id !== undefined) {
            axios.get(`${backendUrl}/mapaPtm/${id}`)
                .then(res => {this.mapaptm = res.data})
            } else {
            this.mapaptm = {}
            }
        }, 
    },
    computed:{
        color_situacao() {
            if (this.mapaptm.situacao === "Ativo") return "success"
            else if (this.mapaptm.situacao === "Inativo") return "danger"
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