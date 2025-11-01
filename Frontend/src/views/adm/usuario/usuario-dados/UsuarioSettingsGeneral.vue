<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center mb-base">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="usuario.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ usuario.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-6 mt-4 sm:mt-0" >Usuário: {{ usuario.nome }}</p>
            </div>
        </div>               

        <vs-input v-validate="'required|alpha'" name="Nome " class="w-full" icon-pack="feather" icon="icon-user" label-placeholder="Nome" v-model="usuario.nome"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Nome ')">{{ errors.first('Nome ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Login " class="w-full" icon-pack="feather" icon="icon-log-in" label-placeholder="Login" v-model="usuario.login"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Login ')">{{ errors.first('Login ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|email'" name="Email " class="w-full" icon-pack="feather" icon="icon-mail" label-placeholder="E-mail" v-model="usuario.email"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Email ')">{{ errors.first('Email ') }}</div>
        <div class="mb-6"/>
        
        <div v-if="this.$store.state.AppActiveUsuario.admin == 'Sim'" class="mt-2">
            <label class="text-sm " >Administrador</label>
            <v-select v-model="usuario.admin" placeholder="Selecione" :options="['Não', 'Sim']"/>
        </div>

        <div v-if="this.$route.meta.pageTitle !== 'Perfil'" class="mt-2 cbx_funcao">
            <label class="text-sm" >Função</label>
            <v-select v-validate="'required'" name="Função " placeholder="Selecione" v-model="usuario.id_funcao" :options=funcoes :reduce="nome => nome.id_funcao" label="nome"  />
            <div class="text-primary text-sm w-full" v-show="errors.has('Função ')">{{ errors.first('Função ') }}</div>
        </div>
        
        <div v-if="this.$route.meta.pageTitle !== 'Perfil'" class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " v-model="usuario.situacao" placeholder="Selecione" :options="['Ativo', 'Inativo']"/>
            <div class="text-primary text-sm w-full" v-show="errors.has('Situação ')">{{ errors.first('Situação ') }}</div>
        </div>

        <label class="text-sm " >Libera Conferência</label>
            <v-select v-model="usuario.libera_conferencia" placeholder="Selecione" :options="['Não', 'Sim']"/>

        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click.prevent="submitForm" @click="save" >Salvar</vs-button>
            <vs-button v-if="this.$route.meta.pageTitle !== 'Perfil'" class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning"
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

var id_funcaoAtiva = ""

const dictionary = {
    br: {
        messages:{
            alpha: field => 'O campo ' + field + ' pode conter apenas caracteres alfabéticos.',
            required: field => 'O campo ' + field + ' é obrigatório.',
            email: field => 'O ' + field + ' não é válido.'
        }
    }
}

// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'alpha' })
validator.localize('br')

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario: [],
            funcoes: [],
            id_funcaoAtiva: "",
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_usuario
            if(id !== undefined) {
            axios.get(`${backendUrl}/usuario/${id}`)
                .then(res => {this.usuario = res.data
                id_funcaoAtiva = this.usuario.id_funcao
                this.loadFuncao()
                })
            }
        },
        loadFuncao() {
            const id = this.$route.params.id_usuario
            id_funcaoAtiva = this.usuario.id_funcao
            if (id == undefined) {
                axios.get(`${backendUrl}/funcaoAtiva/0`)
                    .then(res => (this.funcoes = res.data))
            } else {
                axios.get(`${backendUrl}/funcaoAtiva/${id_funcaoAtiva}`)
                    .then(res => (this.funcoes = res.data))
            }
        },
        save() {
            console.log(this.usuario)
            const method = this.usuario.id_usuario ? 'put' : 'post'
            const id = this.usuario.id_usuario ? `/${this.usuario.id_usuario}` : ''
            console.log(this.usuario)
            axios[method](`${backendUrl}/usuario${id}`, this.usuario)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => {
                    if(err.message === "Request failed with status code 500"
                    & this.usuario.login !== undefined) 
                    {
                        this.$vs.notify({
                        icon: "error",
                        color: 'danger',
                        title: 'ERRO',
                        text: 'Login definido já está sendo Utilizado!',
                        })
                    }
                })
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
            this.usuario = {}
            this.$router.push("/adm/usuario/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Usuário Atualizado',
				text: 'Usuário atualizado com Sucesso!'
			})
		},
        reload() {
            if (this.$route.meta.pageTitle == 'Perfil') {
                this.$router.push("/home").catch(() => {})
            } else {
                this.$router.push("/adm/usuario/consulta/").catch(() => {})
            }
        },
        reset_comp() {
            const id = this.$route.params.id_usuario
            if(id !== undefined) {
            axios.get(`${backendUrl}/usuario/${id}`)
                .then(res => {this.usuario = res.data})
            } else {
                this.usuario = {}
                this.grupoAcesso = {}
				this.grupoParticipante = {}	
            }
        },
    },
    computed:{
        color_situacao() {
            const id = this.$route.params.id_usuario
			if(id !== undefined) {
                if (this.usuario.situacao === "Ativo") return "success"
                else if (this.usuario.situacao === "Inativo") return "danger"
            }
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },
    },
    mounted() {
        this.loadFuncao()
        this.loadData()
    },
    beforeUpdate() {
        if(id_funcaoAtiva != this.usuario.id_funcao) {
            this.loadFuncao()
        }
    }
}

</script>

<style lang="scss">
.cbx_funcao {
    .vs__dropdown-menu {
        // TAMANHO COMBOBOX
        height: 120px;
    }
}
</style>