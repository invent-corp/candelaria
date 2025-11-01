<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="picking.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ picking.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Picking: {{ picking.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="picking.descricao"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Código " class="w-full" icon-pack="feather" icon="icon-tag" label-placeholder="Código Picking" v-model="picking.codigo"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Código ')">{{ errors.first('Código ') }}</div>
        
        <div class="mt-2">
            <label class="text-sm">Coletor</label>
            <v-select v-validate="'required'" name="Coletor " class="text-sm" placeholder="Selecione" v-model="picking.coletor" :options="[1, 2]"/>
            <div class="text-primary text-sm w-full" v-show="errors.has('Coletor ')">{{ errors.first('Coletor ') }}</div>
        </div>
        
        <div class="mt-2 cbx_gateway">
            <label class="text-sm" >Gateway</label>
            <v-select v-validate="'required'" name="Gateway " class="text-sm " placeholder="Selecione" v-model="picking.id_gateway" :options=gateways :reduce="nome => nome.id_gateway" :menu-props="{ top: true, offsetY: true }" label="nome">
                <template #option="{ nome, ip, porta }">
                    {{ nome }}
                    <br />
                    <h class="ml-4">IP: </h>
                    <h class="font-bold">{{ ip }} | </h>
                    <h>Porta: </h>
                     <h class="font-bold">{{ porta }} </h>
                </template>
            </v-select>
            <div class="text-primary text-sm w-full" v-show="errors.has('Gateway ')">{{ errors.first('Gateway ') }}</div>
            <div class="mb-2"/>
        </div>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="picking.situacao" :options="['Ativo', 'Inativo']"/>
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

var id_pickingGatewayAtivo = ""

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
            picking: [],
            gateways: [],
            id_pickingGatewayAtivo: ""
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_picking
            if(id != undefined) {
            axios.get(`${backendUrl}/picking/${id}`)
                .then(res => {this.picking = res.data
                id_pickingGatewayAtivo = this.picking.id_gateway
                this.loadGateway()
                })
            }
        },
        loadGateway() {
            const id = this.$route.params.id_picking
            id_pickingGatewayAtivo = this.picking.id_gateway
            if (id == undefined) {
                axios.get(`${backendUrl}/gatewayAtivo/0`)
                    .then(res => (this.gateways = res.data))
            } else {
                axios.get(`${backendUrl}/gatewayAtivo/${id_pickingGatewayAtivo}`)
                    .then(res => (this.gateways = res.data))
            }
        },
        save() {
            const method = this.picking.id_picking ? 'put' : 'post'
            const id = this.picking.id_picking ? `/${this.picking.id_picking}` : ''
            axios[method](`${backendUrl}/picking${id}`, this.picking)
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
            this.picking = {}
            this.$router.push("/interface/picking/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Picking Atualizado',
				text: 'Picking Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/interface/picking/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_picking
            if(id !== undefined) {
            axios.get(`${backendUrl}/picking/${id}`)
                .then(res => {this.picking = res.data})
            } else {
            this.picking = {}
            }
        },
    },
    computed:{
        color_situacao() {
            if (this.picking.situacao === "Ativo") return "success"
            else if (this.picking.situacao === "Inativo") return "danger"
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },   
    },
    mounted() {
        this.loadGateway()
        this.loadData()    
    },
    beforeUpdate() {
        if(id_pickingGatewayAtivo != this.picking.id_gateway) {
            this.loadGateway()
        }
    }
}

</script>

<style lang="scss">
.cbx_gateway {
    .vs__dropdown-menu {
        // TAMANHO COMBOBOX
        height: 130px;
    }
}
</style>