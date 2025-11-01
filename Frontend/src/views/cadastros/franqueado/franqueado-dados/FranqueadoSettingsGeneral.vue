<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="franqueado.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ franqueado.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Franqueado: {{ franqueado.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="franqueado.descricao"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <vs-input name="Codigo " class="w-full" icon-pack="feather" icon="icon-tag" label-placeholder="Código" v-model="franqueado.codigo"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Codigo ')">{{ errors.first('Codigo ') }}</div>
        <div class="mb-6"/>
        
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="franqueado.situacao" :options="['Ativo', 'Inativo']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Situação ')">{{ errors.first('Situação ') }}</div>
        </div>


        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click="submitForm">Salvar</vs-button>
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
            decimal: field => 'O campo ' + field + ' pode conter apenas caracteres númericos ou ponto (.)',
            numeric: field => 'O campo ' + field + ' pode conter apenas números'
        }
    }
}


// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'decimal' })
validator.localize('br')

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            franqueado: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_franqueado
            if(id != undefined) {
            axios.get(`${backendUrl}/franqueado/${id}`)
                .then(res => {this.franqueado = res.data
                })
            }
        },

        save() {
            const method = this.franqueado.id_franqueado ? 'put' : 'post'
            const id = this.franqueado.id_franqueado ? `/${this.franqueado.id_franqueado}` : ''
            axios[method](`${backendUrl}/franqueado${id}`, this.franqueado)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => { console.error(err) })
        },
        submitForm() {
            this.$validator.validateAll().then(result => {
                if(result) {
                    this.save()
                    
                }else{
                    console.log('Corrija os Campos!')
                }
            })
        
        },
        reset() {
            this.caixas = {}
            this.$router.push("/cadastros/franqueado/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Franqueado Atualizado',
				text: 'Franqueado Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/franqueado/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_franqueado
            if(id !== undefined) {
            axios.get(`${backendUrl}/franqueado/${id}`)
                .then(res => {this.franqueado = res.data})
            } else {
            this.franqueado = {}
            }
        },
    },
    
    computed:{
        color_situacao() {
            if (this.franqueado.situacao === "Ativo") return "success"
            else if (this.franqueado.situacao === "Inativo") return "danger"
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
.cbx_gateway {
    .vs__dropdown-menu {
        // TAMANHO COMBOBOX
        height: 130px;
    }
}

.ladoalado {
    float: left;
    height: 200px;
}
</style>