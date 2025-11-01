<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey text="Etiqueta"/>
            <div>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Etiqueta: {{ Etiqueta }}</p>
            </div>
        </div>

        <vs-input id="etiqueta" v-validate="'required|not_starts_with_fr'" name="Etiqueta " class="w-full" icon-pack="feather" icon="icon-rss" label-placeholder="Etiqueta" v-model="Etiqueta"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Etiqueta ')">{{ errors.first('Etiqueta ') }}</div>
        <div class="mb-8"/>

        <vs-input disabled class="w-full text-primary" icon-pack="feather" icon="icon-info" label-placeholder="STATUS" v-model="excecao.resultado"></vs-input>
        <div class="mb-8"/>

        <vs-input disabled class="w-full text-primary" icon-pack="feather" icon="icon-truck" label-placeholder="DESTINO" v-model="excecao.destino"></vs-input>
        
        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click="submitForm" >Salvar</vs-button>
            <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning"
                @click="reset">Novo</vs-button>
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
            numeric: field => 'O campo ' + field + ' pode conter apenas caracteres numéricos.',
            not_starts_with_fr: field => 'O campo ' + field + ' não pode ser um Fracionado.' // a nova mensagem de erro

        }
    }
}

// Override and merge the dictionaries
Validator.localize(dictionary)

// Extendendo o validador com a nova regra
Validator.extend('not_starts_with_fr', {
    validate: value => !value.toLowerCase().startsWith('fr') // validação insensível a maiúsculas e minúsculas
});

const validator = new Validator({ nome: 'required' })
validator.localize('br')

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            excecao: [],
        }
    },
    methods: {
        loadData() {
            const inputEle = document.getElementById("etiqueta")
            inputEle.addEventListener('keydown', function(e){
                var key = e.key
                if (key == 'Enter') {
                    document.getElementById("peso").focus() 
                }
            })
        },
        save() {
            var valor_Etiqueta = this.Etiqueta
            var valor_Peso = 0
            var valor_Largura = 0
            var valor_Altura = 0
            var valor_Comprimento = 0

            axios.get(`${backendUrl}/opExcecao/${valor_Etiqueta}&${valor_Peso}&${valor_Largura}&${valor_Altura}&${valor_Comprimento}`)
            .then(res => {
                this.excecao = res.data
                if (this.excecao.resultado == "VOLUME GRAVADO COM SUCESSO") {
                    this.showUpdateSuccess()
                } else {
                    this.showUpdateError()
                }
            })
            .catch(err => { 
                console.error(err) 
                this.showCatchError()
            })
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
            this.Etiqueta = ""
            this.Peso = ""
            this.Largura = ""
            this.Altura = ""
            this.Comprimento = ""
            this.excecao = {}
            
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Volume Atualizado',
				text: 'Volume atualizado com Sucesso!'
			})
		},
        showUpdateError() {
			this.$vs.notify({
                icon: 'close',
				color: 'danger',
				title: 'ERRO na Atualização',
				text: 'Atualização NÃO Realizada!'
			})
		},
        showCatchError() {
			this.$vs.notify({
                icon: 'close',
				color: 'danger',
				title: 'ERRO na Atualização',
				text: 'Dados inseridos inválidos! Atualização NÃO Realizada!'
			})
		},
    },
    mounted() {
        this.loadData()
        document.getElementById("etiqueta").focus()             
    },
}

</script>