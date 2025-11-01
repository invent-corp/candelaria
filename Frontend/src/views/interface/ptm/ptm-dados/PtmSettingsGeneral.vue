<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar v-if="situacao == 'Inativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey />
            <vs-avatar v-if="situacao == 'Ativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey :text="(ptm.mapa_ptm) + ' x ' + (ptm.endereco_ptm)"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color=color_Situacao > {{ situacao }} </vs-chip>
                <label v-if="situacao == 'Ativo'" class="text-lg flex flex-wrap items-center justify-start" >PTM: {{ptm.mapa_ptm + ' x ' + ptm.endereco_ptm }}</label>
            </div>
        </div>

        <div class="mt-2 cbx_ptl">
            <label class="text-sm" >Mapa PTM</label>
            <v-select placeholder="Selecione" v-model="ptm.id_mapa_ptm" :options=mapasPtms :reduce="nome => nome.id_mapa_ptm" :menu-props="{ top: true, offsetY: true }" label="nome" >
                <template #option="{ nome, descricao, situacao }">
                    {{ nome }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Descrição: </h>
                    <h class="font-bold">{{ descricao }}</h>
                </template>
            </v-select>
        </div>

        <div class="mt-2 cbx_ptl">
            <label class="text-sm" >Endereço</label>
            <v-select placeholder="Selecione" v-model="ptm.id_endereco_ptm" :options=enderecos :reduce="descricao => descricao.id_endereco_ptm" :menu-props="{ top: true, offsetY: true }" label="descricao" >
                <template #option="{ descricao, codigo, situacao }">
                    {{ descricao }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Código: </h>
                    <h class="font-bold">{{ codigo }}</h>
                </template>
                <span slot="no-options">Todos Endereços para esse Mapa já foram cadastrados!</span>
            </v-select>
        </div>

        <div class="mt-8" />

		<p v-if=" situacao == 'Ativo' ">Arraste e Solte - Adicione a(s) <code>Rota(s)</code> as <code>Rota(s) Vinculada(s)</code> no PTM atual:</p>

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
					<vs-list-header title="Rota(s) Vinculada(s)" color="primary"></vs-list-header>
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

var id_mp = ""
var id_mpa = ""
var id_endereco_ptm = ""

export default {
    components: {
        'v-select': vSelect,
        draggable,
        Prism
    },
    data() {
        return {
            ptm: [],
            mapasPtms: [],
            enderecos: [],
            todasRotas: [],
            rotaAtiva: [],
            rotaVinculada: [],
            situacao: "",
            id_mp: "",
            id_mpa: "",
            id_endereco_ptm: ""
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_ptm
            if(id != undefined) {
                axios.get(`${backendUrl}/ptm/${id}`)
                    .then(res => {this.ptm = res.data
                    id_mp = this.ptm.id_mapa_ptm
                    this.loadRotaAtiva()
                    this.loadMapasPtms()
                    this.loadEnderecos()
                    })
                this.loadRotaVincu()
            }
            this.loadRotaAtiva() 
        },
        loadMapasPtms() {
            const id = this.$route.params.id_ptm
            id_mpa = this.ptm.id_mapa_ptm
            if (id == undefined) {
                axios.get(`${backendUrl}/mapaPtmAtivo/0`)
                    .then(res => {this.mapasPtms = res.data})
            } else {
                axios.get(`${backendUrl}/mapaPtmAtivo/${id_mpa}`)
                    .then(res => {this.mapasPtms = res.data})
            }
        },
        loadEnderecos() {
            id_mpa = this.ptm.id_mapa_ptm
            if (this.ptm.id_endereco_ptm == undefined) {
                axios.get(`${backendUrl}/enderecoptmAtivoPtm/0&${id_mpa}`)
                    .then(res => {this.enderecos = res.data})
            } else {
                id_endereco_ptm = this.ptm.id_endereco_ptm
                axios.get(`${backendUrl}/enderecoptmAtivoPtm/${id_endereco_ptm}&${id_mpa}`)
                    .then(res => {this.enderecos = res.data})
            }
        },
        loadRotaAtiva() {
            id_mpa = this.ptm.id_mapa_ptm
            axios.get(`${backendUrl}/rotaAtivaPtm/${id_mp}`)
				.then(res => {this.rotaAtiva = res.data})
        },
        loadRotaVincu() {
            const id = this.$route.params.id_ptm
            axios.get(`${backendUrl}/rotaPtm/${id}`)
                .then(res => {this.rotaVinculada = res.data})
        },
        save() {
            const method = this.ptm.id_ptm ? 'put' : 'post'
            const id = this.ptm.id_ptm ? `/${this.ptm.id_ptm}` : ''
            axios[method](`${backendUrl}/ptm${id}`, this.ptm)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => { 
                    if(err.message === "Request failed with status code 500" 
                    & this.ptm.id_mapa_ptm !== undefined & this.ptm.id_endereco_ptm !== undefined) {
                        this.$vs.notify({
                        icon: "error",
                        color: 'danger',
                        title: 'ERRO',
                        text: 'Relação Mapa PTM X Endereço já Existe!',
                        })
                    }
                })
            const id_params = this.$route.params.id_ptm
            if(id_params !== undefined) {
                if(this.rotaVinculada !== {}) {
                    this.deleteRotas()                
                    setTimeout(()=>{
                        for (var i in this.rotaVinculada) {				
                            var rotaPtm = `{"id_ptm":"${this.ptm.id_ptm}", "id_rota":"${this.rotaVinculada[i].id_rota}"}`
                            rotaPtm = JSON.parse(rotaPtm)			
                            axios.post(`${backendUrl}/rotaPtm/`, rotaPtm)
                                .then( console.log('OK'))	
                                .catch(err => { console.error(err) })
                        }
                        this.$router.push("/interface/ptm/consulta/").catch(() => {})
                    },1000)
                }
            }
        },
        deleteRotas() {
			const id = this.$route.params.id_ptm
			axios.delete(`${backendUrl}/rotaPtm/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reload() {
            const id = this.$route.params.id_ptm
            if(id === undefined) {
                var mapaPtmId = this.ptm.id_mapa_ptm
                var enderecoptmId = this.ptm.id_endereco_ptm
                if (mapaPtmId !== undefined & enderecoptmId !== undefined) {
                    axios.get(`${backendUrl}/ptmCadastro/${mapaPtmId}&${enderecoptmId}`)
                        .then(res => {this.ptmCadastro = res.data		
                        var ptmId = this.ptmCadastro.id_ptm
                        this.$router.push(`/interface/ptm/cadastro/${ptmId}/`).catch(() => {})
                        this.$router.push(`/pages/refresh/`).catch(() => {})
                        } 
                        )
                }
            }
        },
        reload_Rota() {          
            this.refresh_Rota = this.rotaAtiva.filter( rota1 => !this.rotaVinculada.filter( rota2 => rota1.id_rota == rota2.id_rota).length)
            this.rotaAtiva = this.refresh_Rota 
		},
        reset() {
            this.ptm = {}
            this.rotaAtiva = {}
            this.rotaVinculada = {}
            this.$router.push("/interface/ptm/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'PTM Atualizado',
				text: 'PTM Atualizado com Sucesso!',
			})
		},
        reset_comp() {
            const id = this.$route.params.id_ptm
            if(id !== undefined) {
                const id = this.$route.params.id_ptm
                axios.get(`${backendUrl}/rotaPtm/${id}`)
                    .then(res => {this.rotaVinculada = res.data})
                axios.get(`${backendUrl}/ptm/${id}`)
                    .then(res => {this.ptm = res.data})
                axios.get(`${backendUrl}/rotaAtivaPtm/${id_mp}`)
                    .then(res => {this.rotaAtiva = res.data})
            } 
            if(id === undefined) {
                this.ptm = {}
            }
        }, 
    },
    computed:{
        color_Situacao() {
            const id = this.$route.params.id_ptm
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
        this.loadMapasPtms()
        this.loadEnderecos()
        this.loadData()    
    },
    beforeUpdate() {
		this.reload_Rota()
        const id = this.$route.params.id_ptm
			if(id === undefined) {
                this.situacao="Inativo"
            } else {
                this.situacao = "Ativo"
            }
        if(id_mpa != this.ptm.id_mapa_ptm) {
            this.loadMapasPtms()
            this.loadEnderecos()
        }   
	}
}

</script>

<style lang="scss">
.cbx_ptl {
    .vs__dropdown-menu {
        // TAMANHO COMBOBOX
        height: 170px;
    }
}
</style>