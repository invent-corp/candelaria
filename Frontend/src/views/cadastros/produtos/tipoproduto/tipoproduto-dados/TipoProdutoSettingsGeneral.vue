<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="tipoproduto.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ tipoproduto.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Tipo Produto: {{ tipoproduto.descricao }}</p>
            </div>
        </div>

        
        <vs-input class="w-full " icon-pack="feather" icon="icon-list" label-placeholder="Descrição" v-model="tipoproduto.descricao"></vs-input>
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="tipoproduto.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
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
            tipoproduto: {},
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_tipo_produto
            if(id !== undefined) {
            axios.get(`${backendUrl}/tipoproduto/${id}`)
                .then(res => {this.tipoproduto = res.data})
            }
        },
        save() {
            const method = this.tipoproduto.id_tipo_produto ? 'put' : 'post'
            const id = this.tipoproduto.id_tipo_produto ? `/${this.tipoproduto.id_tipo_produto}` : ''
            axios[method](`${backendUrl}/tipoproduto${id}`, this.tipoproduto)
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
            this.tipoproduto = {}
            this.$router.push("/cadastros/produtos/tipoproduto/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Tipo Produto Atualizado',
				text: 'Tipo Produto Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/produtos/tipoproduto/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_tipo_produto
            console.log(id)
            if(id !== undefined) {
            axios.get(`${backendUrl}/tipoproduto/${id}`)
                .then(res => {this.tipoproduto = res.data})
            } else {
            this.tipoproduto = {}
            }
        }, 
    },
    computed:{
        color_situacao() {
            if (this.tipoproduto.situacao === "Ativo") return "success"
            else if (this.tipoproduto.situacao === "Inativo") return "danger"
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