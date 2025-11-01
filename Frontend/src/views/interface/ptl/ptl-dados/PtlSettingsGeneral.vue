<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar v-if="situacao == 'Inativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey />
            <vs-avatar v-if="situacao == 'Ativo'" size="50px" class="mr-4 mb-4 text-xl" color=grey :text="(ptl.mapa_ptl) + ' x ' + (ptl.picking)"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color=color_Situacao > {{ situacao }} </vs-chip>
                <label v-if="situacao == 'Ativo'" class="text-lg flex flex-wrap items-center justify-start" >PTL: {{ptl.mapa_ptl + ' x ' + ptl.picking }}</label>
            </div>
        </div>

        <div class="mt-2 cbx_ptl">
            <label class="text-sm" >Mapa PTL</label>
            <v-select placeholder="Selecione" v-model="ptl.id_mapa_ptl" :options=mapasPtls :reduce="nome => nome.id_mapa_ptl" :menu-props="{ top: true, offsetY: true }" label="nome" >
                <template #option="{ nome, descricao, situacao }">
                    {{ nome }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Descrição: </h>
                    <h class="font-bold">{{ descricao }}</h>
                </template>
            </v-select>
        </div>

        <div class="mt-2 cbx_ptl">
            <label class="text-sm" >Picking</label>
            <v-select placeholder="Selecione" v-model="ptl.id_picking" :options=pickings :reduce="descricao => descricao.id_picking" :menu-props="{ top: true, offsetY: true }" label="descricao" >
                <template #option="{ descricao, codigo, situacao }">
                    {{ descricao }} - {{ situacao }}
                    <br />
                    <h class="ml-4">Código: </h>
                    <h class="font-bold">{{ codigo }}</h>
                </template>
                <span slot="no-options">Todos Pickings para esse Mapa já foram cadastrados!</span>
            </v-select>
        </div>

        <div class="mt-8" />

		<p v-if=" situacao == 'Ativo' ">Arraste e Solte - Adicione a(s) <code>Rota(s)</code> as <code>Rota(s) Vinculada(s)</code> no PTL atual:</p>

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
var id_picking = ""

export default {
    components: {
        'v-select': vSelect,
        draggable,
        Prism
    },
    data() {
        return {
            ptl: [],
            mapasPtls: [],
            pickings: [],
            todasRotas: [],
            rotaAtiva: [],
            rotaVinculada: [],
            situacao: "",
            id_mp: "",
            id_mpa: "",
            id_picking: ""
        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_ptl
            if(id != undefined) {
                axios.get(`${backendUrl}/ptl/${id}`)
                    .then(res => {this.ptl = res.data
                    id_mp = this.ptl.id_mapa_ptl
                    this.loadRotaAtiva()
                    this.loadMapasPtls()
                    this.loadPickings()
                    })
                this.loadRotaVincu()
            }
            this.loadRotaAtiva() 
        },
        loadMapasPtls() {
            const id = this.$route.params.id_ptl
            id_mpa = this.ptl.id_mapa_ptl
            if (id == undefined) {
                axios.get(`${backendUrl}/mapaPtlAtivo/0`)
                    .then(res => {this.mapasPtls = res.data})
            } else {
                axios.get(`${backendUrl}/mapaPtlAtivo/${id_mpa}`)
                    .then(res => {this.mapasPtls = res.data})
            }
        },
        loadPickings() {
            id_mpa = this.ptl.id_mapa_ptl
            if (this.ptl.id_picking == undefined) {
                axios.get(`${backendUrl}/pickingAtivoPtl/0&${id_mpa}`)
                    .then(res => {this.pickings = res.data})
            } else {
                id_picking = this.ptl.id_picking
                axios.get(`${backendUrl}/pickingAtivoPtl/${id_picking}&${id_mpa}`)
                    .then(res => {this.pickings = res.data})
            }
        },
        loadRotaAtiva() {
            id_mpa = this.ptl.id_mapa_ptl
            axios.get(`${backendUrl}/rotaAtivaPtl/${id_mp}`)
				.then(res => {this.rotaAtiva = res.data})
        },
        loadRotaVincu() {
            const id = this.$route.params.id_ptl
            axios.get(`${backendUrl}/rotaPtl/${id}`)
                .then(res => {this.rotaVinculada = res.data})
        },
        save() {
            const method = this.ptl.id_ptl ? 'put' : 'post'
            const id = this.ptl.id_ptl ? `/${this.ptl.id_ptl}` : ''
            axios[method](`${backendUrl}/ptl${id}`, this.ptl)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => { 
                    if(err.message === "Request failed with status code 500" 
                    & this.ptl.id_mapa_ptl !== undefined & this.ptl.id_picking !== undefined) {
                        this.$vs.notify({
                        icon: "error",
                        color: 'danger',
                        title: 'ERRO',
                        text: 'Relação Mapa PTL X Picking já Existe!',
                        })
                    }
                })
            const id_params = this.$route.params.id_ptl
            if(id_params !== undefined) {
                if(this.rotaVinculada !== {}) {
                    this.deleteRotas()                
                    setTimeout(()=>{
                        for (var i in this.rotaVinculada) {				
                            var rotaPtl = `{"id_ptl":"${this.ptl.id_ptl}", "id_rota":"${this.rotaVinculada[i].id_rota}"}`
                            rotaPtl = JSON.parse(rotaPtl)			
                            axios.post(`${backendUrl}/rotaPtl/`, rotaPtl)
                                .then( console.log('OK'))	
                                .catch(err => { console.error(err) })
                        }
                        this.$router.push("/interface/ptl/consulta/").catch(() => {})
                    },1000)
                }
            }
        },
        deleteRotas() {
			const id = this.$route.params.id_ptl
			axios.delete(`${backendUrl}/rotaPtl/${id}`)
				.then(() => {})
				.catch(err => { console.error(err) })
		},
        reload() {
            const id = this.$route.params.id_ptl
            if(id === undefined) {
                var mapaPtlId = this.ptl.id_mapa_ptl
                var pickingId = this.ptl.id_picking
                if (mapaPtlId !== undefined & pickingId !== undefined) {
                    axios.get(`${backendUrl}/ptlCadastro/${mapaPtlId}&${pickingId}`)
                        .then(res => {this.ptlCadastro = res.data		
                        var ptlId = this.ptlCadastro.id_ptl
                        this.$router.push(`/interface/ptl/cadastro/${ptlId}/`).catch(() => {})
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
            this.ptl = {}
            this.rotaAtiva = {}
            this.rotaVinculada = {}
            this.$router.push("/interface/ptl/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'PTL Atualizado',
				text: 'PTL Atualizado com Sucesso!',
			})
		},
        reset_comp() {
            const id = this.$route.params.id_ptl
            if(id !== undefined) {
                const id = this.$route.params.id_ptl
                axios.get(`${backendUrl}/rotaPtl/${id}`)
                    .then(res => {this.rotaVinculada = res.data})
                axios.get(`${backendUrl}/ptl/${id}`)
                    .then(res => {this.ptl = res.data})
                axios.get(`${backendUrl}/rotaAtivaPtl/${id_mp}`)
                    .then(res => {this.rotaAtiva = res.data})
            } 
            if(id === undefined) {
                this.ptl = {}
            }
        }, 
    },
    computed:{
        color_Situacao() {
            const id = this.$route.params.id_ptl
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
        this.loadMapasPtls()
        this.loadPickings()
        this.loadData()    
    },
    beforeUpdate() {
		this.reload_Rota()
        const id = this.$route.params.id_ptl
			if(id === undefined) {
                this.situacao="Inativo"
            } else {
                this.situacao = "Ativo"
            }
        if(id_mpa != this.ptl.id_mapa_ptl) {
            this.loadMapasPtls()
            this.loadPickings()
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