<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="transportadoras.razao_social"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ transportadoras.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Transportadora: {{ transportadoras.razao_social }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Razão Social " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Razão Social" v-model="transportadoras.razao_social"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Razão Social ')">{{ errors.first('Razão Social ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Nome Fantasia " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Nome Fantasia" v-model="transportadoras.nome_fantasia"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Nome Fantasia ')">{{ errors.first('Nome Fantasia ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Cnpj " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Cnpj" v-model="transportadoras.cnpj"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Cnpj ')">{{ errors.first('Cnpj ') }}</div>
        <div class="mb-6"/>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="transportadoras.situacao" :options="['Ativo', 'Inativo']"/>
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
            transportadoras: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_transportadoras
            if(id != undefined) {
            axios.get(`${backendUrl}/transportadoras/${id}`)
                .then(res => {this.transportadoras = res.data
                })
            }
        },

        save() {
            const method = this.transportadoras.id_transportadoras ? 'put' : 'post'
            const id = this.transportadoras.id_transportadoras ? `/${this.transportadoras.id_transportadoras}` : ''
            axios[method](`${backendUrl}/transportadoras${id}`, this.transportadoras)
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
            this.transportadoras = {}
            this.$router.push("/cadastros/transportadora/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Transportadora Atualizada',
				text: 'Transportadora Atualizada com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/transportadora/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_transportadoras
            if(id !== undefined) {
            axios.get(`${backendUrl}/transportadoras/${id}`)
                .then(res => {this.transportadoras = res.data})
            } else {
            this.transportadoras = {}
            }
        },
    },
    
    computed:{
        color_situacao() {
            if (this.transportadoras.situacao === "Ativo") return "success"
            else if (this.transportadoras.situacao === "Inativo") return "danger"
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