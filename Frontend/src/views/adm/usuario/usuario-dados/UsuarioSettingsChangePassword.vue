<template>

    <vx-card no-shadow>

        <div class="flex flex-wrap items-center mb-base">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" :text="usuario.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ usuario.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Usuário: {{ usuario.nome }}</p>
            </div>
        </div>

        <vs-input v-validate="'required'" name="Senha " class="w-full" icon-pack="feather" icon="icon-lock" label-placeholder="Senha" :type="'password'" v-model="usuario.senha" />
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Senha ')">{{ errors.first('Senha ') }}</div>
        <div class="mb-6"/>
        <vs-input v-validate="'required|confirmed:Senha '" name="Confirmação " data-vv-as="Senha " class="w-full" icon-pack="feather" icon="icon-lock" label-placeholder="Confirme a Senha" :type="'password'" v-model="usuario.confirmacaoSenha" />
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Confirmação ')">{{ errors.first('Confirmação ') }}</div>
        <div class="mb-6"/>

        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click.prevent="submitForm" @click="save" >Salvar</vs-button>
            <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning"
                @click="reset">Cancelar</vs-button>
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
            confirmed: field => 'O campo ' + field + ' é obrigatório.',
        }
    }
}

Validator.localize(dictionary)
const validator = new Validator({ password: 'required' })
validator.localize('br')


export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario: [],
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_usuario
            if(id !== undefined) {
            axios.get(`${backendUrl}/usuario/${id}`)
                .then(res => {this.usuario = res.data})
            }
        },
        save() {
            var senhaDigitada = this.usuario.senha
            var confirmaDigitada = this.usuario.confirmacaoSenha
            if ( senhaDigitada !== undefined && confirmaDigitada !== undefined && senhaDigitada === confirmaDigitada ) {
                const method = this.usuario.id_usuario ? 'put' : 'post'
                const id = this.usuario.id_usuario ? `/${this.usuario.id_usuario}` : ''
                axios[method](`${backendUrl}/senha${id}`, this.usuario)
                    .then(() => {
                        this.showUpdateSuccess()
                        this.reload()
                    })
                    .catch(err => { console.error(err) })
            } else {
                this.$vs.notify({
                    title: 'Erro',
                    text: "Verifique a Senha Digitada e Confirmação!",
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
				})
            }
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
            this.$router.push("/pages/refresh/")
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Senha Atualizada',
				text: 'Senha atualizada com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/adm/usuario/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_usuario
            if(id !== undefined) {
            axios.get(`${backendUrl}/usuario/${id}`)
                .then(res => {this.usuario = res.data})
            } else {
            this.usuario = {}
            }
        },
    },
    computed:{
        color_situacao() {
            if (this.usuario.situacao === "Ativo") return "success"
            else if (this.usuario.situacao === "Inativo") return "danger"
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
