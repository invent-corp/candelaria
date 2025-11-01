<template>
  <div class="vx-card p-6">

    <div class="mt-3">

      <div class="flex flex-wrap items-center justify-end">

        <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-plus" @click="promptNovaEtiquetaAtivo = true">
          Etiqueta
        </vs-button>

        <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-plus" @click="promptAtivo = true">
          Impressora
        </vs-button>

        <vs-button class="ml-4 mt-2" icon-pack="feather" icon="icon-hash" type="border">
          {{ `Etiqueta Pallet Atual: ${this.etiquetaAtual}` }}
        </vs-button>
      </div>

      <label class="text-sm">Impressoras Disponivels</label>
      <v-select v-validate="'required'" v-model="impressoraSelecionada" name="opcaoDeEtiquetas" placeholder="Selecione"
        class="mb-6" @input="onChange" :options="impressorasDisponiveis" />

      <label class="text-sm">Etiqueta</label>
      <v-select v-validate="'required'" v-model="etiquetaSelecioanda" name="opcaoDeEtiquetas" placeholder="Selecione"
        class="mb-6" @input="onChange" :options="etiquetasDisponiveis" />

      <label class="text-sm">Tipo Etiqueta</label>
      <v-select v-validate="'required'" v-model="tipoEtiqueta" name="opcaoDeEtiquetas" placeholder="Selecione"
        @input="onChange" :options="opcaoDeEtiquetas" />

    </div>

    <div v-if="mostrarInputs" class="flex flex-wrap items-center justify-start mt-6">

      <div v-if="!soUmaEtiqueta">
        <label class="text-sm">De</label>
        <vs-input icon-pack="feather" icon="icon-chevron-right" v-model="valorDe" :disabled="!podeDefinirOAte"
          class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" />
      </div>
      <div v-if="!soUmaEtiqueta">
        <label class="text-sm">Até</label>
        <vs-input icon-pack="feather" icon="icon-chevron-left" v-model="valorAte"
          class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" />
      </div>

      <div v-if="soUmaEtiqueta">
        <label class="text-sm">Etiqueta</label>
        <vs-input icon-pack="feather" icon="icon-bookmark" v-model="etiqueta"
          class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" />
      </div>

      <div class="flex flex-end items-center justify-end mt-6">
        <vs-button @click="submitForm" class="ml-auto " icon-pack="feather" icon="icon-printer">Imprimir</vs-button>
      </div>

    </div>

    <!-- Adicionar Impressora -->
    <vs-prompt title="Nova Impressora" @cancel="fecharPrompt" @accept="cadastrarImpressora" accept-text="Criar"
      cancel-text="Cancelar" @close="fecharPrompt" :active.sync="promptAtivo">
      <label class="text-sm ">Ip</label>
      <vs-input class="w-full my-4" v-model="ipImpressoraParaSalvar" />
      <label class="text-sm ">Nome</label>
      <vs-input class="w-full my-4" v-model="nomeImpressoraParaSalvar" />
      <div class="flex p-2">
      </div>
    </vs-prompt>

    <!-- Adicionar Etiqueta -->
    <vs-prompt title="Nova Etiqueta" @cancel="fecharPromptEtiqueta" @accept="cadastrarEtiqueta" accept-text="Criar"
      cancel-text="Cancelar" @close="fecharPrompt" :active.sync="promptNovaEtiquetaAtivo">
      <label class="text-sm ">Nome</label>
      <vs-input class="w-full my-4" v-model="nomeEtiquetaParaSalvar" />
      <label class="text-sm ">Etiqueta</label>
      <vs-textarea class="w-full my-4" v-model="modeloEtiquetaParaSalvar" />
      <div class="flex p-2">
      </div>
    </vs-prompt>

  </div>
</template>

<script>
import vSelect from 'vue-select'
import axios from 'axios'

export default {
  components: {
    'v-select': vSelect,
  },
  data() {
    return {
      opcaoDeEtiquetas: ['1. Abre Pallet', '2. Fecha Pallet', '3. Reseta Rotina de abertura', '4. Identificador de Pallet', '5. Reimpressão de Etiqueta',],
      etiquetaAtual: '',
      tipoEtiqueta: '',
      podeDefinirOAte: false,
      valorDe: '',
      valorAte: '',
      etiqueta: '',
      impressorasDisponiveis: '',
      impressoraSelecionada: '',
      promptAtivo: false,
      ipImpressoraParaSalvar: '',
      nomeImpressoraParaSalvar: '',
      url: 'http://localhost:4000',
      etiquetasDisponiveis: '',
      etiquetaSelecioanda: '',
      promptNovaEtiquetaAtivo: false,
      nomeEtiquetaParaSalvar: '',
      modeloEtiquetaParaSalvar: ''
    }
  },
  computed: {
    soUmaEtiqueta() {
      return this.tipoEtiqueta === '5. Reimpressão de Etiqueta'
    },
    mostrarInputs() {
      return this.tipoEtiqueta !== ''
    }
  },
  methods: {
    fecharPrompt() {
      this.promptAtivo = false
      this.promptNovaEtiquetaAtivo = false
    },
    async cadastrarImpressora() {
      try {
        const res = await axios.post(this.url + '/impressora', {
          nome: this.nomeImpressoraParaSalvar,
          ip: this.ipImpressoraParaSalvar,
          porta: 9100
        })
        this.loadData()
        this.showUpdateSuccess(res.data.message)
      } catch (error) {
        this.showCatchError('Erro ao salvar impressora', error)
      }
    },
    async cadastrarEtiqueta() {
      try {
        const res = await axios.post(this.url + '/etiqueta', {
          nome: this.nomeEtiquetaParaSalvar,
          etiqueta: this.modeloEtiquetaParaSalvar
        })
        this.loadData()
        this.showUpdateSuccess(res.data.message)
      } catch (error) {
        this.showCatchError('Erro ao salvar etiqueta', error)
      }
    },
    onChange() {
      if (this.tipoEtiqueta === '4. Identificador de Pallet') {
        this.podeDefinirOAte = false
        this.valorDe = parseInt(this.etiquetaAtual) + 1
      }
      else {
        this.podeDefinirOAte = true
        this.valorDe = ''
        this.valorAte = ''
      }
    },
    async loadData() {
      try {
        const etiqueta_atual = await axios.get(this.url + '/ultima-etiqueta')
        const impressoras = await axios.get(this.url + '/impressoras')
        const etiquetas = await axios.get(this.url + '/etiquetas')
        this.impressorasDisponiveis = impressoras.data.map(i => `${i.id} -  ${i.nome}`)
        this.etiquetasDisponiveis = etiquetas.data.map(i => `${i.id} -  ${i.nome}`)
        this.etiquetaAtual = etiqueta_atual.data.message.etiqueta_atual
      } catch (error) {
        this.showCatchError('Erro', 'Erro ao carregar dados')
      }
    },
    submitForm() {
      if ((this.valorAte == '' || this.valorDe == '') && this.etiqueta === '') {
        this.showCatchError('Erro', 'Preencha todos os campos')
      } else if (parseInt(this.valorAte) < parseInt(this.valorDe)) {
        this.showCatchError('Erro', 'O valor De deve ser menor que o valor Até')
      } else {
        switch (this.tipoEtiqueta) {
          case '1. Abre Pallet':
            this.imprimir(this.montarEtiquetas({ prefixo: 'AP', tamanho: 4 }))
            break
          case '2. Fecha Pallet':
            this.imprimir(this.montarEtiquetas({ prefixo: 'FP', tamanho: 4 }))
            break
          case '3. Reseta Rotina de abertura':
            this.imprimir(this.montarEtiquetas({ prefixo: 'RP', tamanho: 4 }))
            break
          case '4. Identificador de Pallet':
            this.imprimir(this.montarEtiquetas({ tamanho: 8 }))
              .then(() => {
                this.atualizarEtiquetaAtual()
              })
              .catch(() => this.showCatchError('Erro', 'Erro Ao Imprimir etiqueta'))
            break
          case '5. Reimpressão de Etiqueta':
            this.imprimir([{ codPallet: this.etiqueta.toString() }])
            break
          default:
            this.showCatchError('Erro', 'Revise os dados')
            break
        }
      }
    },
    async imprimir(etiquetas) {
      if (!this.etiquetaSelecioanda && !this.impressoraSelecionada) {
        this.showCatchError('Selecione a etiqueta e a impressora')
      } else {
        const data = {
          etiquetas: [
            ...etiquetas
          ],
          id_etiqueta: Number(this.etiquetaSelecioanda.split('-')[0].trim()),
          id_impressora: Number(this.impressoraSelecionada.split('-')[0].trim()),
        }
        await axios.post(this.url + '/imprimir', data)
      }
    },
    montarEtiquetas({ prefixo = '', tamanho = 0 }) {
      const qtdDeEtiquetas = parseInt(this.valorAte) - parseInt(this.valorDe) + 1
      const etiquetas = []
      for (let i = 0; i < qtdDeEtiquetas; i++) {
        etiquetas.push({
          codPallet: prefixo + (parseInt(this.valorDe) + i).toString().padStart(tamanho, '0')
        })
      }
      return etiquetas
    },
    atualizarEtiquetaAtual() {
      axios.post(this.url + '/ultima-etiqueta', {
        etiqueta_atual: this.valorAte
      })
        .then(() => {
          this.showUpdateSuccess('Sucesso', 'Nova Etiqueta Atualizada')
        })
        .catch(() => {
          this.showCatchError('Erro', 'Erro ao enviar dados')
        })
    },
    showUpdateSuccess(text) {
      this.$vs.notify({
        icon: "check",
        color: 'success',
        title: 'Sucesso',
        text
      })
    },
    showCatchError(title, text) {
      this.$vs.notify({
        icon: "check",
        color: 'danger',
        title,
        text
      })
    },
  },
  mounted() {
    this.loadData()
  }
}

</script>
