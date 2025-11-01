<template>
	<vx-card no-shadow>

		<vs-prompt title="Gerar JSON" class="export-options" @cancel="clearFields" @accept="saveJSON" accept-text="Exportar" cancel-text="Cancelar" @close="clearFields" :active.sync="activePromptJSON">
			<vs-input v-model="fileNameJSON" placeholder="Insira o nome do arquivo..." class="w-full" />
			<v-select v-model="selectedFormatJSON" :options="formatJSON" class="my-4" />
		</vs-prompt> 

		<div class="flex-wrap items-center justify-start">

			<div class="flex vx-col">
				<vs-icon color='primary' class="mr-2 mt-2" icon-pack="feather" icon="icon-download-cloud"></vs-icon>
				<p class="mb-2 mt-1 text-lg">Número Identificador</p>
			</div>
			<vs-input id="inputjson" v-model="identificadorJSON" class="sm:mt-1 w-full text-lg" icon-pack="feather" icon="icon-upload" label="Identificador"></vs-input>
			<div class="flex vx-col w-1/1 ">
				<vs-input id="resultjson" disabled class="sm:mt-1 w-full text-lg" icon-pack="feather" icon="icon-download" label="Status da Importação"></vs-input>
				<vs-button class="w-48 h-10 mt-8 text-sm" icon-pack="feather" icon="icon-upload" @click="loadJSON" id="export">Gerar JSON</vs-button>
			</div>
			<vs-divider class="mt-4 mb-2"/>
			
		</div>

	</vx-card>
</template>

<script>

import axios from 'axios'
import { wsIntegracaoUrl } from '@/globalComponents'
import vSelect from 'vue-select'


export default {
	data() {
		return {
			identificadorJSON: "",
			JSON: [],
			fileNameJSON: "",
			formatJSON: "json",
			selectedFormatJSON: "json",
			activePromptJSON: false,
		}
	},
	components: {
		vSelect,
	},
	methods: {
		saveJSON() {
			var FileSaver = require('file-saver')
			var blob = new Blob([this.JSON], {type: "text/plain;charset=utf-8"})
			if (this.fileNameJSON == '' || null) {
				this.fileNameJSON = 'Invent - Identificador ' + this.identificadorJSON
			}
			FileSaver.saveAs(blob, this.fileNameJSON + "." + this.selectedFormatJSON)
			this.showUpdateSuccess()
			this.execTimeout()
		},
		loadJSON() {
			if (this.identificadorJSON == '') {
				document.getElementById('resultjson').value = ' >> ERRO - Nº Identificador Inválido!'
				this.showUpdateError()
				this.limparTimeout()
			} else {
				const identificador = this.identificadorJSON
				axios.get(`${wsIntegracaoUrl}/identificador/${identificador}`)
				.then(res => {
					this.JSON = JSON.stringify(res.data)
					if (this.JSON == '">> DADOS (INT_NUMERO_IDENTIFICADOR) Não Encontrados - Nº Identificador: ' + this.identificadorJSON + '"') {
						document.getElementById('resultjson').value = ' >> DADOS Não Encontrados! - Nº Identificador: ' + this.identificadorJSON
						this.showUpdateError()
						this.limparTimeout()
					} else {
						this.activePromptJSON=true
					}
				})
				.catch(err => {
					if (err.message === "Network Error") {
						document.getElementById('resultjson').value = ' >> ERRO - Nº Identificador - '+ err +'!'
					} else {
						document.getElementById('resultjson').value = ' >> ERRO - Nº Identificador Inválido!'
					}
					this.showUpdateError()
					this.limparTimeout()
				})	
			}
		},
		limparTimeout() {
			setTimeout(()=>{
				this.identificadorJSON = ''
				this.fileNameJSON = ''
				document.getElementById('inputjson').value = ''
				document.getElementById('resultjson').value = ''
			},5000)
		},
		execTimeout() {
			setTimeout(()=>{
				document.getElementById('resultjson').value = ' >> SUCESSO = Nº Identificador - JSON Gerado!'
				this.limparTimeout()
			},1000)
		},
		clearFields() {
			this.identificadorJSON = ''
			this.fileNameJSON = ''
			document.getElementById('inputjson').value = ''
			document.getElementById('resultjson').value = ''
		},
		showUpdateSuccess() {
			this.$vs.notify({
                icon: 'check',
				color: 'success',
				title: 'Sucesso na Integração',
				text: 'Integração Efetuada com Sucesso!'
			})
		},
		showUpdateError() {
			this.$vs.notify({
                icon: 'close',
				color: 'danger',
				title: 'Falha na Geração',
				text: 'Geração NÃO Realizada!'
			})
		},
	}
}
</script>

<style>

	input[type=file], select {
		width: 100%;
		font-size: 1.1rem;
		border-radius: 6px;
		
	}

	input[type=file]::file-selector-button {
		border: 2px solid #ffc500;
		color: grey;
		padding: 8px 16px;
		margin: 0 16px 0 0;
		border-radius: 6px;
		background-color: transparent;
		transition: 0.5s;
	}

	input[type=file]::file-selector-button:hover {
		background-color: #ffc500;
		border: 2px solid #ffc500;
		cursor: pointer;
	}

</style>
