<template>
    <vx-card no-shadow>
        
        <div class="flex flex-wrap items-center justify-start">
            <vs-avatar size="50px" class="mr-4 mb-4 text-xl" color=grey :text="produtos.descricao"/>
            <div>
                <vs-chip class="mr-4 mb-4" :color="color_situacao" > {{ produtos.situacao }} </vs-chip>
                <p class="text-lg flex flex-wrap items-center justify-start" >Produto: {{ produtos.descricao }}</p>
            </div>
        </div>


        <vs-input v-validate="'required'" name="EAN do Produto " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="EAN do Produto" v-model="produtos.codigo_produto"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('EAN do Produto ')">{{ errors.first('EAN do Produto ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Sku " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Sku" v-model="produtos.sku"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Sku ')">{{ errors.first('Sku ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required'" name="Descrição " class="w-full" icon-pack="feather" icon="icon-radio" label-placeholder="Descrição" v-model="produtos.descricao"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Descrição ')">{{ errors.first('Descrição ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Altura " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Altura" v-model="produtos.altura"></vs-input>
        <div class="text-primary text-sm mb-6" v-show="errors.has('Altura ')">{{ errors.first('Altura ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Largura " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Largura" v-model="produtos.largura"></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('Largura ')">{{ errors.first('Largura ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|numeric'" name="Comprimento " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Comprimento" v-model="produtos.comprimento"></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('Comprimento ')">{{ errors.first('Comprimento ') }}</div>
        <div class="mb-6"/>

        <vs-input disabled v-validate="'numeric'" name="Cubagem " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Cubagem" v-model=calcula_cubagem></vs-input>
        <div class="text-primary text-sm mb-6"  v-show="errors.has('Cubagem ')">{{ errors.first('Cubagem ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|decimal'" name="Peso " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Peso" v-model="produtos.peso"></vs-input>
        <div class="text-primary text-sm w-full" v-show="errors.has('Peso ')">{{ errors.first('Peso ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|decimal'" name="Peso Líquido " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Peso Líquido" v-model="produtos.peso_liquido"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Peso Líquido ')">{{ errors.first('Peso Líquido ') }}</div>
        <div class="mb-6"/>

        <vs-input v-validate="'required|decimal'" name="Tara " class="w-full" icon-pack="feather" icon="icon-hard-drive" label-placeholder="Tara" v-model="produtos.tara"></vs-input>
        <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Tara ')">{{ errors.first('Tara ') }}</div>
        <div class="mb-6"/>

        <div v-if="this.$route.meta.pageTitle !== 'Perfil'" class="mt-2 cbx_tipoproduto">
            <label class="text-sm" >Tipo Produto</label>
            <v-select v-validate="'required'" name="Tipo Produto " placeholder="Selecione" v-model="produtos.id_tipo_produto" :options=tipo_produto :reduce="nome => nome.id_tipo_produto" label="descricao"  />
            <div class="text-primary text-sm w-full" v-show="errors.has('Tipo Produto ')">{{ errors.first('Tipo Produto ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Embalagem</label>
            <v-select v-validate="'required'" name="Embalagem " class="text-sm" placeholder="Selecione" v-model="produtos.embalagem" :options="['BIN', 'CAIXA']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Embalagem ')">{{ errors.first('Embalagem ') }}</div>
        </div>

        <div class="mt-2">
            <label class="text-sm">Situação</label>
            <v-select v-validate="'required'" name="Situação " class="text-sm" placeholder="Selecione" v-model="produtos.situacao" :options="['Ativo', 'Inativo']"/>
            <div class="text-primary text-sm w-full mb-6" v-show="errors.has('Situação ')">{{ errors.first('Situação ') }}</div>
        </div>



        <div class="mt-8" />
        <div class="flex flex-wrap items-center justify-end">
            <vs-button class="ml-auto mt-2" icon-pack="feather" icon="icon-save"
                @click="submitForm">Salvar</vs-button>
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

var id_produtoAtivo = ""


const dictionary = {
    br: {
        messages:{
            required: field => 'O campo ' + field + ' é obrigatório.',
            decimal: field => 'O campo ' + field + ' pode conter apenas caracteres númericos ou ponto (.)',
            numeric: field => 'O campo ' + field + ' pode conter apenas números'
        }
    }
}


// Override and merge the dictionaries
Validator.localize(dictionary)
const validator = new Validator({ nome: 'decimal' })
validator.localize('br')

export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            produtos: [],
            tipo_produto: [],
            id_produtoAtivo: "",

        }
    },
    methods: {
        loadData() {
            const id = this.$route.params.id_produto
            if(id != undefined) {
            axios.get(`${backendUrl}/produtos/${id}`)
                .then(res => {this.produtos = res.data
                    id_produtoAtivo = this.produtos.id_tipo_produto
                    console.log(this.produtos.id_tipo_produto)
                this.loadTipoProduto()
                })
            }
        },
        loadTipoProduto() {
            const id = this.$route.params.id_produto
            id_produtoAtivo = this.produtos.id_tipo_produto
            if (id == undefined) {
                axios.get(`${backendUrl}/tipoprodutoAtiva/0`)
                    .then(res => (this.tipo_produto = res.data))
            } else {
                axios.get(`${backendUrl}/tipoprodutoAtiva/${id_produtoAtivo}`)
                    .then(res => (this.tipo_produto = res.data))
            }
        },

        save() {
            const method = this.produtos.id_produto ? 'put' : 'post'
            const id = this.produtos.id_produto ? `/${this.produtos.id_produto}` : ''

            if (this.produtos.sku == 0) {
                // O SKU é igual a 0, ignorar validação e salvar os dados
                axios[method](`${backendUrl}/produtos${id}`, this.produtos)
                .then(() => {
                    this.showUpdateSuccess()
                    this.reload()
                })
                .catch(err => {
                    console.error(err)
                })
            } else {
                // Validar se já existe outro produto com o mesmo SKU
                axios.get(`${backendUrl}/produtosSku/${this.produtos.sku}`)
                .then(res => {
                    if (res.data.length > 0 && res.data[0].id_produto !== this.produtos.id_produto) {
                    // Já existe um produto com o mesmo SKU
                        this.$vs.notify({
                        icon: 'error',
                        color: 'danger',
                        title: 'Erro de validação',
                        text: 'Já existe outro produto com o mesmo SKU.'
                        })
                    } else {
                        axios[method](`${backendUrl}/produtos${id}`, this.produtos)
                        .then(() => {
                            this.showUpdateSuccess()
                            this.reload()
                        })
                        .catch(err => { console.error(err) })
                    }
                })
                .catch(err => {
                console.error(err)
                })
            }

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
            this.produtos = {}
            this.$router.push("/cadastros/produtos/cadastro/").catch(() => {})
        },
        showUpdateSuccess() {
			this.$vs.notify({
                icon: "check",
				color: 'success',
				title: 'Produto Atualizado',
				text: 'Produto Atualizado com Sucesso!'
			})
		},
        reload() {
            this.$router.push("/cadastros/produtos/consulta/").catch(() => {})
        },
        reset_comp() {
            const id = this.$route.params.id_produto
            if(id !== undefined) {
            axios.get(`${backendUrl}/produtos/${id}`)
                .then(res => {this.produtos = res.data})
            } else {
            this.produtos = {}
            }
        },
        altera_cubagem() {
          this.produtos.cubagem = this.produtos.altura * this.produtos.comprimento * this.produtos.largura
          if (isNaN(this.produtos.cubagem)) {
             this.produtos.cubagem = 0
          }
        }
    },
    
    computed:{
        color_situacao() {
            if (this.produtos.situacao === "Ativo") return "success"
            else if (this.produtos.situacao === "Inativo") return "danger"
        },
        reset_cadastro() {
            if (this.$route.meta.pageTitle !== 'Editar') return this.reset_comp()
        },   

        calcula_cubagem : function() {
          this.altera_cubagem()
          return this.produtos.cubagem
        }
        
    },
    mounted() {
        this.loadTipoProduto() 
        this.loadData() 
    },
    beforeUpdate() {
        if(id_produtoAtivo != this.produtos.id_tipo_produto) {
            this.loadTipoProduto()
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

.ladoalado {
    float: left;
    height: 200px;
}
</style>