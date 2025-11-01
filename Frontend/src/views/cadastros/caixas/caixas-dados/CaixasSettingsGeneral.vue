<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="caixas.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ caixas.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Caixa: {{ caixas.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="caixas.descricao"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <vs-input name="Número " class="w-full" icon-pack="feather" icon="icon-tag" label-placeholder="Número Caixa" v-model="caixas.numero"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Número ')">{{ errors.first('Número ') }}</div>
        <div class="mb-6"/>
        
        <vs-input v-validate="'required|decimal'" name="Peso Caixa " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Peso (Caixa)" v-model="caixas.peso_caixa"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Peso Caixa ')">{{ errors.first('Peso Caixa ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|decimal'" name="Peso Suportavel " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Peso Suportável (KG)" v-model="caixas.peso_suportavel"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Peso Suportavel ')">{{ errors.first('Peso Suportavel ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Altura " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Altura" v-model="caixas.altura"></vs-input>
        <div class="text-primary text-sm mb-6" v-show="errors.has('Altura ')">{{ errors.first('Altura ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Largura " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Largura" v-model="caixas.largura"></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('Largura ')">{{ errors.first('Largura ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Comprimento " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Comprimento" v-model="caixas.comprimento"></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('Comprimento ')">{{ errors.first('Comprimento ') }}</div>
        <div class="mb-6"/>

        <vs-input disabled v-validate="'numeric'" name="CM3 " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="CM3" v-model=calcula_cm3></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('CM3 ')">{{ errors.first('CM3 ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|decimal'" name="% Ocupação " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="% Ocupação" v-model="caixas.perc_ocupacao"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('% Ocupação ')">{{ errors.first('% Ocupação ') }}</div>
        <div class="mb-6"/>

        <vs-input disabled v-validate="'numeric'" name="CM3 Ocupável " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="CM3 Ocupável" v-model="calcula_cm3_ocupavel"></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('CM3 Ocupável ')">{{ errors.first('CM3 Ocupável ') }}</div>
        <div class="mb-6"/>

        <div class="mt-2">
            <label class="text-sm">Tamanho</label>
            <v-select v-validate="'required'" name="Tamanho " class="text-sm" placeholder="Selecione" v-model="caixas.tamanho" :options="['Pequena', 'Média', 'Grande']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Tamanho ')">{{ errors.first('Tamanho ') }}</div>
        </div>
    
        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="caixas.situacao" :options="['Ativo', 'Inativo']"/>
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
            caixas: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_caixas
            if(id != undefined) {
            axios.get(`${backendUrl}/caixas/${id}`)
                .then(res => {this.caixas = res.data
                })
            }
        },

        save() {
            const method = this.caixas.id_caixas ? 'put' : 'post'
            const id = this.caixas.id_caixas ? `/${this.caixas.id_caixas}` : ''
            axios[method](`${backendUrl}/caixas${id}`, this.caixas)
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
            this.$router.push("/cadastros/caixas/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Caixa Atualizada',
				text: 'Caixa Atualizada com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/caixas/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_caixas
            if(id !== undefined) {
            axios.get(`${backendUrl}/caixas/${id}`)
                .then(res => {this.caixas = res.data})
            } else {
            this.caixas = {}
            }
        },
    },
    
    computed:{
        color_situacao() {
            if (this.caixas.situacao === "Ativo") return "success"
            else if (this.caixas.situacao === "Inativo") return "danger"
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },   

        calcula_cm3 : function() {
          this.caixas.cm3 = this.caixas.altura * this.caixas.comprimento * this.caixas.largura
          if (isNaN(this.caixas.cm3)) {
             this.caixas.cm3 = 0
          }
          return this.caixas.cm3
        },

        calcula_cm3_ocupavel : function() {
          this.caixas.cm3_ocupacao = this.caixas.cm3 * this.caixas.perc_ocupacao / 100
          if (isNaN(this.caixas.cm3_ocupacao)) {
             this.caixas.cm3_ocupacao = 0
          }
          return this.caixas.cm3_ocupacao
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