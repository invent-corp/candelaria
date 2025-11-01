<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="endereco_ptm.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ endereco_ptm.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Endereço: {{ endereco_ptm.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="endereco_ptm.descricao"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Código " class="w-full" icon-pack="feather" icon="icon-tag" label-placeholder="Código Endereço" v-model="endereco_ptm.codigo"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Código ')">{{ errors.first('Código ') }}</div>
        
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="endereco_ptm.situacao" :options="['Ativo', 'Inativo']"/>
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
            endereco_ptm: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_endereco_ptm
            if(id != undefined) {
            axios.get(`${backendUrl}/enderecoptm/${id}`)
                .then(res => {this.endereco_ptm = res.data
                })
            }
        },
        save() {
            const method = this.endereco_ptm.id_endereco_ptm ? 'put' : 'post'
            const id = this.endereco_ptm.id_endereco_ptm ? `/${this.endereco_ptm.id_endereco_ptm}` : ''
            axios[method](`${backendUrl}/enderecoptm${id}`, this.endereco_ptm)
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
            this.endereco_ptm = {}
            this.$router.push("/interface/enderecoPtm/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Endereço Atualizado',
				text: 'Endereço Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/enderecoPtm/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_endereco_ptm
            if(id !== undefined) {
            axios.get(`${backendUrl}/enderecoptm/${id}`)
                .then(res => {this.endereco_ptm = res.data})
            } else {
            this.endereco_ptm = {}
            }
        },
    },
    computed:{
        color_situacao() {
            if (this.endereco_ptm.situacao === "Ativo") return "success"
            else if (this.endereco_ptm.situacao === "Inativo") return "danger"
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

<style lang="scss">
</style>