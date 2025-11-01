<template>

	<vx-card title="Usuário X Grupo de Acesso">

		<div class="flex flex-wrap items-center ">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" :text="usuario.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_Situacao" > {{ usuario.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Usuário: {{ usuario.nome }}</p>
            </div>
        </div>
		<p >Arraste e Solte - Adicione o(s) <code>Grupo(s) de Acesso(s)</code> ao(s) <code>Grupo(s) Vinculado(s)</code> no usuário atual:</p>

		<div class="vx-row">
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Grupo(s) de Acesso(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="grupoAtivo" group="Acesso">
							<vs-list-item v-for="(listItem, index) in grupoAtivo" :key="index"
								:title="listItem.nome" :subtitle="listItem.descricao + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.nome" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Grupo(s) Vinculado(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="grupoVinculado" group="Acesso">
							<vs-list-item v-for="(listItem, index) in grupoVinculado" :key="index"
								:title="listItem.nome" :subtitle="listItem.descricao + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.nome" :color="((listItem.situacao == 'Ativo') ? 'primary' : 'danger')" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
		</div>

		<div class="flex flex-wrap items-center justify-end mt-base">
			<vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
			@click="save" >Salvar</vs-button>
			<vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning" 
			@click="reset_Limpar">Limpar</vs-button>
			<vs-button v-show=false
                @click="reset_cadastro">Reset Cadastro</vs-button>
		</div>

	</vx-card>

</template>

<script>

import axios from 'axios'
import { backendUrl } from '@/globalComponents'
import vSelect from 'vue-select'
import draggable from 'vuedraggable'
import Prism from 'vue-prism-component'

export default {
    data() {
        return {
			usuario: [],
			grupoAtivo: [],
            grupoVinculado: []
        }
    },
    components: {
		'v-select': vSelect,
        draggable,
        Prism
    },
    methods: {
        load_Data() {
			this.grupoVinculado = []
			const id = this.$route.params.id_usuario
			

			if(id !== undefined) {

			axios.get(`${backendUrl}/usuario/${id}`)
			.then(res => {this.usuario = res.data})
			
			var adm = ''
			var verifica = this.$store.state.AppActiveUsuario.admin
			if (verifica == 'Sim') {
				adm = "'"
			} else {
				adm = "Sim"
			}

			axios.get(`${backendUrl}/grupoAtivo/${adm}`)
				.then(res => {this.grupoAtivo = res.data})

			axios.get(`${backendUrl}/usuarioGrupo/${id}`)
			.then(res => {this.grupoVinculado = res.data})

			}		
        },
		save() {
			this.save_Update()
			this.show_Success()
			this.reload_grupoAcesso()
			this.reload()		
        },
		save_Update() {
			this.delete_Grupos()
			setTimeout(()=>{
				for (var i in this.grupoVinculado) {				
					var relacaoUsuario = `{"id_usuario":"${this.usuario.id_usuario}", "id_grupo":"${this.grupoVinculado[i].id_grupo}"}`
					relacaoUsuario = JSON.parse(relacaoUsuario)			
					axios.post(`${backendUrl}/usuarioGrupo/`, relacaoUsuario)	
						.catch(err => { console.error(err) })
				}
			},1000)	
		},
		delete_Grupos() {
			const id = this.$route.params.id_usuario
			axios.delete(`${backendUrl}/usuarioGrupo/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reset_Limpar() {
            this.grupoVinculado = []
			this.delete_Grupos()
			this.reload_grupoAcesso()
			this.show_Success()
			var adm = ''
			var verifica = this.$store.state.AppActiveUsuario.admin
			if (verifica == 'Sim') {
				adm = "'"
			} else {
				adm = "Sim"
			}
			axios.get(`${backendUrl}/grupoAtivo/${adm}`)
            .then(res => {this.grupoAtivo = res.data})		            
        },
		reset_cadastro() {
            const id = this.$route.params.id_usuario
            if(id !== undefined) {
			axios.get(`${backendUrl}/usuario/${id}`)
                .then(res => {this.usuario = res.data})
            } else {
				this.usuario = {}
				this.grupoAtivo = {}
				this.grupoVinculado = {}				
            }
        },
		reload_grupoAcesso() {
			this.refresh_grupoAcesso = this.grupoAtivo.filter( grupo1 => !this.grupoVinculado.filter( grupo2 => grupo1.id_grupo == grupo2.id_grupo).length);
			this.grupoAtivo = this.refresh_grupoAcesso
		},
		show_Success() {
			this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Grupo Atualizado',
				text: 'Grupo de Acesso atualizado com Sucesso!'
			})
		},
		reload() {
            this.$router.push("/adm/usuario/consulta/").catch(() => {})
        }
    },
    mounted() {
        this.load_Data()	
    },
	computed: {
		color_Situacao() {
			const id = this.$route.params.id_usuario
			if(id !== undefined) {
				if (this.usuario.situacao === "Ativo") return "success"
				else if (this.usuario.situacao === "Inativo") return "danger"
			}
		}
	},
	beforeUpdate() {
		this.reload_grupoAcesso()
	}
}

</script>