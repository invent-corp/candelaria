<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar v-if="situacao == 'Inativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey />
            <vs-avatar v-if="situacao == 'Ativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey :text="(sorter.mapa_sorter) + ' x ' + (sorter.rampa)"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color=color_Situacao > {{ situacao }} </vs-chip>
                <label v-if="situacao == 'Ativo'" class="text-lg flex flex-wrap items-center justify-start" >Sorter: {{sorter.mapa_sorter + ' x ' + sorter.rampa }}</label>
            </div>
        </div>

        <div class="mt-2 cbx_sorter">
            <label class="text-sm" >Mapa Sorter</label>
            <v-select placeholder="Selecione" v-model="sorter.id_mapa_sorter" :options=mapasSorters :reduce="nome => nome.id_mapa_sorter" :menu-props="{ top: true, offsetY: true }" label="nome" >
                <template #option="{ nome, descricao, situacao }">
                    {{ nome }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Descrição: </h>
                    <h class="font-bold">{{ descricao }}</h>
                </template>
            </v-select>
        </div>

        <div class="mt-2 cbx_sorter">
            <label class="text-sm" >Rampa</label>
            <v-select placeholder="Selecione" v-model="sorter.id_rampa" :options=rampas :reduce="nome => nome.id_rampa" :menu-props="{ top: true, offsetY: true }" label="nome"  >
                <template #option="{ nome, descricao, situacao }">
                    {{ nome }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Descrição: </h>
                    <h class="font-bold">{{ descricao }}</h>
                </template>
                <span slot="no-options">Todas Rampas para esse Mapa já foram cadastradas!</span>
            </v-select>
        </div>

        <div class="mt-8" />

		<p v-if=" situacao == 'Ativo' ">Arraste e Solte - Adicione a(s) <code>Rota(s)</code> as <code>Rota(s) Vinculada(s)</code> no Sorter atual:</p>

		<div v-if=" situacao == 'Ativo' " class="vx-row">
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Rota(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="rotaAtiva" group="Rota">
							<vs-list-item v-for="(listItem, index) in rotaAtiva" :key="index"
								:title="listItem.descricao" :subtitle="listItem.codigo + ' | ' + listItem.cod_inicial + ' | ' + listItem.cod_final + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.descricao" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
			<div class="vx-col w-full md:w-1/2 mt-2" >
				<vs-list>
					<vs-list-header title="Rota(s) Vinculado(s)" color="primary"></vs-list-header>
					<div class="mt-5">
						<draggable style="max-height:300px" class="p-2 cursor-move overflow-y-auto" :list="rotaVinculada" group="Rota">
							<vs-list-item v-for="(listItem, index) in rotaVinculada" :key="index"
								:title="listItem.descricao" :subtitle="listItem.codigo + ' | ' + listItem.cod_inicial + ' | ' + listItem.cod_final + ' | ' + listItem.situacao" >
								<vs-avatar slot="avatar" :text="listItem.descricao" :color="((listItem.situacao == 'Ativo') ? 'primary' : 'danger')" />
							</vs-list-item>
						</draggable>
					</div>
				</vs-list>
			</div>
		</div>

        <div class="mt-8" v-if=" situacao == 'Ativo' "/>
        <div class="mt-8" v-else-if=" situacao == 'Inativo' " style="min-height:100px"/>
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click="save">Salvar</vs-button>
            <vs-button id="meuElemento" class="ml-4 mt-2" icon-pack="feather" icon="icon-refresh-cw" type="border" color="warning"
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
import draggable from 'vuedraggable'
import Prism from 'vue-prism-component'

var id_ms = ""
var id_msa = ""
var id_rampa = ""

export default {
    components: {
        'v-select': vSelect,
        draggable,
        Prism
    },
    data() {
        return {
            sorter: [],
            mapasSorters: [],
            rampas: [],
            rampasAtivas: [],
            rotaAtiva: [],
            rotaVinculada: [],
            situacao: "",
            id_ms: "",
            id_msa: "",
            id_rampa: ""
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_sorter   
            if (id != undefined) {
                axios.get(`${backendUrl}/sorter/${id}`)
                    .then(res => {this.sorter = res.data
                    id_ms = this.sorter.id_mapa_sorter
                    this.loadRotaAtiva()
                    this.loadMapasSorters()
                    this.loadRampas()
                    }) 
                this.loadRotaVincu()
            }
            this.loadRotaAtiva() 
        },
        loadMapasSorters() {
            const id = this.$route.params.id_sorter
            id_msa = this.sorter.id_mapa_sorter
            if (id == undefined) {
                axios.get(`${backendUrl}/mapaSorterAtivo/0`)
                    .then(res => {this.mapasSorters = res.data})
            } else {
               axios.get(`${backendUrl}/mapaSorterAtivo/${id_msa}`)
                    .then(res => {this.mapasSorters = res.data}) 
            }
        },
        loadRampas() {
            id_msa = this.sorter.id_mapa_sorter
            if (this.sorter.id_rampa == undefined) {
                axios.get(`${backendUrl}/rampaAtivaSorter/0&${id_msa}`)
                    .then(res => {this.rampas = res.data})
            } else {
                id_rampa = this.sorter.id_rampa
                axios.get(`${backendUrl}/rampaAtivaSorter/${id_rampa}&${id_msa}`)
                    .then(res => {this.rampas = res.data})   
            }
        },
        loadRotaAtiva() {
            id_msa = this.sorter.id_mapa_sorter
            axios.get(`${backendUrl}/rotaAtivaSorter/${id_ms}`)
				.then(res => {this.rotaAtiva = res.data})
        },
        loadRotaVincu() {
            const id = this.$route.params.id_sorter
            axios.get(`${backendUrl}/rotaSorter/${id}`)
                .then(res => {this.rotaVinculada = res.data})
        },
        save() {
            const method = this.sorter.id_sorter ? 'put' : 'post'
            const id = this.sorter.id_sorter ? `/${this.sorter.id_sorter}` : ''
            axios[method](`${backendUrl}/sorter${id}`, this.sorter)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => { 
                    if(err.message === "Request failed with status code 500" 
                    & this.sorter.id_mapa_sorter !== undefined & this.sorter.id_rampa !== undefined) {
                        this.$vs.notify({
                        icon: "error",
                        color: 'danger',
                        title: 'ERRO',
                        text: 'Relação Mapa Sorter X Rampa já Existe!',
                        })
                    }
                })
            const id_params = this.$route.params.id_sorter
            if(id_params !== undefined) {
                if(this.rotaVinculada !== {}) {
                    this.deleteRotas()                
                    setTimeout(()=>{
                        for (var i in this.rotaVinculada) {				
                            var rotaSorter = `{"id_sorter":"${this.sorter.id_sorter}", "id_rota":"${this.rotaVinculada[i].id_rota}"}`
                            rotaSorter = JSON.parse(rotaSorter)			
                            axios.post(`${backendUrl}/rotaSorter/`, rotaSorter)
                                .then( console.log('OK'))	
                                .catch(err => { console.error(err) })
                        }
                        this.$router.push("/interface/sorter/consulta/").catch(() => {})
                    },1000)
                }
            }
        },
        deleteRotas() {
			const id = this.$route.params.id_sorter
			axios.delete(`${backendUrl}/rotaSorter/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reload() {
            const id = this.$route.params.id_sorter
            if(id === undefined) {
                var mapaSorterId = this.sorter.id_mapa_sorter
                var rampaId = this.sorter.id_rampa
                if (mapaSorterId !== undefined & rampaId !== undefined) {
                    axios.get(`${backendUrl}/sorterCadastro/${mapaSorterId}&${rampaId}`)
                        .then(res => {this.sorterCadastro = res.data		
                        var sorterId = this.sorterCadastro.id_sorter
                        this.$router.push(`/interface/sorter/cadastro/${sorterId}/`).catch(() => {})
                        this.$router.push(`/pages/refresh/`).catch(() => {}) 
                        }
                        )
                }
            }
        },
        reload_Rota() {            
            this.refresh_Rota = this.rotaAtiva.filter( rota1 => !this.rotaVinculada.filter( rota2 => rota1.id_rota == rota2.id_rota).length);
            this.rotaAtiva = this.refresh_Rota
		},
        reset() {
            this.sorter = {}
            this.rotaAtiva = {}
            this.rotaVinculada = {}
            this.$router.push("/interface/sorter/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Sorter Atualizado',
				text: 'Sorter Atualizado com Sucesso!',
			})
		},
        reset_comp() {
            const id = this.$route.params.id_sorter
            if(id !== undefined) {
                const id = this.$route.params.id_sorter
                axios.get(`${backendUrl}/rotaSorter/${id}`)
                    .then(res => {this.rotaVinculada = res.data})
                axios.get(`${backendUrl}/sorter/${id}`)
                    .then(res => {this.sorter = res.data})
                axios.get(`${backendUrl}/rotaAtivaSorter/${id_ms}`)
                    .then(res => {this.rotaAtiva = res.data})
            } 
            if(id === undefined) {
                this.sorter = {}
            }
        },
    },
    computed:{
        color_Situacao() {
            const id = this.$route.params.id_sorter
			if(id === undefined) {
				if (this.situacao === "Inativo") return "danger"

			} else {               
				if (this.situacao === "Ativo") return "success"
            }
		},
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },   
    },
    mounted() {
        this.loadMapasSorters()
        this.loadRampas()
        this.loadData()    
    },
    beforeUpdate() {
		this.reload_Rota()
        const id = this.$route.params.id_sorter
        if(id === undefined) {
            this.situacao = "Inativo"
        } else {               
            this.situacao = "Ativo"
        }
        if(id_msa != this.sorter.id_mapa_sorter) {
            this.loadMapasSorters()
            this.loadRampas()
        }
	}
}

</script>

<style lang="scss">
.cbx_sorter {
    .vs__dropdown-menu {
        // TAMANHO COMBOBOX
        height: 170px;
    }
}
</style>