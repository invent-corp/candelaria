<template>

	<vx-card title="Grupo de Acesso X Acesso">

		<div class="flex flex-wrap items-center ">
			<vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="grupo.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_Situacao" > {{ grupo.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Grupo de Acesso: {{ grupo.nome }}</p>
            </div>
        </div>
		<p >Arraste e Solte - Adicione o(s) <code>Acesso(s)</code> aos <code>Acesso(s) Participante(s)</code> no grupo atual:</p>

		<div class="vx-row">
			<div class="vx-col w-full md:w-1/2 mt-2">
				<vs-list>
					<vs-list-header title="Acesso(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="grupoAcesso" group="Acesso" >
							<vs-list-item  v-for="(listItem, index) in grupoAcesso" :key="index"
								:title="listItem.nome" :subtitle="listItem.codigo + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.codigo.toString()" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
			<div class="vx-col w-full md:w-1/2 mt-2 " >
				<vs-list >
					<vs-list-header title="Acesso(s) Participante(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="acessoParticipante" group="Acesso" >
							<vs-list-item v-for="(listItem, index) in acessoParticipante" :key="index"
								:title="listItem.nome" :subtitle="listItem.codigo + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.codigo.toString()" :color="((listItem.situacao == 'Ativo') ? 'primary' : 'danger')" />
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
                :click="reset_cadastro">Reset Cadastro</vs-button>
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
			grupo: [],
            grupoAcesso: [],
            acessoParticipante: []
        }
    },
    components: {
		'v-select': vSelect,
        draggable,
        Prism
    },
    methods: {
        load_Data() {
			this.acessoParticipante = []
			const id = this.$route.params.id_grupo
			
			if(id !== undefined) {

            var adm = ''
			var verifica = this.$store.state.AppActiveUsuario.admin
			if (verifica == 'Sim') {
				adm = "'"
			} else {
				adm = "Sim"
			}

			axios.get(`${backendUrl}/acessoAtivo/${adm}`)
			.then(res => {this.grupoAcesso = res.data})
            
            axios.get(`${backendUrl}/grupoAcesso/${id}`)
                .then(res => {this.acessoParticipante = res.data})

            axios.get(`${backendUrl}/grupo/${id}`)
                .then(res => {this.grupo = res.data})
			}		
        },
		save()  {
			this.save_Update()
			this.show_Success()
			this.reload_grupoAcesso()
			this.reload()		
        },
		save_Update() {
			this.delete_Acessos()
			setTimeout(()=>{
				for (var i in this.acessoParticipante) {				
				var grupoAcesso = `{"id_grupo":"${this.grupo.id_grupo}", "id_acesso":"${this.acessoParticipante[i].id_acesso}"}`
				grupoAcesso = JSON.parse(grupoAcesso)		
				axios.post(`${backendUrl}/grupoAcesso/`, grupoAcesso)	
					.catch(err => { console.error(err) })
				}
			},1000)	
		},
		delete_Acessos() {	
			const id = this.$route.params.id_grupo
			axios.delete(`${backendUrl}/grupoAcesso/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reset_Limpar() {
            this.acessoParticipante = []
			this.save_Update()
			this.reload_grupoAcesso()
			this.show_Success()
			var adm = ''
			var verifica = this.$store.state.AppActiveUsuario.admin
			if (verifica == 'Sim') {
				adm = "'"
			} else {
				adm = "Sim"
			}
			axios.get(`${backendUrl}/acessoAtivo/${adm}`)
			.then(res => {this.grupoAcesso = res.data})
        },
		reload_grupoAcesso() {
			this.refresh_grupoAcesso = this.grupoAcesso.filter( acesso1 => !this.acessoParticipante.filter( acesso2 => acesso1.id_acesso == acesso2.id_acesso).length);
			this.grupoAcesso = this.refresh_grupoAcesso
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
            this.$router.push("/adm/grupo/consulta/").catch(() => {})
        },
		reset_comp() {
            const id = this.$route.params.id_grupo
            if(id !== undefined) {
			axios.get(`${backendUrl}/grupo/${id}`)
                .then(res => {this.grupo = res.data})
            } else {
				this.grupo = {}
				this.grupoAcesso = {}			
				this.acessoParticipante = {}
            }
        },
    },
    mounted() {
        this.load_Data()	
    },
	computed: {
        color_Situacao() {
			const id = this.$route.params.id_grupo
            if(id !== undefined) {
				if (this.grupo.situacao === "Ativo") return "success"
				else if (this.grupo.situacao === "Inativo") return "danger"
			}
		},
		reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },	
	},
	beforeUpdate() {
		this.reload_grupoAcesso()
	}
}

</script>

