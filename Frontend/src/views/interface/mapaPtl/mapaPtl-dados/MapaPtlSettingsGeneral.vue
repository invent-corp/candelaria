<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="mapaPtl.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ mapaPtl.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Mapa PTL: {{ mapaPtl.nome }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Nome " class="w-full" icon-pack="feather" icon="icon-globe" label-placeholder="Nome" v-model="mapaPtl.nome"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
        <div class="mb-6"/>
        
        <vs-input class="w-full " icon-pack="feather" icon="icon-list" label-placeholder="Descrição" v-model="mapaPtl.descricao"></vs-input>
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="mapaPtl.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
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
            mapaPtl: {},
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_mapa_ptl
            if(id !== undefined) {
            axios.get(`${backendUrl}/mapaPtl/${id}`)
                .then(res => {this.mapaPtl = res.data})
            }
        },
        save() {
            const method = this.mapaPtl.id_mapa_ptl ? 'put' : 'post'
            const id = this.mapaPtl.id_mapa_ptl ? `/${this.mapaPtl.id_mapa_ptl}` : ''
            axios[method](`${backendUrl}/mapaPtl${id}`, this.mapaPtl)
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
            this.mapaPtl = {}
            this.$router.push("/interface/mapaPtl/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Mapa PTL Atualizado',
				text: 'Mapa PTL atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/mapaPtl/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_mapa_ptl
            if(id !== undefined) {
            axios.get(`${backendUrl}/mapaPtl/${id}`)
                .then(res => {this.mapaPtl = res.data})
            } else {
            this.mapaPtl = {}
            }
        }, 
    },
    computed:{
        color_situacao() {
            if (this.mapaPtl.situacao === "Ativo") return "success"
            else if (this.mapaPtl.situacao === "Inativo") return "danger"
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