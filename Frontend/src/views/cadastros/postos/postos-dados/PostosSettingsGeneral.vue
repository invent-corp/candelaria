<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="postos.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ postos.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Posto: {{ postos.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="postos.descricao"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <div class="mt-2">
            <label class="text-sm">Pad Picking</label>
            <v-select v-validate="'required'" name="Pad Picking " class="text-sm" placeholder="Selecione" v-model="postos.pad_picking" :options="['Sim', 'Não']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Pad Picking ')">{{ errors.first('Pad Picking ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Finalização Manual</label>
            <v-select v-validate="'required'" name="Finalização Manual " class="text-sm" placeholder="Selecione" v-model="postos.finalizacao_manual" :options="['Sim', 'Não']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Finalizaçao Manual ')">{{ errors.first('Finalização Manual ') }}</div>
        </div>

        <vs-input v-validate="'numeric'" name="Qtde. Colunas " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Qtde. Colunas" v-model="postos.qtde_colunas"></vs-input>
        <div class="text-primary text-sm mb-6" v-show="errors.has('Qtde. Colunas ')">{{ errors.first('Qtde. Colunas ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'numeric'" name="Qtde.Max.End.Picking" class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Qtde.Max.End.Picking" v-model="postos.qtde_max_picking"></vs-input>
        <div class="text-primary text-sm mb-6" v-show="errors.has('Qtde.Max.End.Picking ')">{{ errors.first('Qtde.Max.End.Picking ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'numeric'" name="Qtde.Max.Prod.Picking" class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Qtde.Max.Prod.Picking" v-model="postos.qtde_max_prod_picking"></vs-input>
        <div class="text-primary text-sm mb-6" v-show="errors.has('Qtde.Max.Prod.Picking ')">{{ errors.first('Qtde.Max.Prod.Picking ') }}</div>
        <div class="mb-6"/>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="postos.situacao" :options="['Ativo', 'Inativo']"/>
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
            postos: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_posto
            if(id != undefined) {
            axios.get(`${backendUrl}/postos/${id}`)
                .then(res => {this.postos = res.data
                })
            }
        },

        save() {
            const method = this.postos.id_posto ? 'put' : 'post'
            const id = this.postos.id_posto ? `/${this.postos.id_posto}` : ''
            axios[method](`${backendUrl}/postos${id}`, this.postos)
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
            this.postos = {}
            this.$router.push("/cadastros/postos/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Posto Atualizado',
				text: 'Posto Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/postos/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_posto
            if(id !== undefined) {
            axios.get(`${backendUrl}/postos/${id}`)
                .then(res => {this.postos = res.data})
            } else {
            this.postos = {}
            }
        }
    },
    
    computed:{
        color_situacao() {
            if (this.postos.situacao === "Ativo") return "success"
            else if (this.postos.situacao === "Inativo") return "danger"
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        }   

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