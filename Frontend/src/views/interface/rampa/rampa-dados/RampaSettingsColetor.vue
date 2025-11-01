<template>

	<vx-card title="Rampa X Coletor">

		<div class="flex flex-wrap items-center ">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" :text="rampa.nome"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_Situacao" > {{ rampa.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap font-medium mb-4 mt-4 sm:mt-0" >Rampa: {{ rampa.nome }}</p>
            </div>
        </div>
		<p >Arraste e Solte - Adicione o(s) <code>Coletor(es)</code> aos <code>Coletor(es) Vinculado(s)</code> na Rampa atual:</p>

		<div class="vx-row">
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Coletor(es)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="coletorAtivo" group="Coletor">
							<vs-list-item v-for="(listItem, index) in coletorAtivo" :key="index"
								:title="listItem.nome" :subtitle="listItem.descricao + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.nome" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Coletor(es) Vinculado(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="coletorVinculado" group="Coletor">
							<vs-list-item v-for="(listItem, index) in coletorVinculado" :key="index"
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
			rampa: [],
            coletorAtivo: [],
            coletorVinculado: []
        }
    },
    components: {
		'v-select': vSelect,
        draggable,
        Prism
    },
    methods: {
        load_Data() {
			this.coletorVinculado = []
			const id = this.$route.params.id_rampa

			if(id !== undefined) {
			
			axios.get(`${backendUrl}/rampa/${id}`)
                .then(res => {this.rampa = res.data})

            axios.get(`${backendUrl}/coletorAtivo`)
				.then(res => {this.coletorAtivo = res.data})

            axios.get(`${backendUrl}/rampaColetor/${id}`)
                .then(res => {this.coletorVinculado = res.data})

			}		
        },
		save() {
			this.save_Update()
			this.show_Success()
			this.reload_Coletor()
			this.reload()		
        },
		save_Update() {
			this.delete_Coletores()
			setTimeout(()=>{
				for (var i in this.coletorVinculado) {				
					var rampaColetor = `{"id_rampa":"${this.rampa.id_rampa}", "id_coletor":"${this.coletorVinculado[i].id_coletor}"}`
					rampaColetor = JSON.parse(rampaColetor)			
					axios.post(`${backendUrl}/rampaColetor/`, rampaColetor)	
						.catch(err => { console.error(err) })
				}
			},1000)	
		},
		delete_Coletores() {
			const id = this.$route.params.id_rampa
			axios.delete(`${backendUrl}/rampaColetor/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reset_Limpar() {
            this.coletorVinculado = []
			this.delete_Coletores()
			this.reload_Coletor()
			this.show_Success()
			axios.get(`${backendUrl}/coletorAtivo`)
            .then(res => {this.coletorAtivo = res.data})		            
        },
		reload_Coletor() {
			this.refresh_Coletor = this.coletorAtivo.filter( coletor1 => !this.coletorVinculado.filter( coletor2 => coletor1.id_coletor == coletor2.id_coletor).length);
			this.coletorAtivo = this.refresh_Coletor
		},
		show_Success() {
			this.$vs.notify({
				icon: "check",
				color: 'success',
				title: 'Coletor Atualizado',
				text: 'Coletor atualizado com Sucesso!'
			})
		},
		reload() {
            this.$router.push("/interface/rampa/consulta/").catch(() => {})
        },
		reset_comp() {
            const id = this.$route.params.id_rampa
            if(id !== undefined) {
			axios.get(`${backendUrl}/rampa/${id}`)
                .then(res => {this.rampa = res.data})
            } else {
				this.rampa = {}
				this.coletorAtivo = {}
				this.coletorVinculado = {}				
            }
        },
    },
    mounted() {
        this.load_Data()	
    },
	computed: {
		color_Situacao() {
			const id = this.$route.params.id_rampa
			if(id !== undefined) {
				if (this.rampa.situacao === "Ativo") return "success"
				else if (this.rampa.situacao === "Inativo") return "danger"
			}
		},
		reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        }, 
	},
	beforeUpdate() {
		this.reload_Coletor()
	}
}

</script>